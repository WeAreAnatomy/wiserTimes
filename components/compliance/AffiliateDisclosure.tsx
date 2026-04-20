import { disclaimers } from '@/lib/compliance';

/**
 * ASA/CAP-compliant "contains affiliate links" label. Appears near the
 * top of the page for every article with affiliate links. Kept visually
 * light but clearly identifiable per §10.3 of the brief.
 */
export default function AffiliateDisclosure() {
  return (
    <p
      role="note"
      className="my-4 flex items-start gap-2 rounded-md border border-brand-border bg-brand-cream px-4 py-3 text-base text-brand-muted"
    >
      <span
        aria-hidden="true"
        className="flex-none rounded bg-brand-ink px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white"
      >
        Ad
      </span>
      <span>
        <span className="font-semibold text-brand-ink">{disclaimers.affiliate.title}.</span>{' '}
        {disclaimers.affiliate.body}
      </span>
    </p>
  );
}
