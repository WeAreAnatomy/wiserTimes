import { extractHeadings } from '@/lib/markdown';

export interface TableOfContentsProps {
  body: string;
  /** Minimum number of H2 headings before TOC is rendered. */
  minHeadings?: number;
}

/**
 * Builds a TOC from H2 headings in the markdown body. Parses at render
 * time - the body prop comes straight from the article content.
 */
export default function TableOfContents({ body, minHeadings = 3 }: TableOfContentsProps) {
  const headings = extractHeadings(body);
  if (headings.length < minHeadings) return null;
  return (
    <nav
      aria-label="On this page"
      className="my-6 rounded-lg border border-brand-border bg-brand-cream p-5"
    >
      <p className="font-sans text-base font-semibold uppercase tracking-wide text-brand-muted">
        On this page
      </p>
      <ol className="mt-3 space-y-2">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              className="text-lg text-brand-deep hover:text-brand-teal hover:underline"
            >
              {h.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
