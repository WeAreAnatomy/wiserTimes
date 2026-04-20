import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookOpen, ArrowRight, Star } from 'lucide-react';
import { siteConfig, verticalsList } from '@/lib/config';
import { getArticlesByVertical, articleUrl } from '@/lib/content';
import type { Vertical, Article } from '@/lib/types';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import TopicIllustration from '@/components/blocks/TopicIllustration';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

const contentTypeLabel: Record<string, string> = {
  pillar: 'In-depth guide',
  spoke: 'Guide',
  'how-to': 'How-to',
  comparison: 'Comparison',
  'product-review': 'Review',
};

export function generateStaticParams() {
  return verticalsList.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({ params }: { params: { vertical: string } }) {
  const v = siteConfig.verticals[params.vertical as Vertical];
  if (!v) return {};
  return {
    title: `${v.label} guides`,
    description: v.description,
    alternates: { canonical: `/${v.slug}/` },
  };
}

export default async function VerticalIndexPage({
  params,
}: {
  params: { vertical: string };
}) {
  const v = siteConfig.verticals[params.vertical as Vertical];
  if (!v) return notFound();

  const all = getArticlesByVertical(v.slug);
  const pillar = all.find((a) => a.frontmatter.contentType === 'pillar') ?? null;
  const others = all.filter((a) => a.frontmatter.contentType !== 'pillar');
  const ordered: Article[] = pillar ? [pillar, ...others] : others;

  const crumbs = [
    { label: 'Home', href: '/' },
    { label: v.shortLabel },
  ];
  const schemaCrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: v.label, url: `${siteConfig.url}/${v.slug}/` },
  ];

  return (
    <Container width="content" className="pt-8 pb-16">
      <Breadcrumbs crumbs={crumbs} />

      <header className="mt-4">
        <div className="overflow-hidden rounded-2xl border border-brand-border bg-white shadow-sm">
          <TopicIllustration topic={v.slug} variant="hero" label={`${v.label} illustration`} />
        </div>
        <p className="mt-6 font-sans text-sm font-semibold uppercase tracking-wide text-brand-teal">
          Topic
        </p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-brand-ink sm:text-5xl">
          {v.label}
        </h1>
        <p className="mt-3 max-w-2xl text-xl text-brand-muted">{v.description}</p>
        {ordered.length > 0 && (
          <p className="mt-4 text-base text-brand-muted">
            {ordered.length} article{ordered.length === 1 ? '' : 's'} in this topic.
          </p>
        )}
      </header>

      {ordered.length > 0 ? (
        <section className="mt-8" aria-labelledby="articles-heading">
          <h2 id="articles-heading" className="sr-only">
            All {v.label} articles
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {ordered.map((a) => {
              const isPillar = a.frontmatter.contentType === 'pillar';
              const label =
                contentTypeLabel[a.frontmatter.contentType ?? 'spoke'] ?? 'Guide';
              return (
                <li key={a.frontmatter.slug} className={isPillar ? 'sm:col-span-2' : undefined}>
                  <Link
                    href={articleUrl(a.frontmatter)}
                    className={`group flex h-full items-start gap-4 rounded-lg border bg-white p-5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${
                      isPillar
                        ? 'border-brand-teal/40 hover:border-brand-teal hover:shadow-md'
                        : 'border-brand-border hover:border-brand-teal hover:shadow-sm'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-0.5 flex h-10 w-10 flex-none items-center justify-center rounded-lg ${
                        isPillar
                          ? 'bg-brand-teal text-white'
                          : 'bg-brand-teal/10 text-brand-teal'
                      }`}
                    >
                      {isPillar ? <Star size={20} /> : <BookOpen size={18} />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-sans text-xs font-semibold uppercase tracking-wide text-brand-teal">
                        {label}
                      </span>
                      <span className="mt-1 block font-sans text-lg font-semibold text-brand-ink group-hover:text-brand-teal">
                        {a.frontmatter.title}
                      </span>
                      <span className="mt-1 block text-base text-brand-muted">
                        {a.frontmatter.description}
                      </span>
                    </span>
                    <ArrowRight
                      size={18}
                      aria-hidden="true"
                      className="mt-1 flex-none text-brand-teal opacity-0 transition-opacity group-hover:opacity-100"
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ) : (
        <p className="mt-10 text-lg text-brand-muted">
          No articles in this topic yet. Check back soon.
        </p>
      )}

      <BreadcrumbSchema items={schemaCrumbs} />
    </Container>
  );
}
