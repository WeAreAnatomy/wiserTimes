import { notFound } from 'next/navigation';
import { siteConfig, verticalsList } from '@/lib/config';
import {
  getArticleBySlug,
  getSpokesForVertical,
  getRelatedArticles,
} from '@/lib/content';
import type { Vertical } from '@/lib/types';
import Container from '@/components/layout/Container';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import ArticleHeader from '@/components/content/ArticleHeader';
import TableOfContents from '@/components/content/TableOfContents';
import AuthorCard from '@/components/content/AuthorCard';
import RelatedArticles from '@/components/content/RelatedArticles';
import MarkdownRenderer from '@/components/content/MarkdownRenderer';
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
    for (const s of getSpokesForVertical(v.slug)) {
      params.push({ vertical: v.slug, slug: s.frontmatter.slug });
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

  return (
    <Container width="content" className="pt-8 pb-16">
      <Breadcrumbs crumbs={crumbs} />
      <ArticleHeader article={article} />
      <TableOfContents body={article.body} />
      {hasAffiliates && <AffiliateDisclosure />}

      <AdSlot position="in-article-1" />

      <MarkdownRenderer source={article.body} />

      {article.frontmatter.faqs && article.frontmatter.faqs.length > 0 && (
        <FAQ items={article.frontmatter.faqs} />
      )}

      <AdSlot position="in-article-2" />

      {v.regulatoryDomain === 'finance' && (
        <FCADisclaimer equityRelease={v.slug === 'equity-release'} />
      )}
      {v.regulatoryDomain === 'health' && <MedicalDisclaimer />}
      {v.regulatoryDomain === 'legal' && <LegalDisclaimer />}

      <AuthorCard authorSlug={article.frontmatter.author} />
      <RelatedArticles articles={related} />

      <ArticleSchema article={article} />
      <FAQSchema frontmatter={article.frontmatter} />
      <HowToSchema frontmatter={article.frontmatter} />
      <ProductSchema frontmatter={article.frontmatter} />
      <BreadcrumbSchema items={schemaCrumbs} />
    </Container>
  );
}
