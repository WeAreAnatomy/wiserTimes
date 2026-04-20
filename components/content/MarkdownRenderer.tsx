import { extractShortcodes, renderMarkdownToHtml } from '@/lib/markdown';
import type { Shortcode } from '@/lib/markdown';
import Prose from '@/components/layout/Prose';
import Callout from '@/components/blocks/Callout';
import ComparisonTable from '@/components/blocks/ComparisonTable';
import ProsCons from '@/components/blocks/ProsCons';
import FAQ from '@/components/blocks/FAQ';
import ExpertQuote from '@/components/blocks/ExpertQuote';
import type { CalloutType } from '@/components/blocks/Callout';

export interface MarkdownRendererProps {
  source: string;
}

// --- shortcode parsers ----------------------------------------------------

function parseCompareBody(body: string): { headers: string[]; rows: string[][] } {
  // Expect a standard GFM pipe table. Split on | and trim; ignore divider line.
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
  // Accept either a key: comma list format, or a pros:/cons: multi-line list.
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

function parseFAQBody(body: string): { q: string; a: string }[] {
  const items: { q: string; a: string }[] = [];
  let current: { q: string; a: string } | null = null;
  for (const raw of body.split('\n')) {
    const line = raw.trim();
    const qMatch = line.match(/^q\s*:\s*(.+)$/i);
    const aMatch = line.match(/^a\s*:\s*(.+)$/i);
    if (qMatch) {
      if (current) items.push(current);
      current = { q: qMatch[1].trim(), a: '' };
    } else if (aMatch && current) {
      current.a = current.a ? `${current.a} ${aMatch[1].trim()}` : aMatch[1].trim();
    } else if (current && line) {
      current.a = current.a ? `${current.a} ${line}` : line;
    }
  }
  if (current) items.push(current);
  return items;
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
 * this component extracts shortcodes, renders the remaining markdown to
 * HTML, and splices React components back in where the shortcodes were.
 *
 * Never import `remark` directly in a page or component. Go through here.
 */
export default async function MarkdownRenderer({ source }: MarkdownRendererProps) {
  const { stripped, shortcodes } = extractShortcodes(source);
  const html = await renderMarkdownToHtml(stripped);

  // Split the rendered HTML on the shortcode placeholder <div>s, preserving
  // the shortcode ID so we can drop the right React component back in place.
  const placeholderRe =
    /<div[^>]*data-shortcode="(sc-\d+)"[^>]*>\s*<\/div>/g;

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
          return <div key={i} dangerouslySetInnerHTML={{ __html: p.value }} />;
        }
        const sc = scById.get(p.value);
        if (!sc) return null;
        return renderShortcode(sc);
      })}
    </Prose>
  );
}
