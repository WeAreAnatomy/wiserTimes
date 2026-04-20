export interface ProsConsProps {
  pros: string[];
  cons: string[];
  title?: string;
}

export default function ProsCons({ pros, cons, title }: ProsConsProps) {
  return (
    <section className="my-8 rounded-lg border border-brand-border bg-white p-5 sm:p-6">
      {title && (
        <h3 className="mb-4 font-sans text-xl font-semibold text-brand-ink">{title}</h3>
      )}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="font-sans text-lg font-semibold text-ok">
            <span aria-hidden="true">✓</span> What works well
          </p>
          <ul className="mt-3 space-y-2">
            {pros.map((p, i) => (
              <li key={i} className="flex gap-2 text-lg text-brand-ink">
                <span aria-hidden="true" className="mt-1 text-ok">
                  ✓
                </span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-sans text-lg font-semibold text-warn">
            <span aria-hidden="true">✕</span> Things to watch
          </p>
          <ul className="mt-3 space-y-2">
            {cons.map((c, i) => (
              <li key={i} className="flex gap-2 text-lg text-brand-ink">
                <span aria-hidden="true" className="mt-1 text-warn">
                  ✕
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
