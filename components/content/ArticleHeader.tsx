import Link from 'next/link';
import type { Article } from '@/lib/types';
import { siteConfig } from '@/lib/config';
import LastUpdated from './LastUpdated';
import AuthorCard from './AuthorCard';

export interface ArticleHeaderProps {
  article: Article;
}

/**
 * Header block shown at the top of every pillar and spoke article.
 * Composes LastUpdated + inline AuthorCard — do not rebuild the trio.
 */
export default function ArticleHeader({ article }: ArticleHeaderProps) {
  const fm = article.frontmatter;
  const vertical = siteConfig.verticals[fm.vertical];
  return (
    <header className="mb-6">
      <p className="text-base font-sans font-semibold uppercase tracking-wide text-brand-teal">
        <Link href={`/${vertical.slug}/`} className="hover:underline">
          {vertical.label}
        </Link>
      </p>
      <h1 className="mt-2 font-serif text-3xl font-semibold text-brand-ink sm:text-4xl">
        {fm.title}
      </h1>
      <p className="mt-3 max-w-prose text-xl text-brand-muted">{fm.description}</p>
      <div className="mt-4 flex flex-col gap-2">
        <AuthorCard authorSlug={fm.author} variant="inline" />
        <LastUpdated
          published={fm.published}
          lastReviewed={fm.lastReviewed}
          readingTimeMinutes={article.readingTimeMinutes}
        />
      </div>
    </header>
  );
}
