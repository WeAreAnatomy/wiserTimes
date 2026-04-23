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
 * NOTE: we don't use @tailwindcss/typography - we control typography
 * ourselves so the 18px accessibility floor and brand serif are consistent.
 *
 * SCALABILITY: every selector here is a `[&_X]` arbitrary descendant rule
 * so any HTML produced by the markdown pipeline (or pasted into a page)
 * is styled by composing this single wrapper. Add new element rules HERE,
 * not at callsites.
 */
export default function Prose({ children, className = '' }: ProseProps) {
  return (
    <div
      className={[
        // Base typography
        'font-serif text-brand-ink',
        'text-lg leading-relaxed',
        // Long-word handling so URLs / German-style compounds never overflow
        'break-words [&_*]:max-w-full',
        // Headings (anchor IDs are emitted by lib/markdown so deep links work)
        '[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:font-sans [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:text-brand-ink [&_h2]:scroll-mt-24',
        '[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-brand-ink [&_h3]:scroll-mt-24',
        '[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:font-sans [&_h4]:text-lg [&_h4]:font-semibold',
        // Paragraphs
        '[&_p]:mt-4 [&_p]:mb-4',
        // Strong / emphasis
        '[&_strong]:font-semibold [&_strong]:text-brand-ink',
        // Links
        '[&_a]:text-brand-teal [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-brand-deep',
        // Lists
        '[&_ul]:mt-4 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul_li]:mt-2',
        '[&_ol]:mt-4 [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol_li]:mt-2',
        // Tables - wrapped in an overflow container so they never break the page on mobile.
        // Authors don't need to think about this; just write a normal markdown table.
        '[&_table]:my-6 [&_table]:w-full [&_table]:border-collapse [&_table]:text-base [&_table]:block sm:[&_table]:table [&_table]:overflow-x-auto',
        '[&_th]:border [&_th]:border-brand-border [&_th]:bg-brand-sand [&_th]:px-3 [&_th]:py-2 [&_th]:text-left',
        '[&_td]:border [&_td]:border-brand-border [&_td]:px-3 [&_td]:py-2',
        // Blockquote
        '[&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-brand-teal [&_blockquote]:bg-brand-sand/50 [&_blockquote]:px-5 [&_blockquote]:py-3 [&_blockquote]:italic',
        // Inline code
        '[&_code]:rounded [&_code]:bg-brand-sand [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-base',
        // Code BLOCKS - without this, fenced code overflows the column and the
        // entire viewport scrolls horizontally on mobile. Constrain + scroll-x.
        '[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-brand-ink [&_pre]:p-4 [&_pre]:text-base [&_pre]:text-brand-cream',
        '[&_pre_code]:bg-transparent [&_pre_code]:px-0 [&_pre_code]:py-0 [&_pre_code]:text-brand-cream',
        // Images & figures - the responsive defaults every author expects.
        '[&_img]:my-6 [&_img]:h-auto [&_img]:w-auto [&_img]:max-w-full [&_img]:rounded-lg',
        '[&_figure]:my-6',
        '[&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-base [&_figcaption]:text-brand-muted',
        // Horizontal rule
        '[&_hr]:my-10 [&_hr]:border-brand-border',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}
