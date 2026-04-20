import { ChevronDown, HelpCircle } from 'lucide-react';
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
      <h2 id="faq-heading" className="flex items-center gap-2.5 font-sans text-2xl font-semibold text-brand-ink">
        <HelpCircle size={24} className="text-brand-teal" aria-hidden="true" />
        {title}
      </h2>
      <div className="mt-4 divide-y divide-brand-border rounded-lg border border-brand-border bg-white">
        {items.map((f, i) => (
          <details key={i} className="group p-5">
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-sans text-lg font-semibold text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal">
              <span>{f.q}</span>
              <ChevronDown
                size={20}
                aria-hidden="true"
                className="mt-0.5 flex-none text-brand-teal transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <p className="mt-3 text-lg text-brand-ink">{f.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
