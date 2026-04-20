import Link from 'next/link';
import type { ReactNode } from 'react';

export type CTAVariant = 'primary' | 'secondary' | 'ghost';
export type CTASize = 'md' | 'lg';

interface CommonProps {
  children: ReactNode;
  variant?: CTAVariant;
  size?: CTASize;
  ariaLabel?: string;
  className?: string;
}

interface LinkProps extends CommonProps {
  href: string;
  external?: boolean;
  /** For affiliate/sponsored links — renders rel="sponsored nofollow". */
  sponsored?: boolean;
  submit?: never;
}

interface SubmitProps extends CommonProps {
  submit: true;
  href?: never;
  external?: never;
  sponsored?: never;
  form?: string;
}

export type CTAButtonProps = LinkProps | SubmitProps;

const base =
  'inline-flex items-center justify-center font-sans font-semibold rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 transition';

const variants: Record<CTAVariant, string> = {
  primary: 'bg-brand-teal text-white hover:bg-brand-deep',
  secondary: 'bg-brand-ink text-white hover:bg-brand-deep',
  ghost: 'bg-transparent text-brand-teal border border-brand-teal hover:bg-brand-teal hover:text-white',
};

const sizes: Record<CTASize, string> = {
  md: 'min-h-tap px-5 py-2.5 text-lg',
  lg: 'min-h-[3.25rem] px-7 py-3 text-xl',
};

/**
 * The single CTA/link-button component for the entire site.
 *
 * Three modes:
 *   - Internal link: <CTAButton href="/foo">
 *   - External link: <CTAButton href="https://..." external />
 *   - Sponsored / affiliate: <CTAButton href="https://..." sponsored />
 *   - Submit button: <CTAButton submit>Send enquiry</CTAButton>
 *
 * Do not write <button> or <a className="..."> at call sites — use this.
 */
export default function CTAButton(props: CTAButtonProps) {
  const { children, variant = 'primary', size = 'md', ariaLabel, className = '' } = props;
  const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if ('submit' in props && props.submit) {
    return (
      <button type="submit" form={props.form} className={cls} aria-label={ariaLabel}>
        {children}
      </button>
    );
  }

  const { href, external, sponsored } = props as LinkProps;
  const rel = [external ? 'noopener noreferrer' : '', sponsored ? 'sponsored nofollow' : '']
    .filter(Boolean)
    .join(' ');

  if (external || sponsored) {
    return (
      <a
        href={href}
        className={cls}
        target={external ? '_blank' : undefined}
        rel={rel || undefined}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={cls} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}
