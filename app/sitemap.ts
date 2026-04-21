import type { MetadataRoute } from 'next';
import { siteConfig, verticalsList } from '@/lib/config';
import { getAllArticles } from '@/lib/content';

// Regenerate the sitemap once a day. Google doesn't crawl sitemaps more
// frequently than this for a content site, and revalidation only triggers
// when the sitemap is actually requested -- not on a fixed clock.
export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, '');
  const now = new Date();

  const staticRoutes = [
    '',
    '/privacy',
    '/cookies',
    '/terms',
    '/accessibility',
    '/editorial-standards',
  ].map((path) => ({
    url: `${base}${path}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: path === '' ? 1.0 : 0.4,
  }));

  const verticalRoutes = verticalsList.map((v) => ({
    url: `${base}/${v.slug}/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));

  const articleRoutes = getAllArticles().map((a) => ({
    url: `${base}/${a.frontmatter.vertical}/${a.frontmatter.slug}/`,
    lastModified: new Date(a.frontmatter.lastReviewed),
    changeFrequency: 'monthly' as const,
    priority: a.frontmatter.contentType === 'pillar' ? 0.9 : 0.7,
  }));

  return [...staticRoutes, ...verticalRoutes, ...articleRoutes];
}
