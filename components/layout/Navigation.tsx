import Link from 'next/link';
import { Home, Accessibility, Flower2, Laptop2, HandHeart, ScrollText } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { verticalsList } from '@/lib/config';

export interface NavigationProps {
  variant?: 'header' | 'footer';
}

const verticalIcons: Record<string, LucideIcon> = {
  'equity-release': Home,
  'mobility-aids': Accessibility,
  'funeral-planning': Flower2,
  'tech-guides': Laptop2,
  benefits: HandHeart,
  'wills-poa': ScrollText,
};

/**
 * Site navigation. Brief requires: no hamburger menus, large tap targets,
 * accessible focus. Same nav renders in both header and footer — the variant
 * prop only changes styling, not content.
 */
export default function Navigation({ variant = 'header' }: NavigationProps) {
  const baseLink =
    'inline-flex items-center gap-1.5 min-h-tap px-3 py-2 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal';
  const linkClass =
    variant === 'header'
      ? `${baseLink} text-brand-deep hover:text-brand-teal hover:bg-brand-sand/60`
      : `${baseLink} text-brand-cream/90 hover:text-white hover:underline`;

  return (
    <nav aria-label={variant === 'header' ? 'Main navigation' : 'Footer navigation'}>
      <ul className="flex flex-wrap gap-2 sm:gap-3">
        {verticalsList.map((v) => {
          const Icon = verticalIcons[v.slug];
          return (
            <li key={v.slug}>
              <Link href={`/${v.slug}/`} className={linkClass}>
                {Icon && <Icon size={15} aria-hidden="true" className="flex-none opacity-70" />}
                {v.shortLabel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
