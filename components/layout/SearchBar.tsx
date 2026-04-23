import { Search } from 'lucide-react';

export interface SearchBarProps {
  /** Pre-fills the input - used on the search results page. */
  defaultValue?: string;
  /** `compact` is the header treatment; `page` is the larger search-page hero. */
  variant?: 'compact' | 'page';
  /** Optional override for the input's id (needed if multiple bars render on the same page). */
  id?: string;
  className?: string;
}

/**
 * Site-wide search input. Submits a plain GET to `/search/?q=…` so it works
 * without JavaScript - the search page is server-rendered. Used in the header
 * and on the search page itself; do not duplicate this markup elsewhere.
 */
export default function SearchBar({
  defaultValue = '',
  variant = 'compact',
  id = 'site-search',
  className = '',
}: SearchBarProps) {
  const isPage = variant === 'page';
  const inputClass = isPage
    ? 'w-full min-h-tap rounded-l-md border border-r-0 border-brand-border bg-white pl-11 pr-3 py-3 text-lg text-brand-ink placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal'
    : 'w-full min-h-tap rounded-l-md border border-r-0 border-brand-border bg-white pl-10 pr-3 py-2 text-base text-brand-ink placeholder:text-brand-muted focus:outline-none focus:ring-2 focus:ring-brand-teal focus:border-brand-teal';
  const buttonClass = isPage
    ? 'inline-flex items-center justify-center min-h-tap rounded-r-md bg-brand-teal px-5 py-3 text-base font-semibold text-white hover:bg-brand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2'
    : 'inline-flex items-center justify-center min-h-tap rounded-r-md bg-brand-teal px-4 py-2 text-base font-semibold text-white hover:bg-brand-deep focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2';
  const iconSize = isPage ? 22 : 18;
  const iconOffset = isPage ? 'left-3.5' : 'left-3';

  return (
    <form
      action="/search/"
      method="get"
      role="search"
      aria-label="Search the site"
      className={`flex w-full items-stretch ${className}`}
    >
      <label htmlFor={id} className="sr-only">
        Search guides
      </label>
      <div className="relative flex-1">
        <Search
          size={iconSize}
          aria-hidden="true"
          className={`pointer-events-none absolute ${iconOffset} top-1/2 -translate-y-1/2 text-brand-muted`}
        />
        <input
          id={id}
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={isPage ? 'Search for a topic, e.g. "stairlifts" or "pension credit"' : 'Search guides…'}
          autoComplete="off"
          inputMode="search"
          enterKeyHint="search"
          className={inputClass}
        />
      </div>
      <button type="submit" className={buttonClass}>
        Search
      </button>
    </form>
  );
}
