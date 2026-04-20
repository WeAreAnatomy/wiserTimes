export interface StatProps {
  value: string;
  label: string;
  source?: string;
  sourceUrl?: string;
}

/**
 * Big-number stat with source attribution. Used in pillar page intros
 * and anywhere an article cites a figure (brief §2.3: authoritative
 * citations are required).
 */
export default function Stat({ value, label, source, sourceUrl }: StatProps) {
  return (
    <div className="rounded-lg border border-brand-border bg-brand-sand/60 px-5 py-4">
      <p className="font-sans text-3xl font-semibold text-brand-ink sm:text-4xl">{value}</p>
      <p className="mt-1 text-lg text-brand-ink">{label}</p>
      {source &&
        (sourceUrl ? (
          <a
            href={sourceUrl}
            rel="noopener noreferrer"
            target="_blank"
            className="mt-2 inline-block text-base text-brand-muted hover:text-brand-teal hover:underline"
          >
            Source: {source}
          </a>
        ) : (
          <p className="mt-2 text-base text-brand-muted">Source: {source}</p>
        ))}
    </div>
  );
}
