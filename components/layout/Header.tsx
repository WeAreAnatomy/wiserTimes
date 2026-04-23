import Link from 'next/link';
import { siteConfig } from '@/lib/config';
import Container from './Container';
import Navigation from './Navigation';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <header className="border-b border-brand-border bg-brand-cream">
      <Container width="wide" className="py-4 sm:py-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-brand-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal rounded-md"
          >
            <span className="inline-flex items-baseline gap-2">
              <span className="font-serif text-2xl font-semibold sm:text-3xl">
                {siteConfig.name}
              </span>
              <span className="hidden text-base text-brand-muted sm:inline">
                {siteConfig.tagline}
              </span>
            </span>
          </Link>
          <div className="w-full sm:w-auto sm:max-w-sm sm:flex-1 sm:ml-auto">
            <SearchBar id="header-search" />
          </div>
        </div>
        <div className="mt-3 border-t border-brand-border/50 pt-3">
          <Navigation variant="header" />
        </div>
      </Container>
    </header>
  );
}
