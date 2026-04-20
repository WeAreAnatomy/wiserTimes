import type { ReactNode } from 'react';

export interface ProseProps {
  children: ReactNode;
  className?: string;
}

/**
 * Applies the site's reading typography to arbitrary children. Use this
 * whenever you render HTML/markdown output (articles, policy pages, etc.)
 * instead of re-declaring heading/paragraph styles.
 *
 * NOTE: we don't use @tailwindcss/typography — we control typography
 * ourselves so the 18px accessibility floor and brand serif are consistent.
 */
export default function Prose({ children, className = '' }: ProseProps) {
  return (
    <div
      className={[
        'font-serif text-brand-ink',
        'text-lg leading-relaxed',
        // Headings
        '[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-brand-ink',
        '[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-brand-ink',
        '[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:font-sans [&_h4]:text-lg [&_h4]:font-semibold',
        // Paragraphs
        '[&_p]:mt-4 [&_p]:mb-4',
        // Links
        '[&_a]:text-brand-teal [&_a]:underline hover:[&_a]:text-brand-deep',
        // Lists
        '[&_ul]:mt-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mt-2',
        '[&_ol]:mt-4 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mt-2',
        // Tables
        '[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-base',
        '[&_th]:border [&_th]:border-brand-border [&_th]:bg-brand-sand [&_th]:px-3 [&_th]:py-2 [&_th]:text-left',
        '[&_td]:border [&_td]:border-brand-border [&_td]:px-3 [&_td]:py-2',
        // Blockquote
        '[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-teal [&_blockquote]:bg-brand-sand/50 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:italic',
        // Code
        '[&_code]:rounded [&_code]:bg-brand-sand [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-base',
        // HR
        '[&_hr]:my-10 [&_hr]:border-brand-border',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
