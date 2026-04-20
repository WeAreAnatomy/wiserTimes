import type { FAQItem } from '@/lib/types';

export interface FAQProps {
  items: FAQItem[];
  title?: string;
}

/**
 * Visible FAQ block. The paired <FAQSchema /> in components/seo emits the
 * JSON-LD — keep the two in sync via the same `items` prop at the page level.
 */
export default function FAQ({ items, title = 'Frequently asked questions' }: FAQProps) {
  if (!items || items.length === 0) return null;
  return (
    <section className="my-10" aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="font-sans text-2xl font-semibold text-brand-ink">
        {title}
      </h2>
      <div className="mt-4 divide-y divide-brand-border rounded-lg border border-brand-border bg-white">
        {items.map((f, i) => (
          <details key={i} className="group p-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-sans text-lg font-semibold text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal">
              <span>{f.q}</span>
              <span
                aria-hidden="true"
                className="mt-1 flex-none text-brand-teal transition-transform group-open:rotate-45"
              >
                +
              </span>
            </summary>
            <p className="mt-3 text-lg text-brand-ink">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
