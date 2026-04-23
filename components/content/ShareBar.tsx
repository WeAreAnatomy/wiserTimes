'use client';

import { useEffect, useRef, useState } from 'react';
import { Mail, Link2, Check, ChevronDown } from 'lucide-react';
import { siteConfig } from '@/lib/config';

export interface ShareBarProps {
  /** Path of the page being shared (relative, e.g. `/equity-release/foo/`). */
  url: string;
  /** Article title - used in mail subject and WhatsApp body. */
  title: string;
  /** Section label shown above the buttons. */
  label?: string;
  className?: string;
}

// Lucide-react no longer ships brand icons (trademark policy), so we inline
// the two glyphs we need. Keep them small and aria-hidden - the button label
// carries the meaning.
function WhatsAppGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19.05 4.91A10 10 0 0 0 12 2C6.5 2 2 6.5 2 12a10 10 0 0 0 1.34 5L2 22l5.13-1.34A10 10 0 0 0 12 22c5.5 0 10-4.5 10-10a10 10 0 0 0-2.95-7.09Zm-7.05 15.4a8.3 8.3 0 0 1-4.23-1.16l-.3-.18-3.05.8.81-2.97-.2-.31A8.3 8.3 0 0 1 3.7 12 8.3 8.3 0 0 1 12 3.7 8.3 8.3 0 0 1 20.3 12c0 4.59-3.71 8.31-8.3 8.31Zm4.55-6.22c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.07-.25-.13-1.05-.39-2-1.23-.74-.66-1.24-1.47-1.39-1.72-.14-.25-.01-.39.11-.51.11-.11.25-.29.38-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.56-1.36-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31s-.86.85-.86 2.07.88 2.4 1 2.57c.13.17 1.74 2.66 4.21 3.73.59.25 1.05.41 1.41.52.59.19 1.13.16 1.55.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3Z" />
    </svg>
  );
}

function FacebookGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  );
}

function XGlyph({ size = 20 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2H21.5l-7.55 8.63L23 22h-6.94l-5.43-6.96L4.4 22H1.14l8.08-9.23L1 2h7.1l4.9 6.49L18.244 2Zm-1.22 18h1.92L7.06 4H5.04l11.984 16Z" />
    </svg>
  );
}

const buttonClass =
  'inline-flex min-h-tap items-center gap-2 rounded-md border border-brand-border bg-white px-4 py-2 font-sans text-base font-semibold text-brand-ink hover:border-brand-teal hover:text-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 transition';

/**
 * Simple article share bar. Renders five channels - Email (Gmail / Outlook /
 * Yahoo chooser), WhatsApp, Facebook, X, and Copy link - sized for the
 * 18px / 44px-tap-target accessibility floor.
 *
 * The social links are plain `<a>` elements so they work before (and without)
 * JavaScript. Only the copy-link button needs hydration to show the "Copied"
 * confirmation, and the email chooser uses native `<details>` for the popover.
 * Use this at the top and bottom of every article via the spoke page template
 * - do not roll your own share UI elsewhere.
 */
export default function ShareBar({
  url,
  title,
  label = 'Share this article',
  className = '',
}: ShareBarProps) {
  const fullUrl = `${siteConfig.url}${url}`;
  const encodedUrl = encodeURIComponent(fullUrl);
  const encodedTitle = encodeURIComponent(title);

  // Email opens a webmail-provider chooser. Plain `mailto:` is omitted on
  // purpose - it silently fails when the OS has no default mail handler set,
  // which is the majority case in 2026.
  const encodedBody = encodeURIComponent(`${title}\n\n${fullUrl}`);
  const emailOptions = [
    {
      label: 'Gmail',
      href: `https://mail.google.com/mail/?view=cm&fs=1&su=${encodedTitle}&body=${encodedBody}`,
    },
    {
      label: 'Outlook.com',
      href: `https://outlook.live.com/mail/0/deeplink/compose?subject=${encodedTitle}&body=${encodedBody}`,
    },
    {
      label: 'Yahoo Mail',
      href: `https://compose.mail.yahoo.com/?subject=${encodedTitle}&body=${encodedBody}`,
    },
  ];

  const whatsappHref = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const xHref = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;

  const [copied, setCopied] = useState(false);

  // Native <details> doesn't dismiss on outside click - wire pointer + Escape
  // listeners so the email popover behaves like every other dropdown.
  const emailDetailsRef = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      const el = emailDetailsRef.current;
      if (!el || !el.open) return;
      if (!el.contains(e.target as Node)) el.open = false;
    }
    function handleKeyDown(e: KeyboardEvent) {
      const el = emailDetailsRef.current;
      if (!el || !el.open) return;
      if (e.key === 'Escape') {
        el.open = false;
        // Return focus to the summary so keyboard users don't get lost.
        el.querySelector<HTMLElement>('summary')?.focus();
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  async function handleCopy() {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      } else {
        // Fallback for older browsers - select a hidden textarea and execCommand.
        const ta = document.createElement('textarea');
        ta.value = fullUrl;
        ta.setAttribute('readonly', '');
        ta.style.position = 'absolute';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <section
      aria-label={label}
      className={`my-6 rounded-lg border border-brand-border bg-brand-cream/60 p-4 ${className}`}
    >
      <p className="font-sans text-base font-semibold text-brand-ink">{label}</p>
      <ul className="mt-3 flex flex-wrap gap-2">
        <li>
          <button
            type="button"
            onClick={handleCopy}
            className={buttonClass}
            aria-live="polite"
            aria-label={copied ? 'Link copied to clipboard' : 'Copy link to this article'}
          >
            {copied ? (
              <>
                <Check size={20} aria-hidden="true" className="text-ok" />
                Copied
              </>
            ) : (
              <>
                <Link2 size={20} aria-hidden="true" className="text-brand-teal" />
                Copy link
              </>
            )}
          </button>
        </li>
        <li className="relative">
          <details ref={emailDetailsRef} className="group">
            <summary
              className={`${buttonClass} list-none cursor-pointer`}
              aria-label={`Share "${title}" by email - choose mail provider`}
            >
              <Mail size={20} aria-hidden="true" className="text-brand-teal" />
              Email
              <ChevronDown
                size={16}
                aria-hidden="true"
                className="ml-1 text-brand-muted transition-transform duration-150 group-open:rotate-180"
              />
            </summary>
            <ul
              className="absolute left-0 z-10 mt-2 min-w-[14rem] overflow-hidden rounded-md border border-brand-border bg-white shadow-lg"
              role="menu"
            >
              {emailOptions.map((opt) => (
                <li key={opt.label} role="none">
                  <a
                    href={opt.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block min-h-tap px-4 py-2.5 font-sans text-base text-brand-ink hover:bg-brand-cream hover:text-brand-teal focus:outline-none focus-visible:bg-brand-cream focus-visible:text-brand-teal"
                    role="menuitem"
                  >
                    {opt.label}
                  </a>
                </li>
              ))}
            </ul>
          </details>
        </li>
        <li>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
            aria-label={`Share "${title}" on WhatsApp`}
          >
            <span className="text-brand-teal">
              <WhatsAppGlyph />
            </span>
            WhatsApp
          </a>
        </li>
        <li>
          <a
            href={facebookHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
            aria-label={`Share "${title}" on Facebook`}
          >
            <span className="text-brand-teal">
              <FacebookGlyph />
            </span>
            Facebook
          </a>
        </li>
        <li>
          <a
            href={xHref}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass}
            aria-label={`Share "${title}" on X`}
          >
            <span className="text-brand-teal">
              <XGlyph />
            </span>
            X
          </a>
        </li>
      </ul>
    </section>
  );
}
