/**
 * Accessibility: the brief requires WCAG 2.1 AA. A skip-to-content link
 * is the simplest, highest-impact win for keyboard and screen reader users.
 * Rendered in the root layout once - not per page.
 */
export default function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-brand-teal focus:px-4 focus:py-2 focus:text-white"
    >
      Skip to main content
    </a>
  );
}
