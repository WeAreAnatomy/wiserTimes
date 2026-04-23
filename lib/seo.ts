import type { Article, ArticleFrontmatter, FAQItem } from './types';
import { siteConfig } from './config';
import { authors } from './authors';
import { articleUrl } from './content';

// Structured data builders. Components in components/seo/ render these as
// <script type="application/ld+json">. Keeping the JSON-LD construction
// here (and not in the components) makes it easy to unit-test and reuse
// across pillar and spoke templates.

export function buildArticleSchema(a: Article): Record<string, unknown> {
  const fm = a.frontmatter;
  const author = authors[fm.author] ?? authors.editorial;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: fm.title,
    description: fm.description,
    datePublished: fm.published,
    dateModified: fm.lastReviewed,
    author: {
      '@type': 'Person',
      name: author.name,
      description: author.credentials,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': siteConfig.url + articleUrl(fm),
    },
    keywords: fm.keywords?.join(', '),
  };
}

/**
 * Build FAQPage JSON-LD from any combination of frontmatter `faqs:` and
 * inline `:::faq` shortcodes. Google requires that the FAQ schema match
 * the visible FAQ on the page, so callers MUST pass the union of both
 * (use `extractInlineFAQs` from MarkdownRenderer to gather inline ones).
 */
export function buildFAQSchema(items: FAQItem[]): Record<string, unknown> | null {
  if (!items || items.length === 0) return null;
  const seen = new Set<string>();
  const unique = items.filter((f) => {
    const key = f.q.trim().toLowerCase();
    if (!f.q || !f.a || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (unique.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: unique.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

export function buildHowToSchema(fm: ArticleFrontmatter): Record<string, unknown> | null {
  if (!fm.howTo) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: fm.title,
    description: fm.description,
    totalTime: fm.howTo.totalTime,
    step: fm.howTo.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  };
}

export function buildProductSchema(fm: ArticleFrontmatter): Record<string, unknown> | null {
  if (!fm.product) return null;
  const p = fm.product;
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    brand: p.brand ? { '@type': 'Brand', name: p.brand } : undefined,
    offers:
      p.priceFrom !== undefined
        ? {
            '@type': 'AggregateOffer',
            priceCurrency: p.currency || 'GBP',
            lowPrice: p.priceFrom,
            highPrice: p.priceTo,
          }
        : undefined,
    aggregateRating:
      p.rating !== undefined
        ? {
            '@type': 'AggregateRating',
            ratingValue: p.rating,
            reviewCount: p.reviewCount,
          }
        : undefined,
  };
}

export function buildOrganizationSchema(): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    parentOrganization: {
      '@type': 'Organization',
      name: siteConfig.owner.legalName,
    },
  };
}
