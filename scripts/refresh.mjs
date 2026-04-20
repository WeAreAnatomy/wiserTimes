#!/usr/bin/env node
/**
 * Quarterly content refresh — bumps lastReviewed and, optionally, sends
 * sections of aging articles back through the humanise pipeline.
 *
 *   node scripts/refresh.mjs                 # stamp + report
 *   node scripts/refresh.mjs --rewrite        # also trigger humanisation
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CONTENT_ROOT, writeArticle } from './lib/markdown.mjs';

const STALE_DAYS = 90;

function main() {
  const rewrite = process.argv.includes('--rewrite');
  const stale = [];

  for (const v of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
    if (!v.isDirectory()) continue;
    const dir = path.join(CONTENT_ROOT, v.name);
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const full = path.join(dir, file);
      const { data, content } = matter(fs.readFileSync(full, 'utf8'));
      const reviewed = data.lastReviewed ? new Date(data.lastReviewed) : new Date(0);
      const age = (Date.now() - reviewed.getTime()) / 86_400_000;
      if (age > STALE_DAYS) {
        stale.push({ vertical: v.name, slug: file.replace(/\.md$/, ''), age, data, content });
      }
    }
  }

  console.log(`${stale.length} article(s) due for review (> ${STALE_DAYS} days).`);

  if (rewrite) {
    // Delegate to humanise.mjs rather than re-implementing the Claude call.
    const ids = stale.map((s) => `${s.vertical}/${s.slug}`).join(' ');
    console.log('Run:');
    console.log(`  node scripts/humanise.mjs ${ids}`);
  } else {
    for (const s of stale) {
      const updated = { ...s.data, lastReviewed: new Date().toISOString().slice(0, 10) };
      writeArticle(s.vertical, s.slug, updated, s.content);
      console.log(`[stamp] content/${s.vertical}/${s.slug}.md`);
    }
  }
}

main();
