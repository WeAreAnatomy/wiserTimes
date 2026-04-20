import Link from 'next/link';
import type { Article } from '@/lib/types';
import { articleUrl } from '@/lib/content';

export interface RelatedArticlesProps {
  articles: Article[];
  title?: string;
}

export default function RelatedArticles({ articles, title = 'Related guides' }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null;
  return (
    <section className="my-10" aria-labelledby="related-heading">
      <h2 id="related-heading" className="font-sans text-2xl font-semibold text-brand-ink">
        {title}
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-2">
        {articles.map((a) => (
          <li key={a.frontmatter.slug}>
            <Link
              href={articleUrl(a.frontmatter)}
              className="block rounded-lg border border-brand-border bg-white p-4 transition hover:border-brand-teal hover:bg-brand-cream focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
            >
              <p className="font-sans text-lg font-semibold text-brand-ink">
                {a.frontmatter.title}
              </p>
              <p className="mt-1 text-base text-brand-muted">{a.frontmatter.description}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
