import type { ReactNode } from 'react';

export type DisclaimerTone = 'neutral' | 'warning' | 'regulatory';

export interface DisclaimerProps {
  title: string;
  children: ReactNode;
  tone?: DisclaimerTone;
  id?: string;
}

const toneStyles: Record<DisclaimerTone, string> = {
  neutral: 'border-brand-border bg-white',
  warning: 'border-warn bg-warn/5',
  regulatory: 'border-brand-ink bg-brand-sand',
};

/**
 * Primitive disclaimer box. Never render this directly from a page —
 * always go through FCADisclaimer, MedicalDisclaimer, LegalDisclaimer,
 * or AffiliateDisclosure so the copy stays in lib/compliance.ts.
 */
export default function Disclaimer({
  title,
  children,
  tone = 'regulatory',
  id,
}: DisclaimerProps) {
  return (
    <aside
      id={id}
      className={`my-8 rounded-lg border-l-4 ${toneStyles[tone]} px-5 py-4`}
      role="note"
    >
      <p className="mb-1 font-sans text-base font-semibold uppercase tracking-wide text-brand-ink">
        {title}
      </p>
      <div className="text-base leading-relaxed text-brand-ink">{children}</div>
    </aside>
  );
}
