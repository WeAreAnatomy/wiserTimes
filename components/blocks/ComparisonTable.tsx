export interface ComparisonTableProps {
  caption?: string;
  headers: string[];
  rows: string[][];
  /** Factual tone reminder banner (brief §10.3: no subjective superiority claims). */
  factualNote?: boolean;
}

/**
 * Renders a factual comparison table. Styling is controlled here, not at
 * call-sites. If a page needs a comparison, it passes the data - it does
 * not hand-roll an HTML <table>.
 */
export default function ComparisonTable({
  caption,
  headers,
  rows,
  factualNote = true,
}: ComparisonTableProps) {
  return (
    <figure className="my-8">
      {caption && (
        <figcaption className="mb-2 font-sans text-lg font-semibold text-brand-ink">
          {caption}
        </figcaption>
      )}
      <div className="overflow-x-auto rounded-lg border border-brand-border">
        <table className="w-full border-collapse text-base">
          <thead>
            <tr className="bg-brand-sand">
              {headers.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="border-b border-brand-border px-4 py-3 text-left font-sans font-semibold text-brand-ink"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? 'bg-white' : 'bg-brand-cream/50'}
              >
                {row.map((cell, j) => (
                  <td key={j} className="border-b border-brand-border px-4 py-3 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {factualNote && (
        <p className="mt-2 text-base text-brand-muted">
          Features are presented factually. We do not rank products by suitability - the right choice depends on your circumstances.
        </p>
      )}
    </figure>
  );
}
