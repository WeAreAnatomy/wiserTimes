import { authors } from '@/lib/authors';

export interface AuthorCardProps {
  authorSlug: string;
  variant?: 'inline' | 'full';
}

/**
 * Author attribution for E-E-A-T signals (brief §3.2). Resolves the slug
 * against lib/authors.ts - do not pass author name strings directly.
 */
export default function AuthorCard({ authorSlug, variant = 'full' }: AuthorCardProps) {
  const author = authors[authorSlug] ?? authors.editorial;

  if (variant === 'inline') {
    return (
      <p className="text-base text-brand-muted">
        By <span className="font-semibold text-brand-ink">{author.name}</span> -{' '}
        {author.credentials}
      </p>
    );
  }

  return (
    <section className="my-8 rounded-lg border border-brand-border bg-white p-5 sm:p-6">
      <p className="text-sm uppercase tracking-wide text-brand-muted">About the author</p>
      <p className="mt-1 font-sans text-xl font-semibold text-brand-ink">{author.name}</p>
      <p className="mt-1 text-base text-brand-muted">{author.credentials}</p>
      <p className="mt-3 text-lg text-brand-ink">{author.bio}</p>
      <p className="mt-2 text-base text-brand-muted">
        <span className="font-semibold text-brand-ink">Focus areas:</span> {author.experience}
      </p>
    </section>
  );
}
