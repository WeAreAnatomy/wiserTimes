#!/usr/bin/env node
/**
 * Scans every published article for:
 *   - Banned AI-signal phrases
 *   - Em dashes
 *   - Missing frontmatter fields
 *   - Financial advice phrases in finance content
 *   - Outdated lastReviewed dates (> 120 days)
 *
 * Writes /reports/compliance-YYYY-MM-DD.md and prints a summary.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CONTENT_ROOT } from './lib/markdown.mjs';
import { scan } from './lib/banned-words.mjs';

const REPORT_DIR = path.join(process.cwd(), 'reports');
fs.mkdirSync(REPORT_DIR, { recursive: true });

const REQUIRED_FIELDS = [
  'title',
  'description',
  'vertical',
  'contentType',
  'regulatoryDomain',
  'slug',
  'author',
  'published',
  'lastReviewed',
];

const staleDays = 120;

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

function check({ vertical, slug, file }) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data, content } = matter(raw);
  const issues = [];

  for (const f of REQUIRED_FIELDS) {
    if (!data[f]) issues.push({ severity: 'hard', kind: 'missing-field', detail: f });
  }

  const scans = scan(content, { regulatoryDomain: data.regulatoryDomain });
  for (const v of scans) issues.push({ severity: v.severity ?? 'warn', kind: 'banned', detail: `${v.term} (line ${v.line})` });

  if (data.lastReviewed) {
    const age = (Date.now() - new Date(data.lastReviewed).getTime()) / 86_400_000;
    if (age > staleDays) issues.push({ severity: 'warn', kind: 'stale', detail: `${Math.round(age)} days since review` });
  }

  return { vertical, slug, issues };
}

function render(results) {
  const date = new Date().toISOString().slice(0, 10);
  let md = `# Compliance report - ${date}\n\n`;
  const total = results.length;
  const clean = results.filter((r) => r.issues.length === 0).length;
  const hard = results.filter((r) => r.issues.some((i) => i.severity === 'hard')).length;
  md += `${total} article(s) scanned. ${clean} clean, ${hard} with hard violations.\n\n`;

  for (const r of results) {
    if (r.issues.length === 0) continue;
    md += `## /${r.vertical}/${r.slug}\n\n`;
    for (const i of r.issues) {
      md += `- **${i.severity}** · ${i.kind}: ${i.detail}\n`;
    }
    md += `\n`;
  }
  return md;
}

function main() {
  const results = walk().map(check);
  const md = render(results);
  const outFile = path.join(REPORT_DIR, `compliance-${new Date().toISOString().slice(0, 10)}.md`);
  fs.writeFileSync(outFile, md);

  const hard = results.filter((r) => r.issues.some((i) => i.severity === 'hard')).length;
  console.log(md);
  console.log(`Wrote ${outFile}`);
  if (hard > 0) process.exit(2);
}

main();
