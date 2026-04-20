import type { ReactNode } from 'react';

export interface ExpertQuoteProps {
  author?: string;
  role?: string;
  /** Framed as editorial opinion, not testimonial (ASA/CAP §10.3). */
  children: ReactNode;
}

export default function ExpertQuote({ author, role, children }: ExpertQuoteProps) {
  return (
    <figure className="my-8 rounded-lg border-l-4 border-brand-teal bg-brand-sand/60 p-5 sm:p-6">
      <p className="mb-2 text-sm uppercase tracking-wide text-brand-muted">
        Editorial note
      </p>
      <blockquote className="font-serif text-xl leading-snug text-brand-ink">
        “{children}”
      </blockquote>
      {(author || role) && (
        <figcaption className="mt-3 text-base text-brand-muted">
          {author && <span className="font-semibold text-brand-ink">{author}</span>}
          {author && role && ', '}
          {role}
        </figcaption>
      )}
    </figure>
  );
}
