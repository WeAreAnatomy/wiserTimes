// Site search. Server-side only — runs at request time on the search page,
// reads the same article store as every other page, and ranks matches with a
// simple weighted-token score. We deliberately avoid client-side indexes
// (lunr, fuse, etc.) to keep the JS bundle out of the critical path; the 55+
// audience is best served by a search page that works without JS at all.

import { getAllArticles, articleUrl } from './content';
import type { Article, Vertical } from './types';

export interface SearchResult {
  title: string;
  description: string;
  vertical: Vertical;
  slug: string;
  url: string;
  // ISO date — surfaced on the results card so users can see how fresh a
  // guide is before clicking through.
  published: string;
  score: number;
  // Snippet of body text containing the first match, used to give the user
  // a glimpse of why a result was returned. Empty if no body match.
  snippet: string;
}

const SNIPPET_RADIUS = 90;

function tokenise(query: string): string[] {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((t) => t.replace(/[^\p{L}\p{N}-]+/gu, ''))
    .filter((t) => t.length >= 2);
}

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let from = 0;
  while (true) {
    const i = haystack.indexOf(needle, from);
    if (i === -1) return count;
    count += 1;
    from = i + needle.length;
  }
}

function buildSnippet(body: string, tokens: string[]): string {
  const lower = body.toLowerCase();
  let firstHit = -1;
  for (const t of tokens) {
    const i = lower.indexOf(t);
    if (i !== -1 && (firstHit === -1 || i < firstHit)) firstHit = i;
  }
  if (firstHit === -1) return '';
  const start = Math.max(0, firstHit - SNIPPET_RADIUS);
  const end = Math.min(body.length, firstHit + SNIPPET_RADIUS);
  // Strip markdown noise so the preview reads as prose, not source.
  const slice = body
    .slice(start, end)
    .replace(/[#>*_`~]+/g, ' ')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
  const prefix = start > 0 ? '… ' : '';
  const suffix = end < body.length ? ' …' : '';
  return `${prefix}${slice}${suffix}`;
}

function scoreArticle(article: Article, tokens: string[], rawQuery: string): SearchResult | null {
  const fm = article.frontmatter;
  const title = fm.title.toLowerCase();
  const description = fm.description.toLowerCase();
  const keywords = (fm.keywords ?? []).join(' ').toLowerCase();
  const tags = (fm.tags ?? []).join(' ').toLowerCase();
  const body = article.body.toLowerCase();
  const phrase = rawQuery.trim().toLowerCase();

  let score = 0;

  // Whole-phrase exact match in the title is the strongest signal.
  if (phrase.length >= 2 && title.includes(phrase)) score += 25;
  if (phrase.length >= 2 && description.includes(phrase)) score += 8;

  for (const t of tokens) {
    if (title.includes(t)) score += 10;
    if (description.includes(t)) score += 4;
    if (keywords.includes(t)) score += 3;
    if (tags.includes(t)) score += 2;
    // Body matches add weight but are capped to avoid long pages dominating.
    score += Math.min(countOccurrences(body, t), 3);
  }

  if (score === 0) return null;

  // Pillar pages are the canonical answer for a vertical — nudge them up.
  if (fm.contentType === 'pillar') score += 2;

  return {
    title: fm.title,
    description: fm.description,
    vertical: fm.vertical,
    slug: fm.slug,
    url: articleUrl(fm),
    published: fm.published,
    score,
    snippet: buildSnippet(article.body, tokens),
  };
}

/**
 * Search published articles by free-text query.
 * Returns results ordered by score (highest first), capped at `limit`.
 * An empty/blank query returns an empty array — the page handles the empty state.
 */
export function searchArticles(query: string, limit = 30): SearchResult[] {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const tokens = tokenise(trimmed);
  if (tokens.length === 0) return [];

  const results: SearchResult[] = [];
  for (const article of getAllArticles()) {
    const r = scoreArticle(article, tokens, trimmed);
    if (r) results.push(r);
  }
  results.sort((a, b) => b.score - a.score);
  return results.slice(0, limit);
}
