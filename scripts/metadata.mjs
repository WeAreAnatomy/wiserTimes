#!/usr/bin/env node
/**
 * Regenerates SEO metadata (title, description, FAQ, keywords) for articles
 * that are missing fields or were flagged for SERP underperformance.
 *
 *   node scripts/metadata.mjs              # fill missing metadata
 *   node scripts/metadata.mjs --all        # rewrite everything
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CONTENT_ROOT, writeArticle } from './lib/markdown.mjs';
import {
  submitBatch,
  pollBatch,
  fetchBatchResults,
  cachedSystem,
  MODELS,
} from './lib/claude.mjs';
import { composeSystemPrompt } from './lib/prompts.mjs';

function needsMetadata(data) {
  return !data.title || !data.description || !data.keywords || !data.faqs;
}

function walk(filter) {
  const out = [];
  for (const v of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
    if (!v.isDirectory()) continue;
    const dir = path.join(CONTENT_ROOT, v.name);
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      const parsed = matter(fs.readFileSync(path.join(dir, file), 'utf8'));
      if (filter(parsed.data)) {
        out.push({ vertical: v.name, slug: file.replace(/\.md$/, ''), ...parsed });
      }
    }
  }
  return out;
}

async function main() {
  const all = process.argv.includes('--all');
  const targets = walk(all ? () => true : needsMetadata);
  if (targets.length === 0) {
    console.log('No articles need metadata.');
    return;
  }

  const system = cachedSystem(composeSystemPrompt({ template: 'metadata' }));

  const batchId = await submitBatch(
    targets.map((t) => ({
      custom_id: `${t.vertical}::${t.slug}`,
      model: MODELS.haiku,
      system,
      user: t.content,
      max_tokens: 800,
    })),
  );
  await pollBatch(batchId);
  const results = await fetchBatchResults(batchId);

  const byId = new Map(targets.map((t) => [`${t.vertical}::${t.slug}`, t]));

  for (const r of results) {
    if (r.result.type !== 'succeeded') continue;
    const t = byId.get(r.custom_id);
    if (!t) continue;
    const text = r.result.message.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n')
      .trim();
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      console.warn(`[skip] ${r.custom_id}: model did not return JSON`);
      continue;
    }
    const newData = { ...t.data, ...parsed };
    writeArticle(t.vertical, t.slug, newData, t.content);
    console.log(`[metadata] content/${t.vertical}/${t.slug}.md`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
