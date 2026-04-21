#!/usr/bin/env node
/**
 * One-off repair for articles where generate.mjs's old splitFrontmatter
 * produced a stub frontmatter (title: Untitled, slug: untitled) and stuffed
 * the model's real markdown — including its real frontmatter wrapped in a
 * code fence — into the body.
 *
 * Detects that pattern, extracts the inner frontmatter, and rewrites the
 * file in place using the standard markdown helper.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CONTENT_ROOT, writeArticle } from './lib/markdown.mjs';

// Quote unquoted scalar values containing a ':' on whitelisted top-level keys
// so YAML doesn't choke on titles like "Funeral planning: a guide".
function preCleanYaml(yaml) {
  const keys = ['title', 'description'];
  return yaml
    .split('\n')
    .map((line) => {
      const m = line.match(/^(\s*)([A-Za-z0-9_-]+):\s+(.*)$/);
      if (!m) return line;
      const [, indent, key, val] = m;
      if (!keys.includes(key)) return line;
      const trimmed = val.trim();
      if (!trimmed || /^["'\[\{]/.test(trimmed)) return line;
      if (trimmed.includes(':')) {
        const escaped = trimmed.replace(/"/g, '\\"');
        return `${indent}${key}: "${escaped}"`;
      }
      return line;
    })
    .join('\n');
}

function safeParse(text) {
  try {
    return matter(text);
  } catch {
    const m = text.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    if (!m) return null;
    const cleaned = `---\n${preCleanYaml(m[1])}\n---\n${m[2]}`;
    try {
      return matter(cleaned);
    } catch (e) {
      return null;
    }
  }
}

let repaired = 0;
let skipped = 0;
let failed = 0;

for (const v of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
  if (!v.isDirectory()) continue;
  const dir = path.join(CONTENT_ROOT, v.name);
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const full = path.join(dir, file);
    const raw = fs.readFileSync(full, 'utf8');
    const parsed = matter(raw);

    if (parsed.data.slug !== 'untitled') {
      skipped++;
      continue;
    }

    const body = parsed.content;
    const fence = body.match(/^```(?:yaml|markdown|md)?\s*\n([\s\S]*?)\n```\s*([\s\S]*)$/);
    let inner = fence ? fence[1] : body.trim();
    let trailing = fence ? fence[2] : '';

    if (!inner.startsWith('---')) {
      console.warn(`[skip] ${v.name}/${file}: no frontmatter found inside body`);
      continue;
    }

    const innerParsed = safeParse(inner + '\n' + trailing);
    if (!innerParsed || !innerParsed.data || !innerParsed.data.slug) {
      console.warn(`[fail] ${v.name}/${file}: could not parse inner frontmatter`);
      failed++;
      continue;
    }

    const slug = file.replace(/\.md$/, '');
    // Preserve the scheduled published date from the outer stub — it was set
    // by schedule.mjs and must not be overwritten by the model's arbitrary date.
    const fixedData = {
      ...innerParsed.data,
      published: parsed.data.published || innerParsed.data.published,
      lastReviewed: parsed.data.lastReviewed || innerParsed.data.lastReviewed,
    };
    if (fixedData.published instanceof Date) {
      fixedData.published = fixedData.published.toISOString().slice(0, 10);
    }
    writeArticle(v.name, slug, fixedData, innerParsed.content);
    repaired++;
    console.log(`[repair] ${v.name}/${file}`);
  }
}

console.log(`\nDone. Repaired ${repaired}, skipped ${skipped}, failed ${failed}.`);
