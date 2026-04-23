#!/usr/bin/env node
/**
 * Structural validation for markdown articles. Runs before `next build`.
 *
 * Catches issues that break RENDERING (different from compliance-check.mjs,
 * which catches editorial issues like banned phrases or stale dates).
 *
 * Hard failures exit non-zero so a broken article never ships:
 *   - body starts with a stray ``` fence (would wrap whole article in <pre>)
 *   - unbalanced fenced code blocks
 *   - unbalanced shortcode (:::callout etc) markers
 *   - :::faq block that produces zero parseable Q/A pairs
 *   - frontmatter contains both `date` and `published` (only `published` is read)
 *   - shortcode used that isn't in the supported vocabulary
 *
 * Soft warnings are printed but don't fail the build.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CONTENT_ROOT } from './lib/markdown.mjs';

const SUPPORTED_SHORTCODES = new Set([
  'callout',
  'compare',
  'proscons',
  'faq',
  'quote',
]);

function walk() {
  const out = [];
  if (!fs.existsSync(CONTENT_ROOT)) return out;
  for (const v of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
    if (!v.isDirectory()) continue;
    const dir = path.join(CONTENT_ROOT, v.name);
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      out.push({ vertical: v.name, slug: file.replace(/\.md$/, ''), file: path.join(dir, file) });
    }
  }
  return out;
}

// Detect ANY of the four formats the runtime parser accepts. Keep this in
// sync with parseFAQBody() in components/content/MarkdownRenderer.tsx -
// if you add a format there, mirror it here so validation reflects reality.
function looksLikeFAQ(body) {
  for (const raw of body.split('\n')) {
    const trimmed = raw.trim();
    // YAML-list shape: "- q: ..."
    if (/^\s*-\s*q\s*[:\-]\s*\S/i.test(raw)) return true;
    // Plain "q: ..." line
    if (/^q\s*[:\-]\s*\S/i.test(trimmed)) return true;
    // Bold question paragraph
    if (/^\*\*.+\*\*[?:]?\s*$/.test(trimmed)) return true;
    // ### Question? heading
    if (/^#{2,4}\s+.+\?\s*$/.test(trimmed)) return true;
  }
  return false;
}

function check({ vertical, slug, file }) {
  const raw = fs.readFileSync(file, 'utf8');
  const issues = [];

  let parsed;
  try {
    parsed = matter(raw);
  } catch (e) {
    return {
      vertical,
      slug,
      issues: [{ severity: 'hard', kind: 'frontmatter-parse', detail: e.message }],
    };
  }
  const { data, content } = parsed;

  // Body should not start with a stray fence.
  if (/^\s*```/m.test(content.split('\n').slice(0, 2).join('\n'))) {
    issues.push({
      severity: 'hard',
      kind: 'stray-leading-fence',
      detail: 'body starts with a ``` fence - wraps whole article in <pre>',
    });
  }

  // Fenced code blocks must be balanced.
  const fenceCount = (content.match(/^```/gm) || []).length;
  if (fenceCount % 2 === 1) {
    issues.push({
      severity: 'hard',
      kind: 'unbalanced-fence',
      detail: `${fenceCount} \`\`\` markers found (must be even)`,
    });
  }

  // Shortcode markers must be balanced (one ::: opens with a name, one ::: closes).
  const opens = (content.match(/^:::[a-z]+/gm) || []).length;
  const closes = (content.match(/^:::\s*$/gm) || []).length;
  if (opens !== closes) {
    issues.push({
      severity: 'hard',
      kind: 'unbalanced-shortcode',
      detail: `${opens} opening :::name vs ${closes} closing :::`,
    });
  }

  // Each shortcode must be a supported type AND any :::faq must produce a Q/A.
  const scRe = /^:::([a-z]+)(?:\{[^}]*\})?\n([\s\S]*?)\n:::/gm;
  let m;
  while ((m = scRe.exec(content)) !== null) {
    const [, type, body] = m;
    if (!SUPPORTED_SHORTCODES.has(type)) {
      issues.push({
        severity: 'hard',
        kind: 'unknown-shortcode',
        detail: `:::${type} is not a known block`,
      });
    }
    if (type === 'faq' && !looksLikeFAQ(body)) {
      issues.push({
        severity: 'hard',
        kind: 'empty-faq',
        detail: 'no parseable Q/A pairs (use "q:/a:" or "**Question**" lines)',
      });
    }
  }

  // Schema requires `published`; legacy `date` is ignored.
  if (data.date && !data.published) {
    issues.push({
      severity: 'hard',
      kind: 'legacy-date-field',
      detail: 'frontmatter has `date:` but no `published:` (only `published` is read)',
    });
  } else if (data.date && data.published) {
    issues.push({
      severity: 'warn',
      kind: 'duplicate-date-field',
      detail: 'frontmatter has both `date` and `published` - drop `date`',
    });
  }

  return { vertical, slug, issues };
}

function main() {
  const results = walk().map(check);
  const hard = [];
  const warn = [];
  for (const r of results) {
    for (const i of r.issues) {
      const line = `  - [${i.kind}] ${i.detail}`;
      if (i.severity === 'hard') hard.push(`/${r.vertical}/${r.slug}\n${line}`);
      else warn.push(`/${r.vertical}/${r.slug}\n${line}`);
    }
  }

  const total = results.length;
  console.log(`validate-content: scanned ${total} article(s)`);
  if (warn.length) {
    console.log(`\nwarnings (${warn.length}):`);
    for (const w of warn) console.log(w);
  }
  if (hard.length) {
    console.log(`\nhard failures (${hard.length}):`);
    for (const h of hard) console.log(h);
    console.log('\nFix the above before building. See lib/markdown.ts for runtime behaviour.');
    process.exit(1);
  }
  console.log('all clear');
}

main();
