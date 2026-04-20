import Link from 'next/link';
import { verticalsList, siteConfig } from '@/lib/config';
import { getAllArticles } from '@/lib/content';
import { articleUrl } from '@/lib/content';
import Container from '@/components/layout/Container';
import CTAButton from '@/components/blocks/CTAButton';
import Stat from '@/components/blocks/Stat';
import AdSlot from '@/components/ads/AdSlot';

const verticalAccents: Record<string, string> = {
  'equity-release': 'border-l-emerald-700',
  'mobility-aids': 'border-l-sky-700',
  'funeral-planning': 'border-l-violet-700',
  'tech-guides': 'border-l-amber-600',
  benefits: 'border-l-rose-700',
  'wills-poa': 'border-l-indigo-700',
};

export default function HomePage() {
  const recent = getAllArticles().slice(0, 6);

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-brand-sand/40 border-b border-brand-border">
        <Container width="wide" className="py-12 sm:py-16 text-center">
          <p className="font-sans text-base font-semibold uppercase tracking-wide text-brand-teal">
            For people over 55 and their families
          </p>
          <h1 className="mx-auto mt-3 max-w-3xl font-serif text-4xl font-semibold text-brand-ink sm:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-xl text-brand-muted">
            Honest, regularly reviewed guides on equity release, mobility, benefits,
            wills, funeral planning, and the tech that keeps you connected.
          </p>

          {/* Trust badges */}
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-base font-semibold text-brand-deep">
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="text-brand-teal text-xl">&#10003;</span>
              Free to read
            </li>
            <li className="flex items-center gap-2">
              <span aria-hidden="true" className="text-brand-teal text-xl">&#10003;</span>
              Reviewed every 90 days
            </li>

          </ul>
        </Container>
      </section>

      {/* ── Browse by topic ── */}
      <Container width="wide" className="pt-12 pb-10">
        <h2 className="font-serif text-3xl font-semibold text-brand-ink text-center">
          Browse by topic
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verticalsList.map((v) => (
            <li key={v.slug}>
              <Link
                href={`/${v.slug}/`}
                className={`block h-full rounded-lg border border-brand-border border-l-4 ${verticalAccents[v.slug] ?? ''} bg-white p-6 transition hover:shadow-md hover:border-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal`}
              >
                <p className="font-sans text-xl font-semibold text-brand-ink">{v.label}</p>
                <p className="mt-2 text-lg text-brand-muted">{v.description}</p>
                <p className="mt-3 font-sans font-semibold text-brand-teal">
                  Read guides &rarr;
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>

      {/* ── Ad slot: mid-page ── */}
      <Container width="wide" className="pb-4">
        <AdSlot position="home-mid" height={120} />
      </Container>

      {/* ── Trust stats ── */}
      <Container width="wide" className="py-10">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat value="150+" label="Guides published" />
          <Stat value="90 days" label="Maximum review cycle" />
          <Stat value="100%" label="Free, no paywall" />
        </div>
      </Container>

      {/* ── Popular guides ── */}
      {recent.length > 0 && (
        <Container width="wide" className="pb-12">
          <h2 className="font-serif text-3xl font-semibold text-brand-ink">
            Popular guides
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((a) => (
              <li key={a.frontmatter.slug}>
                <Link
                  href={articleUrl(a.frontmatter)}
                  className="block h-full rounded-lg border border-brand-border bg-white p-5 transition hover:shadow-md hover:border-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                >
                  <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">
                    {siteConfig.verticals[a.frontmatter.vertical].shortLabel}
                  </p>
                  <p className="mt-1 font-sans text-lg font-semibold text-brand-ink">
                    {a.frontmatter.title}
                  </p>
                  <p className="mt-1 text-base text-brand-muted line-clamp-2">
                    {a.frontmatter.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      )}

      {/* ── Newsletter / engagement CTA ── */}
      <section className="bg-brand-ink">
        <Container width="wide" className="py-12 sm:py-14 text-center">
          <h2 className="font-serif text-3xl font-semibold text-white">
            One useful guide, once a week
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-brand-cream/80">
            Join our free weekly digest. We pick one guide that matters
            and send it straight to your inbox. No spam, unsubscribe any time.
          </p>
          <form
            action="#"
            method="POST"
            className="mx-auto mt-6 flex max-w-md flex-col gap-3 sm:flex-row"
          >
            <label htmlFor="home-email" className="sr-only">
              Email address
            </label>
            <input
              id="home-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.co.uk"
              className="min-h-tap flex-1 rounded-md border border-brand-cream/30 bg-white/10 px-4 py-2.5 text-lg text-white placeholder:text-brand-cream/50 focus:border-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            />
            <CTAButton submit size="lg">
              Subscribe
            </CTAButton>
          </form>
        </Container>
      </section>

      {/* ── Ad slot: lower page ── */}
      <Container width="wide" className="pt-8 pb-4">
        <AdSlot position="home-lower" height={120} />
      </Container>
    </>
  );
}
