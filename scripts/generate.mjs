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

// Derive regulatory domain from vertical when not explicitly set in the CSV.
function regulatoryDomainForVertical(vertical) {
  const map = {
    'equity-release': 'finance',
    'mobility-aids': 'health',
    'funeral-planning': 'general',
    'tech-guides': 'general',
    'benefits': 'general',
    'wills-poa': 'legal',
  };
  return map[vertical] || 'general';
}

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
        persona: row.persona || 'editorial',
        template: row.template || row.contentType || 'spoke',
      }),
    );
    const model = modelForTask({
      contentType: row.contentType,
      regulatoryDomain: row.regulatoryDomain || regulatoryDomainForVertical(row.vertical),
      stage: 'body',
    });
    return {
      custom_id: `${row.vertical}__${row.slug}`,
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
    const [vertical, slug] = r.custom_id.split('__');
    try {
      const text = r.result.message.content
        .filter((b) => b.type === 'text')
        .map((b) => b.text)
        .join('\n');
      const { frontmatter, body } = splitFrontmatter(text);
      // Stamp a far-future sentinel so this article stays hidden until
      // scripts/schedule.mjs assigns it a real publish date.
      frontmatter.published = '2099-01-01';
      frontmatter.lastReviewed = new Date().toISOString().slice(0, 10);
      const violations = scan(body, { regulatoryDomain: frontmatter.regulatoryDomain });
      if (violations.some((v) => v.severity === 'hard')) {
        console.warn(
          `[hard violation] ${r.custom_id}: ${violations.map((v) => v.term).join(', ')} — queueing for humanisation.`,
        );
      }
      writeArticle(vertical, slug, frontmatter, body);
      console.log(`[write] content/${vertical}/${slug}.md`);
    } catch (err) {
      console.warn(`[error] ${r.custom_id}: ${err.message} — skipping, will retry on next run.`);
    }
  }
}

function buildUserPrompt(row) {
  return [
    `Primary keyword: ${row.primaryKeyword}`,
    `Target URL: /${row.vertical}/${row.slug}/`,
    `Suggested title: ${row.title}`,
    `Target word count: ${row.targetWords || (row.contentType === 'pillar' ? '3000' : '1800')}`,
    row.notes ? `\nAdditional context: ${row.notes}` : '',
    '',
    'Return the finished article as a complete markdown file, frontmatter first, then body. No preamble.',
  ].join('\n');
}

function splitFrontmatter(text) {
  // gray-matter parses YAML frontmatter and returns { data, content }.
  // Some model responses wrap the whole article in a ```yaml or ```markdown
  // code fence; strip that wrapper before parsing so the real frontmatter
  // is detected. If the model forgets frontmatter entirely, fall back to a
  // stub and let the next compliance run flag it.
  let cleaned = text.trim();

  // Case 1: the whole response is wrapped in a fenced block.
  const wholeFence = cleaned.match(/^```(?:yaml|markdown|md)?\s*\n([\s\S]*?)\n```\s*$/);
  if (wholeFence) cleaned = wholeFence[1].trim();

  // Case 2: model wrapped only the FRONTMATTER in a fenced block, leaving
  // the body unfenced after the closing ```. Strip the leading fence; the
  // closing fence will be handled by the body-fence sweep below.
  cleaned = cleaned.replace(/^```(?:yaml|markdown|md)?\s*\n/, '');

  if (!cleaned.startsWith('---')) {
    return { frontmatter: { title: 'Untitled', slug: 'untitled' }, body: stripStrayFences(cleaned) };
  }

  let result;
  try {
    result = matter(cleaned);
  } catch {
    // YAML colons in unquoted scalar values (e.g. "title: Foo: bar") cause
    // parse failures. Quote any frontmatter line whose value contains a bare
    // colon and retry before giving up.
    const fixed = cleaned.replace(
      /^([ \t]*\w[\w-]*):\s*([^'"\n\[{][^\n]*:[^\n]*)$/gm,
      (_, key, val) => `${key}: '${val.replace(/'/g, "''")}'`,
    );
    result = matter(fixed);
  }
  return { frontmatter: result.data, body: stripStrayFences(result.content) };
}

/**
 * Remove orphan triple-backtick fences from the body so a single artefact
 * can never swallow an entire article into a <pre> block. Mirrors the
 * runtime sanitiseBody() in lib/markdown.ts.
 */
function stripStrayFences(body) {
  let out = body.replace(/^\s*```[a-zA-Z0-9-]*\s*\n/, '');
  out = out.replace(/\n\s*```\s*$/, '\n');
  const fenceCount = (out.match(/^```/gm) || []).length;
  if (fenceCount % 2 === 1) out = `${out}\n\`\`\`\n`;
  return out;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
