// Regenerate the homepage daily so newly published articles surface in the
// "Latest articles" section without a manual deploy.
export const revalidate = 86400;

import Link from 'next/link';
import {
  CheckCircle2,
  Home,
  Accessibility,
  Flower2,
  Laptop2,
  HandHeart,
  ScrollText,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Mail,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { verticalsList, siteConfig } from '@/lib/config';
import { getAllArticles } from '@/lib/content';
import { articleUrl } from '@/lib/content';
import Container from '@/components/layout/Container';
import CTAButton from '@/components/blocks/CTAButton';
import Stat from '@/components/blocks/Stat';
import TopicIllustration from '@/components/blocks/TopicIllustration';
import AdSlot from '@/components/ads/AdSlot';

const verticalIcons: Record<string, LucideIcon> = {
  'equity-release': Home,
  'mobility-aids': Accessibility,
  'funeral-planning': Flower2,
  'tech-guides': Laptop2,
  benefits: HandHeart,
  'wills-poa': ScrollText,
};

const verticalColors: Record<string, { card: string; icon: string; accent: string }> = {
  'equity-release': {
    card: 'hover:border-emerald-300',
    icon: 'bg-emerald-50 text-emerald-700',
    accent: 'border-l-emerald-600',
  },
  'mobility-aids': {
    card: 'hover:border-sky-300',
    icon: 'bg-sky-50 text-sky-700',
    accent: 'border-l-sky-600',
  },
  'funeral-planning': {
    card: 'hover:border-violet-300',
    icon: 'bg-violet-50 text-violet-700',
    accent: 'border-l-violet-600',
  },
  'tech-guides': {
    card: 'hover:border-amber-300',
    icon: 'bg-amber-50 text-amber-700',
    accent: 'border-l-amber-500',
  },
  benefits: {
    card: 'hover:border-rose-300',
    icon: 'bg-rose-50 text-rose-700',
    accent: 'border-l-rose-600',
  },
  'wills-poa': {
    card: 'hover:border-indigo-300',
    icon: 'bg-indigo-50 text-indigo-700',
    accent: 'border-l-indigo-600',
  },
};

const guideVerticalColors: Record<string, string> = {
  'equity-release': 'bg-emerald-50 text-emerald-700',
  'mobility-aids': 'bg-sky-50 text-sky-700',
  'funeral-planning': 'bg-violet-50 text-violet-700',
  'tech-guides': 'bg-amber-50 text-amber-700',
  benefits: 'bg-rose-50 text-rose-700',
  'wills-poa': 'bg-indigo-50 text-indigo-700',
};

export default function HomePage() {
  const recent = getAllArticles().slice(0, 6);

  return (
    <>
      {/* ── Hero ── */}
      <section className="bg-brand-sand/40 border-b border-brand-border">
        <Container width="wide" className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.1fr_1fr]">
          <div className="text-center lg:text-left">
            <p className="font-sans text-base font-semibold uppercase tracking-wide text-brand-teal">
              For people over 55 and their families
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold text-brand-ink sm:text-5xl lg:mx-0 mx-auto">
              {siteConfig.tagline}
            </h1>
            <p className="mt-4 max-w-2xl text-xl text-brand-muted lg:mx-0 mx-auto">
              Honest, regularly reviewed guides on equity release, mobility, benefits,
              wills, funeral planning, and the tech that keeps you connected.
            </p>

            {/* Trust badges */}
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
              <li className="flex items-center gap-2 rounded-full bg-white border border-brand-border px-4 py-2 text-base font-semibold text-brand-deep shadow-sm">
                <ShieldCheck size={18} className="text-brand-teal" aria-hidden="true" />
                Free to read
              </li>
              <li className="flex items-center gap-2 rounded-full bg-white border border-brand-border px-4 py-2 text-base font-semibold text-brand-deep shadow-sm">
                <RefreshCw size={18} className="text-brand-teal" aria-hidden="true" />
                Reviewed every 90 days
              </li>
              <li className="flex items-center gap-2 rounded-full bg-white border border-brand-border px-4 py-2 text-base font-semibold text-brand-deep shadow-sm">
                <CheckCircle2 size={18} className="text-brand-teal" aria-hidden="true" />
                No paywall, ever
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-brand-border bg-white shadow-sm overflow-hidden">
            <TopicIllustration topic="home" variant="hero" />
          </div>
        </Container>
      </section>

      {/* ── Browse by topic ── */}
      <Container width="wide" className="pt-12 pb-10">
        <h2 className="font-serif text-3xl font-semibold text-brand-ink text-center">
          Browse by topic
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {verticalsList.map((v) => {
            const Icon = verticalIcons[v.slug] ?? BookOpen;
            const colors = verticalColors[v.slug];
            return (
              <li key={v.slug}>
                <Link
                  href={`/${v.slug}/`}
                  className={`group flex h-full flex-col overflow-hidden rounded-lg border border-brand-border border-l-4 ${colors?.accent ?? ''} bg-white transition hover:shadow-md ${colors?.card ?? 'hover:border-brand-teal'} focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal`}
                >
                  <TopicIllustration topic={v.slug} variant="card" />
                  <div className="flex flex-1 flex-col p-6">
                    <span
                      aria-hidden="true"
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${colors?.icon ?? 'bg-brand-sand text-brand-teal'}`}
                    >
                      <Icon size={26} />
                    </span>
                    <p className="font-sans text-xl font-semibold text-brand-ink">{v.label}</p>
                    <p className="mt-2 flex-1 text-lg text-brand-muted">{v.description}</p>
                    <p className="mt-4 inline-flex items-center gap-1.5 font-sans font-semibold text-brand-teal">
                      Read guides
                      <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-0.5" />
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
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
          <h2 className="flex items-center gap-2.5 font-serif text-3xl font-semibold text-brand-ink">
            <BookOpen size={28} className="text-brand-teal" aria-hidden="true" />
            Popular guides
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((a) => {
              const vertical = siteConfig.verticals[a.frontmatter.vertical];
              const Icon = verticalIcons[a.frontmatter.vertical] ?? BookOpen;
              const iconColor = guideVerticalColors[a.frontmatter.vertical] ?? 'bg-brand-sand text-brand-teal';
              return (
                <li key={a.frontmatter.slug}>
                  <Link
                    href={articleUrl(a.frontmatter)}
                    className="group flex h-full flex-col rounded-lg border border-brand-border bg-white p-5 transition hover:shadow-md hover:border-brand-teal focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                  >
                    <span
                      aria-hidden="true"
                      className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${iconColor}`}
                    >
                      <Icon size={20} />
                    </span>
                    {vertical && (
                      <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">
                        {vertical.shortLabel}
                      </p>
                    )}
                    <p className="mt-1 font-sans text-lg font-semibold text-brand-ink group-hover:text-brand-teal">
                      {a.frontmatter.title}
                    </p>
                    <p className="mt-1 text-base text-brand-muted line-clamp-2">
                      {a.frontmatter.description}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Container>
      )}

      {/* ── Newsletter / engagement CTA ── */}
      <section className="bg-brand-ink">
        <Container width="wide" className="py-12 sm:py-14 text-center">
          <span aria-hidden="true" className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <Mail size={28} className="text-white" />
          </span>
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
