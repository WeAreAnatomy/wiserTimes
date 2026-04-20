import type { ReactNode } from 'react';
import type { AffiliateReference } from '@/lib/types';

export interface AffiliateLinkProps {
  affiliate: AffiliateReference;
  children: ReactNode;
  /** Optional wrapper variant — pure text link or a button-style CTA. */
  as?: 'text' | 'cta';
}

/**
 * Inline affiliate link. Applies rel="sponsored nofollow noopener" and
 * appends a small visual "Ad" marker. The AffiliateDisclosure at the top
 * of the page is still required — this component does not replace it.
 *
 * For button-style affiliate CTAs, use <CTAButton sponsored ...> instead.
 * This component is for inline, in-body product links.
 */
export default function AffiliateLink({ affiliate, children, as = 'text' }: AffiliateLinkProps) {
  const base =
    'inline-flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded';
  const style =
    as === 'cta'
      ? 'rounded-md bg-brand-teal px-4 py-2 text-white hover:bg-brand-deep'
      : 'text-brand-teal underline hover:text-brand-deep';
  return (
    <a
      href={affiliate.url}
      className={`${base} ${style}`}
      rel="sponsored nofollow noopener"
      target="_blank"
    >
      {children}
      <span
        aria-hidden="true"
        className="ml-1 rounded bg-brand-ink/10 px-1 text-xs font-semibold uppercase tracking-wide text-brand-ink"
      >
        Ad
      </span>
    </a>
  );
}
