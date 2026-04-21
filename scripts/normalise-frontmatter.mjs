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

// Extract first usable paragraph from markdown body as a fallback description.
function extractDescription(body) {
  const lines = body.split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (!t) continue;
    if (t.startsWith('#')) continue;
    if (t.startsWith(':::')) continue;
    if (t.startsWith('|')) continue;
    if (t.startsWith('!')) continue;
    if (t.startsWith('-') || t.startsWith('*')) continue;
    if (t.length < 40) continue;
    // Strip inline markdown (bold, links, code)
    const clean = t.replace(/\*\*|__|\[([^\]]+)\]\([^)]+\)|`[^`]+`/g, '$1').trim();
    return clean.length > 160 ? clean.slice(0, 157) + '...' : clean;
  }
  return '';
}

function normalise(data, vertical, slug, body) {
  const out = { ...data };
  const csv = topicByKey.get(`${vertical}/${slug}`) || {};

  // Field renames: various names the model uses for vertical
  if (!out.vertical && (out.topic || out.category)) out.vertical = out.topic || out.category;
  if (!out.vertical) out.vertical = vertical;
  delete out.topic;
  delete out.category;

  // Clean up extra model-added fields that don't belong in our schema
  delete out.url;
  delete out.primaryKeyword;
  delete out.secondaryKeywords;
  delete out.readingTime;
  delete out.datePublished;
  delete out.dateModified;

  if (!out.slug || out.slug.includes('/')) out.slug = slug;

  // published: NEVER overwrite a value that schedule.mjs already set.
  // Only fill in if genuinely missing.
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

  // author: map legacy author slugs to persona slugs
  const authorMap = { 'wiser-times-editorial': 'editorial' };
  if (!out.author) out.author = csv.persona || 'editorial';
  if (authorMap[out.author]) out.author = authorMap[out.author];

  if (!out.title && csv.title) out.title = csv.title;

  // description: prefer metaDescription rename, then existing value, then body extract
  if (!out.description && out.metaDescription) out.description = out.metaDescription;
  delete out.metaDescription;
  if (!out.description) out.description = extractDescription(body);

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
    const fixed = normalise(parsed.data, v.name, slug, parsed.content);
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
