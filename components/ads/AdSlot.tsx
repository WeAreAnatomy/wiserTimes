'use client';

import { useEffect, useRef, useState } from 'react';
import { siteConfig } from '@/lib/config';

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
  /** AdSense ad-unit slot ID. Without it, the slot renders a placeholder. */
  slotId?: string;
  /** Suggested CSS shape; ad scripts ignore this. */
  height?: number;
  /**
   * Ad format passed through to AdSense. Defaults to 'auto' which is
   * responsive. Use 'fluid' for in-article native ads.
   */
  format?: 'auto' | 'fluid' | 'rectangle' | 'horizontal' | 'vertical';
  /** Required when format='fluid'. */
  layout?: string;
  /** Required when format='fluid'. */
  layoutKey?: string;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
    __wlConsent?: string;
  }
}

/**
 * The ONE ad surface in the site. Do not write a second ad component.
 * When you need a new placement, add it to AdPosition and let the
 * component pick it up.
 *
 * Respects consent: does not request ads until window.__wlConsent === 'accepted'.
 *
 * Auto ads (enabled in the AdSense console) will also fill empty space
 * on the page automatically; this component is for *manual* ad units
 * where you want a guaranteed placement.
 */
export default function AdSlot({
  position,
  slotId,
  height = 280,
  format = 'auto',
  layout,
  layoutKey,
}: AdSlotProps) {
  const [consent, setConsent] = useState<string | null>(null);
  const insRef = useRef<HTMLModElement | null>(null);
  const pushed = useRef(false);

  useEffect(() => {
    const read = () => window.__wlConsent ?? null;
    setConsent(read());
    const handler = () => setConsent(read());
    window.addEventListener('wl-consent', handler);
    return () => window.removeEventListener('wl-consent', handler);
  }, []);

  const hasAds = consent === 'accepted' && Boolean(slotId);

  useEffect(() => {
    if (!hasAds || pushed.current || !insRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // adsbygoogle.js not yet loaded; it will pick up the <ins> on next push.
    }
  }, [hasAds]);

  if (hasAds) {
    return (
      <aside
        aria-label="Advertisement"
        className="my-6"
        data-ad-position={position}
      >
        <ins
          ref={insRef}
          className="adsbygoogle"
          style={{ display: 'block', minHeight: height }}
          data-ad-client={siteConfig.adsense.publisherId}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
          {...(layout ? { 'data-ad-layout': layout } : {})}
          {...(layoutKey ? { 'data-ad-layout-key': layoutKey } : {})}
        />
      </aside>
    );
  }

  return (
    <aside
      aria-label="Advertisement"
      className="my-6 flex items-center justify-center rounded-md border border-dashed border-brand-border bg-brand-cream/50 text-base text-brand-muted"
      style={{ minHeight: height }}
      data-ad-position={position}
      data-ad-slot={slotId}
    >
      <span>Advertisement space</span>
    </aside>
  );
}
