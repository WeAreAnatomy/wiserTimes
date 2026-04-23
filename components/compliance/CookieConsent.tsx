'use client';

import { useEffect, useState } from 'react';
import CTAButton from '@/components/blocks/CTAButton';

type ConsentState = 'accepted' | 'rejected' | null;

const COOKIE_NAME = 'wl-consent';

function readConsent(): ConsentState {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(^| )${COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const val = decodeURIComponent(match[2]);
  if (val === 'accepted' || val === 'rejected') return val;
  return null;
}

function writeConsent(val: 'accepted' | 'rejected') {
  if (typeof document === 'undefined') return;
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${COOKIE_NAME}=${val}; Max-Age=${oneYear}; Path=/; SameSite=Lax`;
}

/**
 * Consent-before-tracking banner per §10.4. Stores choice in a first-party
 * cookie. Analytics/ad scripts must check `window.__wlConsent` before firing.
 *
 * Offers genuine choice (Accept/Reject) - no pre-ticked boxes.
 */
export default function CookieConsent() {
  const [consent, setConsent] = useState<ConsentState>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setConsent(readConsent());
    setHydrated(true);
  }, []);

  const choose = (val: 'accepted' | 'rejected') => {
    writeConsent(val);
    setConsent(val);
    if (typeof window !== 'undefined') {
      (window as unknown as { __wlConsent?: string }).__wlConsent = val;
      window.dispatchEvent(new CustomEvent('wl-consent', { detail: val }));
    }
  };

  if (!hydrated || consent) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="cookie-title"
      aria-describedby="cookie-desc"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-brand-teal bg-white shadow-[0_-4px_14px_rgba(0,0,0,0.08)]"
    >
      <div className="mx-auto flex max-w-wide flex-col gap-4 px-5 py-5 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p id="cookie-title" className="font-sans text-lg font-semibold text-brand-ink">
            Your privacy on Wiser Times
          </p>
          <p id="cookie-desc" className="mt-1 max-w-prose text-base text-brand-ink">
            We use essential cookies to make the site work. We{"'"}d also like your permission to set analytics and
            advertising cookies so we can improve the site and show relevant information. You can change your mind at
            any time in our{' '}
            <a href="/cookies/" className="text-brand-teal underline">
              cookie policy
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <CTAButton variant="ghost" size="md" href="/cookies/">
            Manage preferences
          </CTAButton>
          <button
            type="button"
            onClick={() => choose('rejected')}
            className="inline-flex min-h-tap items-center justify-center rounded-md border border-brand-border bg-white px-5 py-2.5 font-sans text-lg font-semibold text-brand-ink hover:bg-brand-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => choose('accepted')}
            className="inline-flex min-h-tap items-center justify-center rounded-md bg-brand-teal px-5 py-2.5 font-sans text-lg font-semibold text-white hover:bg-brand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
