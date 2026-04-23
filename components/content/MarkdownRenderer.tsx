import { Fragment } from 'react';
import {
  extractShortcodes,
  renderMarkdownToHtml,
  sanitiseBody,
} from '@/lib/markdown';
import type { Shortcode } from '@/lib/markdown';
import Prose from '@/components/layout/Prose';
import Callout from '@/components/blocks/Callout';
import ComparisonTable from '@/components/blocks/ComparisonTable';
import ProsCons from '@/components/blocks/ProsCons';
import FAQ from '@/components/blocks/FAQ';
import ExpertQuote from '@/components/blocks/ExpertQuote';
import type { CalloutType } from '@/components/blocks/Callout';
import type { FAQItem } from '@/lib/types';

export interface MarkdownRendererProps {
  source: string;
}

// --- shortcode parsers ----------------------------------------------------

function parseCompareBody(body: string): { headers: string[]; rows: string[][] } {
  const lines = body
    .trim()
    .split('\n')
    .filter((l) => l.trim().length > 0);
  if (lines.length < 2) return { headers: [], rows: [] };
  const parseRow = (line: string) =>
    line
      .replace(/^\||\|$/g, '')
      .split('|')
      .map((c) => c.trim());
  const headers = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow);
  return { headers, rows };
}

function parseProsConsBody(body: string): { pros: string[]; cons: string[] } {
  const pros: string[] = [];
  const cons: string[] = [];
  let mode: 'pros' | 'cons' | null = null;
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    if (!line) continue;
    const prosInline = line.match(/^pros\s*:\s*(.+)$/i);
    const consInline = line.match(/^cons\s*:\s*(.+)$/i);
    if (prosInline) {
      if (prosInline[1].includes(',')) {
        pros.push(...prosInline[1].split(',').map((s) => s.trim()).filter(Boolean));
        mode = null;
      } else {
        pros.push(prosInline[1].trim());
        mode = 'pros';
      }
      continue;
    }
    if (consInline) {
      if (consInline[1].includes(',')) {
        cons.push(...consInline[1].split(',').map((s) => s.trim()).filter(Boolean));
        mode = null;
      } else {
        cons.push(consInline[1].trim());
        mode = 'cons';
      }
      continue;
    }
    const bullet = line.replace(/^[-*]\s+/, '');
    if (mode === 'pros') pros.push(bullet);
    else if (mode === 'cons') cons.push(bullet);
  }
  return { pros, cons };
}

/**
 * Accepts FOUR formats so authors aren't punished for writing FAQs the
 * way humans actually write them. SEO-critical: empty FAQ blocks used to
 * silently disappear from the page while the FAQSchema still emitted
 * them — Google penalises that mismatch.
 *
 *   1. Plain q:/a: lines
 *        q: How long does it take?
 *        a: About 4 weeks.
 *
 *   2. YAML-list shape (mirrors frontmatter `faqs:` and is a common
 *      LLM output pattern). Optional surrounding `faqs:` line is OK.
 *        - q: "How long does it take?"
 *          a: "About 4 weeks."
 *
 *   3. **Question?** then an answer paragraph
 *        **How long does it take?**
 *        About 4 weeks.
 *
 *   4. Markdown headings (### or ##) then an answer paragraph
 *        ### How long does it take?
 *        About 4 weeks.
 *
 * Returns [] if no valid pair is found (caller decides what to do).
 */
export function parseFAQBody(body: string): FAQItem[] {
  const items: FAQItem[] = [];
  let current: FAQItem | null = null;
  const flush = () => {
    if (current && current.q && current.a) items.push(current);
    current = null;
  };

  // Strip surrounding "faqs:" (or similar) wrapper line — common in
  // LLM outputs that mirror the frontmatter shape.
  const lines = body
    .split('\n')
    .filter((l) => !/^\s*faqs?\s*:\s*$/i.test(l));

  // Quote stripper for YAML-style "- q: \"…\"" / 'a: "…"' values.
  const stripQuotes = (s: string) =>
    s.trim().replace(/^["'](.*)["']$/s, '$1').trim();

  for (const raw of lines) {
    const trimmed = raw.trim();
    if (!trimmed) continue;

    // Skip a section heading like "## Common questions"
    if (/^#{1,6}\s+(common questions|faqs?|frequently asked)/i.test(trimmed)) {
      continue;
    }

    // YAML-list question:  "- q: ..."  (anywhere in the line after leading spaces)
    const qListed = raw.match(/^\s*-\s*q\s*[:\-]\s*(.+)$/i);
    const aListed = raw.match(/^\s*a\s*[:\-]\s*(.+)$/i);
    const qLabelled = trimmed.match(/^q\s*[:\-]\s*(.+)$/i);
    const aLabelled = trimmed.match(/^a\s*[:\-]\s*(.+)$/i);
    const qBold = trimmed.match(/^\*\*(.+?)\*\*[:?]?\s*$/);
    const qHeading = trimmed.match(/^#{2,4}\s+(.+?)\s*\??\s*$/);

    if (qListed) {
      flush();
      current = { q: stripQuotes(qListed[1]).replace(/\?*$/, '?'), a: '' };
      continue;
    }
    if (aListed && current) {
      const v = stripQuotes(aListed[1]);
      current.a = current.a ? `${current.a} ${v}` : v;
      continue;
    }
    if (qLabelled && !qListed) {
      flush();
      current = { q: stripQuotes(qLabelled[1]).replace(/\?*$/, '?'), a: '' };
      continue;
    }
    if (aLabelled && current && !aListed) {
      const v = stripQuotes(aLabelled[1]);
      current.a = current.a ? `${current.a} ${v}` : v;
      continue;
    }
    if (qBold) {
      flush();
      current = { q: qBold[1].trim().replace(/\?*$/, '?'), a: '' };
      continue;
    }
    if (qHeading && /\?\s*$/.test(trimmed)) {
      flush();
      current = { q: qHeading[1].trim().replace(/\?*$/, '?'), a: '' };
      continue;
    }
    if (current) {
      current.a = current.a ? `${current.a} ${trimmed}` : trimmed;
    }
  }
  flush();
  return items;
}

/**
 * Pulls every :::faq block's parsed items out of a markdown body.
 * Used by the page so FAQSchema (JSON-LD) and the visible FAQ stay in
 * sync — Google requires that schema FAQs match what the user sees.
 */
export function extractInlineFAQs(source: string): FAQItem[] {
  const { shortcodes } = extractShortcodes(sanitiseBody(source));
  const all: FAQItem[] = [];
  for (const sc of shortcodes) {
    if (sc.type === 'faq') all.push(...parseFAQBody(sc.body));
  }
  return all;
}

function renderShortcode(sc: Shortcode) {
  switch (sc.type) {
    case 'callout': {
      const type = (sc.attrs.type as CalloutType) || 'info';
      return (
        <Callout key={sc.id} type={type} title={sc.attrs.title}>
          {sc.body}
        </Callout>
      );
    }
    case 'compare': {
      const { headers, rows } = parseCompareBody(sc.body);
      return (
        <ComparisonTable
          key={sc.id}
          caption={sc.attrs.caption}
          headers={headers}
          rows={rows}
        />
      );
    }
    case 'proscons': {
      const { pros, cons } = parseProsConsBody(sc.body);
      return <ProsCons key={sc.id} title={sc.attrs.title} pros={pros} cons={cons} />;
    }
    case 'faq': {
      const items = parseFAQBody(sc.body);
      return <FAQ key={sc.id} title={sc.attrs.title} items={items} />;
    }
    case 'quote': {
      return (
        <ExpertQuote key={sc.id} author={sc.attrs.author} role={sc.attrs.role}>
          {sc.body}
        </ExpertQuote>
      );
    }
    default:
      return null;
  }
}

/**
 * The one and only markdown renderer. Pages pass the raw markdown body;
 * this component cleans it, extracts shortcodes, renders the remaining
 * markdown to HTML, and splices React components back in where the
 * shortcodes were.
 *
 * Never import `remark` directly in a page or component. Go through here.
 */
export default async function MarkdownRenderer({ source }: MarkdownRendererProps) {
  const cleaned = sanitiseBody(source);
  const { stripped, shortcodes } = extractShortcodes(cleaned);
  const html = await renderMarkdownToHtml(stripped);

  const placeholderRe = /<div[^>]*data-shortcode="(sc-\d+)"[^>]*>\s*<\/div>/g;

  const parts: { kind: 'html' | 'shortcode'; value: string }[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = placeholderRe.exec(html)) !== null) {
    if (m.index > lastIndex) {
      parts.push({ kind: 'html', value: html.slice(lastIndex, m.index) });
    }
    parts.push({ kind: 'shortcode', value: m[1] });
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < html.length) {
    parts.push({ kind: 'html', value: html.slice(lastIndex) });
  }

  const scById = new Map(shortcodes.map((s) => [s.id, s]));

  return (
    <Prose>
      {parts.map((p, i) => {
        if (p.kind === 'html') {
          // display:contents removes the wrapper from layout so margins/styles
          // behave identically to a single-blob render.
          return (
            <div
              key={i}
              style={{ display: 'contents' }}
              dangerouslySetInnerHTML={{ __html: p.value }}
            />
          );
        }
        const sc = scById.get(p.value);
        if (!sc) return null;
        return <Fragment key={i}>{renderShortcode(sc)}</Fragment>;
      })}
    </Prose>
  );
}
