#!/usr/bin/env node
/**
 * Humanisation pass.
 *
 *   node scripts/humanise.mjs <vertical>/<slug> [<vertical>/<slug> ...]
 *   node scripts/humanise.mjs --flagged    # rerun everything with violations
 *
 * Takes a drafted article, sends it through a second Claude call with the
 * humanise template, and rewrites the file in place. Always batched -
 * humanisation is never the bottleneck.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import {
  submitBatch,
  pollBatch,
  fetchBatchResults,
  cachedSystem,
  MODELS,
} from './lib/claude.mjs';
import { composeSystemPrompt } from './lib/prompts.mjs';
import { scan } from './lib/banned-words.mjs';
import { writeArticle, CONTENT_ROOT } from './lib/markdown.mjs';

function allArticlePaths() {
  const paths = [];
  for (const v of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
    if (!v.isDirectory()) continue;
    const dir = path.join(CONTENT_ROOT, v.name);
    for (const file of fs.readdirSync(dir)) {
      if (file.endsWith('.md')) paths.push([v.name, file.replace(/\.md$/, '')]);
    }
  }
  return paths;
}

function resolveTargets(args) {
  if (args.includes('--flagged')) {
    return allArticlePaths().filter(([v, s]) => {
      const full = path.join(CONTENT_ROOT, v, `${s}.md`);
      const text = fs.readFileSync(full, 'utf8');
      const { content, data } = matter(text);
      return scan(content, { regulatoryDomain: data.regulatoryDomain }).length > 0;
    });
  }
  return args.map((a) => a.split('/'));
}

async function main() {
  const args = process.argv.slice(2);
  const targets = resolveTargets(args);
  if (targets.length === 0) {
    console.log('No articles to humanise.');
    return;
  }

  const system = cachedSystem(composeSystemPrompt({ template: 'humanise' }));

  const requests = targets.map(([vertical, slug]) => {
    const draft = fs.readFileSync(path.join(CONTENT_ROOT, vertical, `${slug}.md`), 'utf8');
    return {
      custom_id: `${vertical}::${slug}`,
      model: MODELS.haiku,
      system,
      user: draft,
      max_tokens: 5000,
    };
  });

  const batchId = await submitBatch(requests);
  console.log(`Humanise batch: ${batchId} (${requests.length} article(s))`);
  await pollBatch(batchId);
  const results = await fetchBatchResults(batchId);

  for (const r of results) {
    if (r.result.type !== 'succeeded') {
      console.warn(`[skip] ${r.custom_id}: ${r.result.type}`);
      continue;
    }
    const [vertical, slug] = r.custom_id.split('::');
    const text = r.result.message.content
      .filter((b) => b.type === 'text')
      .map((b) => b.text)
      .join('\n');
    const { data, content } = matter(text);
    writeArticle(vertical, slug, data, content);
    console.log(`[rewrite] content/${vertical}/${slug}.md`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
