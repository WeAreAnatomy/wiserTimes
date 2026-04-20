import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Article, ArticleFrontmatter, Vertical } from './types';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

function readArticleFile(filePath: string): Article {
  const raw = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(raw);
  const fm = data as ArticleFrontmatter;
  const rt = readingTime(content);
  return {
    frontmatter: fm,
    body: content,
    readingTimeMinutes: Math.max(1, Math.round(rt.minutes)),
  };
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(CONTENT_ROOT)) return [];
  const articles: Article[] = [];
  const verticals = fs.readdirSync(CONTENT_ROOT, { withFileTypes: true });
  for (const v of verticals) {
    if (!v.isDirectory()) continue;
    const dir = path.join(CONTENT_ROOT, v.name);
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith('.md')) continue;
      articles.push(readArticleFile(path.join(dir, file)));
    }
  }
  return articles.sort(
    (a, b) =>
      new Date(b.frontmatter.published).getTime() -
      new Date(a.frontmatter.published).getTime(),
  );
}

export function getArticlesByVertical(vertical: Vertical): Article[] {
  return getAllArticles().filter((a) => a.frontmatter.vertical === vertical);
}

export function getArticleBySlug(vertical: Vertical, slug: string): Article | null {
  const filePath = path.join(CONTENT_ROOT, vertical, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return readArticleFile(filePath);
}

export function getPillarForVertical(vertical: Vertical): Article | null {
  return (
    getArticlesByVertical(vertical).find(
      (a) => a.frontmatter.contentType === 'pillar',
    ) ?? null
  );
}

export function getSpokesForVertical(vertical: Vertical): Article[] {
  return getArticlesByVertical(vertical).filter(
    (a) => a.frontmatter.contentType !== 'pillar',
  );
}

// Returns up to `limit` other articles in the same vertical, excluding `currentSlug`.
// Used by RelatedArticles at build time.
export function getRelatedArticles(
  vertical: Vertical,
  currentSlug: string,
  limit = 4,
): Article[] {
  return getArticlesByVertical(vertical)
    .filter((a) => a.frontmatter.slug !== currentSlug)
    .slice(0, limit);
}

export function articleUrl(a: ArticleFrontmatter): string {
  return `/${a.vertical}/${a.slug}/`;
}
