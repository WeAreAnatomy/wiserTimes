#!/usr/bin/env node
/**
 * Stamps future published dates across unscheduled articles.
 *
 *   node scripts/schedule.mjs
 *   node scripts/schedule.mjs --start 2026-04-28 --per-week 3
 *   node scripts/schedule.mjs --start 2026-04-28 --per-week 5 --days Mon,Tue,Wed,Thu,Fri
 *
 * Articles already published (published date < start date) are not touched.
 * Articles with a published date >= start date are reassigned new dates at
 * the requested cadence, preserving their relative order.
 *
 * Defaults:
 *   --start    tomorrow
 *   --per-week 3  (Mon / Wed / Fri)
 */

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { CONTENT_ROOT, writeIfChanged } from './lib/markdown.mjs';

const DAY_NAMES = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

const DEFAULT_DAYS_BY_FREQ = {
  1: [1],              // Mon
  2: [1, 4],           // Mon, Thu
  3: [1, 3, 5],        // Mon, Wed, Fri
  4: [1, 2, 4, 5],     // Mon, Tue, Thu, Fri
  5: [1, 2, 3, 4, 5],  // Mon–Fri
};

// ── Parse CLI args (--key value or --key=value) ────────────────────────────
const argv = {};
for (let i = 2; i < process.argv.length; i++) {
  const arg = process.argv[i];
  if (!arg.startsWith('--')) continue;
  const eqIdx = arg.indexOf('=');
  if (eqIdx !== -1) {
    argv[arg.slice(2, eqIdx)] = arg.slice(eqIdx + 1);
  } else {
    argv[arg.slice(2)] = process.argv[i + 1]?.startsWith('--')
      ? true
      : (process.argv[++i] ?? true);
  }
}

const perWeek = parseInt(argv['per-week'] ?? '3', 10);

const publishDays = argv.days
  ? String(argv.days).split(',').map((d) => DAY_NAMES[d.trim()]).filter((n) => n !== undefined)
  : (DEFAULT_DAYS_BY_FREQ[perWeek] ?? [1, 3, 5]);

// Default start = today, so newly generated articles (published: 2099-01-01)
// are picked up automatically when you run `npm run schedule` right after
// `npm run generate`.
const startDate = argv.start
  ? new Date(`${argv.start}T00:00:00`)
  : (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })();

// ── Helper: advance to the next publish day on or after `from` ─────────────
function nextPublishDate(from) {
  const d = new Date(from);
  for (let i = 0; i < 14; i++) {
    if (publishDays.includes(d.getDay())) return new Date(d);
    d.setDate(d.getDate() + 1);
  }
  throw new Error('Could not find next publish day within 14 days.');
}

function advanceFromDate(from) {
  const d = new Date(from);
  d.setDate(d.getDate() + 1);
  return nextPublishDate(d);
}

// ── Collect all articles ───────────────────────────────────────────────────
const articles = [];
for (const entry of fs.readdirSync(CONTENT_ROOT, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const dir = path.join(CONTENT_ROOT, entry.name);
  for (const file of fs.readdirSync(dir)) {
    if (!file.endsWith('.md')) continue;
    const full = path.join(dir, file);
    const { data, content } = matter(fs.readFileSync(full, 'utf8'));
    articles.push({
      full,
      vertical: entry.name,
      slug: file.replace(/\.md$/, ''),
      data,
      content,
      publishedTs: data.published ? new Date(data.published).getTime() : 0,
    });
  }
}

const startTs = startDate.getTime();
const keep = articles.filter((a) => a.publishedTs < startTs);
const toSchedule = articles
  .filter((a) => a.publishedTs >= startTs)
  .sort((a, b) => a.publishedTs - b.publishedTs);

console.log(`Start date: ${startDate.toISOString().slice(0, 10)}`);
console.log(`Cadence:    ${perWeek}/week on days ${publishDays.map((d) => Object.keys(DAY_NAMES)[d]).join(', ')}`);
console.log(`Keeping:    ${keep.length} article(s) already published before start date.`);
console.log(`Scheduling: ${toSchedule.length} article(s).`);

if (toSchedule.length === 0) {
  console.log('Nothing to schedule.');
  process.exit(0);
}

// ── Assign dates ──────────────────────────────────────────────────────────
let cursor = nextPublishDate(startDate);
let changed = 0;

for (const a of toSchedule) {
  const dateStr = cursor.toISOString().slice(0, 10);
  const updatedFm = { ...a.data, published: dateStr, lastReviewed: dateStr };
  const newFile = matter.stringify(a.content.trim() + '\n', updatedFm);
  const wrote = writeIfChanged(a.full, newFile);
  if (wrote) {
    console.log(`  [schedule] ${a.vertical}/${a.slug} → ${dateStr}`);
    changed++;
  }
  cursor = advanceFromDate(cursor);
}

console.log(`\nDone. ${changed} file(s) updated.`);
if (changed > 0) {
  console.log('\nNext steps:');
  console.log('  git add content && git commit -m "chore(content): schedule publish dates"');
  console.log('  Then set your host to rebuild daily.');
}
