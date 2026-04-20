#!/usr/bin/env node
/**
 * Normalise frontmatter on every article so it matches the canonical schema
 * defined in lib/types.ts. Maps alternative field names the model sometimes
 * produces (topic -> vertical, publishedAt -> published, etc.) and infers
 * missing required fields from the file path and CSV.
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { parse } from 'csv-parse/sync';
import { CONTENT_ROOT, writeArticle } from './lib/markdown.mjs';

const TOPICS = path.join(process.cwd(), 'data', 'topics.csv');
const topicRows = fs.existsSync(TOPICS)
  ? parse(fs.readFileSync(TOPICS, 'utf8'), { columns: true, skip_empty_lines: true })
  : [];
const topicByKey = new Map(
  topicRows.map((r) => [`${r.vertical}/${r.slug}`, r]),
);

const regulatoryByVertical = {
  'equity-release': 'finance',
  'mobility-aids': 'health',
  'funeral-planning': 'general',
  'tech-guides': 'general',
  benefits: 'general',
  'wills-poa': 'legal',
};

function normalise(data, vertical, slug) {
  const out = { ...data };
  const csv = topicByKey.get(`${vertical}/${slug}`) || {};

  if (!out.vertical && out.topic) out.vertical = out.topic;
  if (!out.vertical) out.vertical = vertical;
  delete out.topic;

  if (!out.slug || out.slug.includes('/')) out.slug = slug;

  if (!out.published && out.publishedAt) out.published = out.publishedAt;
  if (out.published instanceof Date) out.published = out.published.toISOString().slice(0, 10);
  if (typeof out.published === 'string' && out.published.includes('T')) {
    out.published = out.published.slice(0, 10);
  }
  delete out.publishedAt;

  if (!out.lastReviewed && out.updatedAt) out.lastReviewed = out.updatedAt;
  if (!out.lastReviewed) out.lastReviewed = out.published || new Date().toISOString().slice(0, 10);
  if (out.lastReviewed instanceof Date) out.lastReviewed = out.lastReviewed.toISOString().slice(0, 10);
  if (typeof out.lastReviewed === 'string' && out.lastReviewed.includes('T')) {
    out.lastReviewed = out.lastReviewed.slice(0, 10);
  }
  delete out.updatedAt;

  if (!out.contentType) {
    if (out.howTo) out.contentType = 'how-to';
    else if (csv.contentType) out.contentType = csv.contentType;
    else out.contentType = 'spoke';
  }

  if (!out.intent) out.intent = csv.intent || 'informational';

  if (!out.regulatoryDomain) {
    out.regulatoryDomain = regulatoryByVertical[out.vertical] || 'general';
  }

  if (!out.author) out.author = csv.persona || 'editorial';

  if (!out.title && csv.title) out.title = csv.title;
  if (!out.description) out.description = '';

  if (!out.keywords) out.keywords = csv.primaryKeyword ? [csv.primaryKeyword] : [];

  return out;
}

let normalised = 0;
let unchanged = 0;

for (const v of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
  if (!v.isDirectory()) continue;
  const dir = path.join(CONTENT_ROOT, v.name);
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const slug = file.replace(/\.md$/, '');
    const raw = fs.readFileSync(path.join(dir, file), 'utf8');
    const parsed = matter(raw);
    const before = JSON.stringify(parsed.data);
    const fixed = normalise(parsed.data, v.name, slug);
    const after = JSON.stringify(fixed);
    if (before === after) {
      unchanged++;
      continue;
    }
    writeArticle(v.name, slug, fixed, parsed.content);
    normalised++;
    console.log(`[normalise] ${v.name}/${file}`);
  }
}

console.log(`\nDone. Normalised ${normalised}, unchanged ${unchanged}.`);
