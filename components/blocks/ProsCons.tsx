import { CheckCircle2, XCircle } from 'lucide-react';

export interface ProsConsProps {
  pros: string[];
  cons: string[];
  title?: string;
}

export default function ProsCons({ pros, cons, title }: ProsConsProps) {
  return (
    <section className="my-8 overflow-hidden rounded-lg border border-brand-border bg-white">
      {title && (
        <div className="border-b border-brand-border px-5 py-4 sm:px-6">
          <h3 className="font-sans text-xl font-semibold text-brand-ink">{title}</h3>
        </div>
      )}
      <div className="grid sm:grid-cols-2">
        <div className="p-5 sm:p-6">
          <p className="flex items-center gap-2 font-sans text-lg font-semibold text-ok">
            <CheckCircle2 size={20} aria-hidden="true" />
            What works well
          </p>
          <ul className="mt-3 space-y-2.5">
            {pros.map((p, i) => (
              <li key={i} className="flex items-start gap-2.5 text-lg text-brand-ink">
                <CheckCircle2
                  size={18}
                  aria-hidden="true"
                  className="mt-1 flex-none text-ok"
                />
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border-t border-brand-border bg-brand-sand/20 p-5 sm:border-l sm:border-t-0 sm:p-6">
          <p className="flex items-center gap-2 font-sans text-lg font-semibold text-warn">
            <XCircle size={20} aria-hidden="true" />
            Things to watch
          </p>
          <ul className="mt-3 space-y-2.5">
            {cons.map((c, i) => (
              <li key={i} className="flex items-start gap-2.5 text-lg text-brand-ink">
                <XCircle
                  size={18}
                  aria-hidden="true"
                  className="mt-1 flex-none text-warn"
                />
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
