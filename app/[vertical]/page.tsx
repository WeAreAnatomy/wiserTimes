import { notFound } from 'next/navigation';
import Link from 'next/link';
import { siteConfig, verticalsList } from '@/lib/config';
import {
  getPillarForVertical,
  getSpokesForVertical,
  articleUrl,
} from '@/lib/content';
import type { Vertical } from '@/lib/types';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ArticleHeader from '@/components/content/ArticleHeader';
import TableOfContents from '@/components/content/TableOfContents';
import AuthorCard from '@/components/content/AuthorCard';
import MarkdownRenderer from '@/components/content/MarkdownRenderer';
import AffiliateDisclosure from '@/components/compliance/AffiliateDisclosure';
import FCADisclaimer from '@/components/compliance/FCADisclaimer';
import MedicalDisclaimer from '@/components/compliance/MedicalDisclaimer';
import LegalDisclaimer from '@/components/compliance/LegalDisclaimer';
import ArticleSchema from '@/components/seo/ArticleSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';

export function generateStaticParams() {
  return verticalsList.map((v) => ({ vertical: v.slug }));
}

export async function generateMetadata({ params }: { params: { vertical: string } }) {
  const v = siteConfig.verticals[params.vertical as Vertical];
  if (!v) return {};
  const pillar = getPillarForVertical(v.slug);
  return {
    title: pillar ? pillar.frontmatter.title : v.label,
    description: pillar ? pillar.frontmatter.description : v.description,
    alternates: { canonical: `/${v.slug}/` },
  };
}

export default async function VerticalPillarPage({
  params,
}: {
  params: { vertical: string };
}) {
  const v = siteConfig.verticals[params.vertical as Vertical];
  if (!v) return notFound();

  const pillar = getPillarForVertical(v.slug);
  const spokes = getSpokesForVertical(v.slug);

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

      {pillar ? (
        <>
          <ArticleHeader article={pillar} />
          <TableOfContents body={pillar.body} />
          {pillar.frontmatter.affiliates && pillar.frontmatter.affiliates.length > 0 && (
            <AffiliateDisclosure />
          )}
          <MarkdownRenderer source={pillar.body} />
          {v.regulatoryDomain === 'finance' && (
            <FCADisclaimer equityRelease={v.slug === 'equity-release'} />
          )}
          {v.regulatoryDomain === 'health' && <MedicalDisclaimer />}
          {v.regulatoryDomain === 'legal' && <LegalDisclaimer />}
          <AuthorCard authorSlug={pillar.frontmatter.author} />
        </>
      ) : (
        <>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-brand-ink">{v.label}</h1>
          <p className="mt-3 text-xl text-brand-muted">{v.description}</p>
        </>
      )}

      {spokes.length > 0 && (
        <section className="mt-10" aria-labelledby="guides-heading">
          <h2 id="guides-heading" className="font-sans text-2xl font-semibold text-brand-ink">
            More {v.shortLabel.toLowerCase()} guides
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2">
            {spokes.map((s) => (
              <li key={s.frontmatter.slug}>
                <Link
                  href={articleUrl(s.frontmatter)}
                  className="block rounded-lg border border-brand-border bg-white p-5 hover:border-brand-teal hover:bg-brand-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                >
                  <p className="font-sans text-lg font-semibold text-brand-ink">
                    {s.frontmatter.title}
                  </p>
                  <p className="mt-1 text-base text-brand-muted">{s.frontmatter.description}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {pillar && (
        <>
          <ArticleSchema article={pillar} />
          <FAQSchema frontmatter={pillar.frontmatter} />
        </>
      )}
      <BreadcrumbSchema items={schemaCrumbs} />
    </Container>
  );
}
