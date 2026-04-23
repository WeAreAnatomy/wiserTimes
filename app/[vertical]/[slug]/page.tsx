// Pre-build published articles at deploy time. Articles not yet in the static
// params (future-dated) are rendered on demand when first requested, then
// cached and revalidated weekly. dynamicParams defaults to true in Next.js.
export const revalidate = 86400 * 7;

import { notFound } from 'next/navigation';
import { siteConfig, verticalsList } from '@/lib/config';
import {
  getArticleBySlug,
  getArticlesByVertical,
  getRelatedArticles,
} from '@/lib/content';
import type { Vertical } from '@/lib/types';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ArticleHeader from '@/components/content/ArticleHeader';
import ShareBar from '@/components/content/ShareBar';
import TableOfContents from '@/components/content/TableOfContents';
import AuthorCard from '@/components/content/AuthorCard';
import RelatedArticles from '@/components/content/RelatedArticles';
import MarkdownRenderer, {
  extractInlineFAQs,
} from '@/components/content/MarkdownRenderer';
import FAQ from '@/components/blocks/FAQ';
import AffiliateDisclosure from '@/components/compliance/AffiliateDisclosure';
import FCADisclaimer from '@/components/compliance/FCADisclaimer';
import MedicalDisclaimer from '@/components/compliance/MedicalDisclaimer';
import LegalDisclaimer from '@/components/compliance/LegalDisclaimer';
import ArticleSchema from '@/components/seo/ArticleSchema';
import FAQSchema from '@/components/seo/FAQSchema';
import BreadcrumbSchema from '@/components/seo/BreadcrumbSchema';
import HowToSchema from '@/components/seo/HowToSchema';
import ProductSchema from '@/components/seo/ProductSchema';
import AdSlot from '@/components/ads/AdSlot';

export function generateStaticParams() {
  const params: { vertical: string; slug: string }[] = [];
  for (const v of verticalsList) {
    for (const a of getArticlesByVertical(v.slug)) {
      params.push({ vertical: v.slug, slug: a.frontmatter.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: { vertical: string; slug: string };
}) {
  const v = siteConfig.verticals[params.vertical as Vertical];
  if (!v) return {};
  const article = getArticleBySlug(v.slug, params.slug);
  if (!article) return {};
  return {
    title: article.frontmatter.title,
    description: article.frontmatter.description,
    alternates: { canonical: `/${v.slug}/${article.frontmatter.slug}/` },
    keywords: article.frontmatter.keywords?.join(', '),
  };
}

export default async function SpokePage({
  params,
}: {
  params: { vertical: string; slug: string };
}) {
  const v = siteConfig.verticals[params.vertical as Vertical];
  if (!v) return notFound();

  const article = getArticleBySlug(v.slug, params.slug);
  if (!article) return notFound();

  const related = getRelatedArticles(v.slug, article.frontmatter.slug);
  const crumbs = [
    { label: 'Home', href: '/' },
    { label: v.shortLabel, href: `/${v.slug}/` },
    { label: article.frontmatter.title },
  ];
  const schemaCrumbs = [
    { name: 'Home', url: siteConfig.url },
    { name: v.label, url: `${siteConfig.url}/${v.slug}/` },
    { name: article.frontmatter.title, url: `${siteConfig.url}/${v.slug}/${article.frontmatter.slug}/` },
  ];

  const hasAffiliates =
    (article.frontmatter.affiliates && article.frontmatter.affiliates.length > 0) ?? false;

  // Merge frontmatter FAQs with any inline `:::faq` blocks so:
  //   1. The page-level <FAQ /> only renders if there ISN'T already an
  //      inline one (avoids duplicate FAQ sections on screen).
  //   2. The FAQ schema reflects the union (Google requires the JSON-LD
  //      to match what the user sees).
  const inlineFAQs = extractInlineFAQs(article.body);
  const frontmatterFAQs = article.frontmatter.faqs ?? [];
  const allFAQs = [...frontmatterFAQs, ...inlineFAQs];
  const showPageLevelFAQ = inlineFAQs.length === 0 && frontmatterFAQs.length > 0;

  const sharePath = `/${v.slug}/${article.frontmatter.slug}/`;

  return (
    <Container width="content" className="pt-8 pb-16">
      <Breadcrumbs crumbs={crumbs} />
      <ArticleHeader article={article} />

      <ShareBar url={sharePath} title={article.frontmatter.title} />

      {/* Regulatory disclaimers render above the fold so readers see the
          "information, not advice" framing on arrival, not after the body.
          Affiliate disclosure stays adjacent for ASA/CAP proximity. */}
      {v.regulatoryDomain === 'finance' && (
        <FCADisclaimer equityRelease={v.slug === 'equity-release'} />
      )}
      {v.regulatoryDomain === 'health' && <MedicalDisclaimer />}
      {v.regulatoryDomain === 'legal' && <LegalDisclaimer />}
      {hasAffiliates && <AffiliateDisclosure />}

      <TableOfContents body={article.body} />

      <AdSlot position="in-article-1" />

      <MarkdownRenderer source={article.body} />

      {showPageLevelFAQ && <FAQ items={frontmatterFAQs} />}

      <AdSlot position="in-article-2" />

      <ShareBar
        url={sharePath}
        title={article.frontmatter.title}
        label="Found this useful? Share it"
      />

      <AuthorCard authorSlug={article.frontmatter.author} />
      <RelatedArticles articles={related} />

      <ArticleSchema article={article} />
      <FAQSchema items={allFAQs} />
      <HowToSchema frontmatter={article.frontmatter} />
      <ProductSchema frontmatter={article.frontmatter} />
      <BreadcrumbSchema items={schemaCrumbs} />
    </Container>
  );
}
