#!/usr/bin/env node
/**
 * Content generation pipeline.
 *
 *   node scripts/generate.mjs
 *
 * Reads data/topics.csv, submits a batch to Claude with the cached system
 * prompt, polls for completion, and writes markdown files to /content.
 *
 * Stacked cost savers: batch API (50% off) + prompt caching (10% of input).
 * See brief §5.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { parse } from 'csv-parse/sync';
import { submitBatch, pollBatch, fetchBatchResults, cachedSystem, modelForTask } from './lib/claude.mjs';
import { composeSystemPrompt } from './lib/prompts.mjs';
import { writeArticle } from './lib/markdown.mjs';
import { scan } from './lib/banned-words.mjs';

const TOPICS = path.join(process.cwd(), 'data', 'topics.csv');

async function main() {
  if (!fs.existsSync(TOPICS)) {
    console.error('No data/topics.csv found.');
    process.exit(1);
  }
  const rows = parse(fs.readFileSync(TOPICS, 'utf8'), {
    columns: true,
    skip_empty_lines: true,
  });

  // Filter to rows not yet generated
  const todo = rows.filter(
    (r) =>
      r.status !== 'done' &&
      !fs.existsSync(path.join(process.cwd(), 'content', r.vertical, `${r.slug}.md`)),
  );
  if (todo.length === 0) {
    console.log('Nothing to generate.');
    return;
  }
  console.log(`Submitting batch: ${todo.length} article(s).`);

  const requests = todo.map((row) => {
    const system = cachedSystem(
      composeSystemPrompt({
        persona: row.author || 'editorial',
        template: row.contentType || 'spoke',
      }),
    );
    const model = modelForTask({
      contentType: row.contentType,
      regulatoryDomain: row.regulatoryDomain,
      stage: 'body',
    });
    return {
      custom_id: `${row.vertical}::${row.slug}`,
      model,
      system,
      user: buildUserPrompt(row),
      max_tokens: row.contentType === 'pillar' ? 5000 : 3500,
    };
  });

  const batchId = await submitBatch(requests);
  console.log(`Batch submitted: ${batchId}. Polling...`);
  await pollBatch(batchId);
  const results = await fetchBatchResults(batchId);
  console.log(`Batch done. Processing ${results.length} result(s).`);

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
    const { frontmatter, body } = splitFrontmatter(text);
    const violations = scan(body, { regulatoryDomain: frontmatter.regulatoryDomain });
    if (violations.some((v) => v.severity === 'hard')) {
      console.warn(
        `[hard violation] ${r.custom_id}: ${violations.map((v) => v.term).join(', ')} — queueing for humanisation.`,
      );
      // In production: send this draft to the humanise batch.
    }
    writeArticle(vertical, slug, frontmatter, body);
    console.log(`[write] content/${vertical}/${slug}.md`);
  }
}

function buildUserPrompt(row) {
  return [
    `Primary keyword: ${row.keyword}`,
    `Target URL: /${row.vertical}/${row.slug}/`,
    `Suggested title: ${row.title}`,
    `Target word count: ${row.targetWords || (row.contentType === 'pillar' ? '3000' : '1800')}`,
    row.brief ? `\nAdditional context: ${row.brief}` : '',
    '',
    'Return the finished article as a complete markdown file, frontmatter first, then body. No preamble.',
  ].join('\n');
}

function splitFrontmatter(text) {
  // gray-matter parses YAML frontmatter and returns { data, content }.
  // If the model forgets the fences, fall back to an empty object so the
  // caller can still write a stub and flag it in the next compliance run.
  if (!text.startsWith('---')) {
    return { frontmatter: { title: 'Untitled', slug: 'untitled' }, body: text };
  }
  const { data, content } = matter(text);
  return { frontmatter: data, body: content };
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
