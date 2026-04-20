'use client';

import { useEffect, useState } from 'react';

export type AdPosition =
  | 'header'
  | 'in-article-1'
  | 'in-article-2'
  | 'sidebar-1'
  | 'sidebar-2'
  | 'footer'
  | 'pillar-hero'
  | 'home-mid'
  | 'home-lower';

export interface AdSlotProps {
  position: AdPosition;
  /** AdSense slot ID. Omitted slots render a placeholder during development. */
  slotId?: string;
  /** Suggested CSS shape; ad scripts ignore this. */
  height?: number;
}

/**
 * The ONE ad surface in the site. Do not write a second ad component.
 * When you need a new placement, add it to AdPosition and let the
 * component pick it up.
 *
 * Respects consent: does not request ads until window.__wlConsent === 'accepted'.
 */
export default function AdSlot({ position, slotId, height = 280 }: AdSlotProps) {
  const [consent, setConsent] = useState<string | null>(null);

  useEffect(() => {
    const read = () =>
      (window as unknown as { __wlConsent?: string }).__wlConsent ?? null;
    setConsent(read());
    const handler = () => setConsent(read());
    window.addEventListener('wl-consent', handler);
    return () => window.removeEventListener('wl-consent', handler);
  }, []);

  const hasAds = consent === 'accepted' && slotId;

  return (
    <aside
      aria-label="Advertisement"
      className="my-6 flex items-center justify-center rounded-md border border-dashed border-brand-border bg-brand-cream/50 text-base text-brand-muted"
      style={{ minHeight: height }}
      data-ad-position={position}
      data-ad-slot={slotId}
    >
      {hasAds ? (
        <span>Ad placement ({position})</span>
      ) : (
        <span>Advertisement space</span>
      )}
    </aside>
  );
}
