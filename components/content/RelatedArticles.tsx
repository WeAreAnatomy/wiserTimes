import Link from 'next/link';
import { Home, Accessibility, Flower2, Laptop2, HandHeart, ScrollText, BookOpen, ArrowRight } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Article } from '@/lib/types';
import { articleUrl } from '@/lib/content';

export interface RelatedArticlesProps {
  articles: Article[];
  title?: string;
}

const verticalIcons: Record<string, LucideIcon> = {
  'equity-release': Home,
  'mobility-aids': Accessibility,
  'funeral-planning': Flower2,
  'tech-guides': Laptop2,
  benefits: HandHeart,
  'wills-poa': ScrollText,
};

const verticalColors: Record<string, string> = {
  'equity-release': 'bg-emerald-50 text-emerald-700',
  'mobility-aids': 'bg-sky-50 text-sky-700',
  'funeral-planning': 'bg-violet-50 text-violet-700',
  'tech-guides': 'bg-amber-50 text-amber-700',
  benefits: 'bg-rose-50 text-rose-700',
  'wills-poa': 'bg-indigo-50 text-indigo-700',
};

export default function RelatedArticles({ articles, title = 'Related guides' }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;
  return (
    <section className="my-10" aria-labelledby="related-heading">
      <h2 id="related-heading" className="flex items-center gap-2.5 font-sans text-2xl font-semibold text-brand-ink">
        <BookOpen size={22} className="text-brand-teal" aria-hidden="true" />
        {title}
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {articles.map((a) => {
          const vertical = a.frontmatter.vertical;
          const Icon = verticalIcons[vertical] ?? BookOpen;
          const colorClass = verticalColors[vertical] ?? 'bg-brand-sand text-brand-ink';
          return (
            <li key={a.frontmatter.slug}>
              <Link
                href={articleUrl(a.frontmatter)}
                className="group flex gap-4 rounded-lg border border-brand-border bg-white p-4 transition hover:border-brand-teal hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              >
                <span
                  aria-hidden="true"
                  className={`flex h-12 w-12 flex-none items-center justify-center rounded-lg ${colorClass}`}
                >
                  <Icon size={22} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-sans text-lg font-semibold text-brand-ink group-hover:text-brand-teal">
                    {a.frontmatter.title}
                  </span>
                  <span className="mt-0.5 block text-base text-brand-muted line-clamp-2">
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
  );
}
