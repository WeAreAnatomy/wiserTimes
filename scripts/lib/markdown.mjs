// Markdown read/write helpers used by generation scripts. Keeps gray-matter
// access and file-path conventions in one place.

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export const CONTENT_ROOT = path.join(process.cwd(), 'content');

export function articlePath(vertical, slug) {
  return path.join(CONTENT_ROOT, vertical, `${slug}.md`);
}

export function writeArticle(vertical, slug, frontmatter, body) {
  const dir = path.join(CONTENT_ROOT, vertical);
  fs.mkdirSync(dir, { recursive: true });
  const file = matter.stringify(body.trim() + '\n', frontmatter);
  fs.writeFileSync(articlePath(vertical, slug), file);
}

export function readArticle(vertical, slug) {
  const file = fs.readFileSync(articlePath(vertical, slug), 'utf8');
  return matter(file);
}

/**
 * Idempotent write: only rewrites the file if content actually changed.
 * Keeps git diffs clean and the quarterly refresh job honest.
 */
export function writeIfChanged(filePath, content) {
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf8');
    if (existing === content) return false;
  }
  fs.writeFileSync(filePath, content);
  return true;
}
