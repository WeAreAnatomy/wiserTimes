import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

// Minimal markdown pipeline with shortcode pre-processing.
// Shortcodes (:::callout, :::compare, :::proscons, :::faq, :::quote) are extracted
// out of the markdown before remark sees it, and replaced with placeholder <div>s
// carrying a data-shortcode attribute. MarkdownRenderer reads the placeholders
// back on the client side and swaps them for React components.

export type ShortcodeType = 'callout' | 'compare' | 'proscons' | 'faq' | 'quote';

export interface Shortcode {
  id: string;
  type: ShortcodeType;
  attrs: Record<string, string>;
  body: string;
}

// Allow `}` to appear inside attribute values (e.g. CSS) by greedily matching to
// the LAST `}` before the newline rather than the first.
const SHORTCODE_RE =
  /:::(callout|compare|proscons|faq|quote)(\{.*\})?\n([\s\S]*?)\n:::/g;

function parseAttrs(raw: string | undefined): Record<string, string> {
  if (!raw) return {};
  const attrs: Record<string, string> = {};
  const inner = raw.slice(1, -1);
  const re = /(\w+)="([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(inner)) !== null) attrs[m[1]] = m[2];
  return attrs;
}

/**
 * Defensive cleanup applied to every markdown body before rendering.
 *
 * - Strips a stray opening ``` fence on the first body line (a common
 *   artefact when a generator wraps frontmatter in a code fence and only
 *   half-strips it).
 * - Strips a trailing dangling ``` fence at the end of the body.
 * - Closes any remaining unbalanced fences so a single mistake never
 *   swallows the entire article into a <pre>.
 *
 * Keep this idempotent and conservative - it must not touch fences inside
 * legitimate code blocks.
 */
export function sanitiseBody(md: string): string {
  let out = md.replace(/^\s*```[a-zA-Z0-9-]*\s*\n/, '');
  out = out.replace(/\n\s*```\s*$/, '\n');
  // If after that we still have an odd number of ``` fences, close the last one.
  const fenceCount = (out.match(/^```/gm) || []).length;
  if (fenceCount % 2 === 1) out = `${out}\n\`\`\`\n`;
  return out;
}

export function extractShortcodes(md: string): {
  stripped: string;
  shortcodes: Shortcode[];
} {
  const shortcodes: Shortcode[] = [];
  let i = 0;
  const stripped = md.replace(SHORTCODE_RE, (_, type, attrRaw, body) => {
    const id = `sc-${i++}`;
    shortcodes.push({
      id,
      type: type as ShortcodeType,
      attrs: parseAttrs(attrRaw),
      body: body.trim(),
    });
    return `\n\n<div data-shortcode="${id}"></div>\n\n`;
  });
  return { stripped, shortcodes };
}

/**
 * Adds id="…" to every <h2>/<h3> in the rendered HTML so the
 * TableOfContents anchors actually jump. The slug must match
 * `slugify()` exactly so the two stay in sync.
 */
function injectHeadingIds(html: string): string {
  return html.replace(
    /<(h[23])>([\s\S]*?)<\/\1>/g,
    (_, tag, inner) => {
      // strip nested HTML tags from the heading text before slugifying
      const text = inner.replace(/<[^>]*>/g, '').trim();
      const id = slugify(text);
      return `<${tag} id="${id}">${inner}</${tag}>`;
    },
  );
}

export async function renderMarkdownToHtml(md: string): Promise<string> {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(md);
  return injectHeadingIds(String(file));
}

// Extract H2 headings for Table of Contents. Slugifies to match remark-html output.
export function extractHeadings(md: string): { id: string; text: string }[] {
  const headings: { id: string; text: string }[] = [];
  const re = /^##\s+(.+)$/gm;
  let m: RegExpExecArray | null;
  while ((m = re.exec(md)) !== null) {
    const text = m[1].trim();
    const id = slugify(text);
    headings.push({ id, text });
  }
  return headings;
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}
