import Link from 'next/link';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/config';
import { searchArticles } from '@/lib/search';
import { formatPublishDate } from '@/lib/dates';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import SearchBar from '@/components/layout/SearchBar';

export const metadata: Metadata = {
  title: 'Search',
  description: `Search every guide on ${siteConfig.name}.`,
  alternates: { canonical: '/search/' },
  // Search pages are user-specific URLs that should not be indexed.
  robots: { index: false, follow: true },
};

interface SearchPageProps {
  searchParams: { q?: string | string[] };
}

function readQuery(q: string | string[] | undefined): string {
  if (!q) return '';
  return Array.isArray(q) ? (q[0] ?? '') : q;
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = readQuery(searchParams.q).slice(0, 200);
  const results = searchArticles(query);
  const hasQuery = query.trim().length > 0;

  return (
    <Container width="content" className="pt-8 pb-16">
      <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]} />
      <h1 className="mt-4 font-serif text-4xl font-semibold text-brand-ink">Search</h1>
      <p className="mt-2 text-lg text-brand-muted">
        Search every guide on {siteConfig.name}.
      </p>

      <div className="mt-6">
        <SearchBar defaultValue={query} variant="page" id="search-page-input" />
      </div>

      <section aria-live="polite" aria-atomic="false" className="mt-10">
        {!hasQuery && (
          <p className="text-lg text-brand-muted">
            Enter a topic above — for example <em>stairlifts</em>, <em>pension credit</em>, or{' '}
            <em>lasting power of attorney</em>.
          </p>
        )}

        {hasQuery && results.length === 0 && (
          <div>
            <p className="text-lg text-brand-ink">
              No guides matched <strong>“{query}”</strong>.
            </p>
            <p className="mt-2 text-base text-brand-muted">
              Try a shorter or more general phrase, or browse our topics below.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {Object.values(siteConfig.verticals).map((v) => (
                <li key={v.slug}>
                  <Link
                    href={`/${v.slug}/`}
                    className="inline-flex min-h-tap items-center rounded-md border border-brand-border bg-white px-4 py-2 text-base font-semibold text-brand-deep hover:border-brand-teal hover:text-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                  >
                    {v.shortLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {hasQuery && results.length > 0 && (
          <>
            <p className="text-base text-brand-muted">
              {results.length} {results.length === 1 ? 'result' : 'results'} for{' '}
              <strong className="text-brand-ink">“{query}”</strong>
            </p>
            <ul className="mt-5 flex flex-col gap-4">
              {results.map((r) => {
                const vertical = siteConfig.verticals[r.vertical];
                return (
                  <li key={`${r.vertical}/${r.slug}`}>
                    <Link
                      href={r.url}
                      className="group block rounded-lg border border-brand-border bg-white p-5 transition hover:border-brand-teal hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                    >
                      {vertical && (
                        <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">
                          {vertical.shortLabel}
                        </p>
                      )}
                      <p className="mt-1 font-sans text-xl font-semibold text-brand-ink group-hover:text-brand-teal">
                        {r.title}
                      </p>
                      <p className="mt-2 text-base text-brand-muted">{r.description}</p>
                      {r.snippet && (
                        <p className="mt-2 text-base text-brand-ink/80">{r.snippet}</p>
                      )}
                      <p className="mt-2 text-sm text-brand-muted">
                        Published{' '}
                        <time dateTime={r.published}>{formatPublishDate(r.published)}</time>
                      </p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>
    </Container>
  );
}
