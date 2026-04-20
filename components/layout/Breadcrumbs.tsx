import Link from 'next/link';

export interface BreadcrumbCrumb {
  label: string;
  href?: string; // missing href = current page
}

export interface BreadcrumbsProps {
  crumbs: BreadcrumbCrumb[];
}

/**
 * Visible breadcrumb trail. Pair with <BreadcrumbSchema /> for structured data.
 * Do not construct breadcrumb markup inline on pages.
 */
export default function Breadcrumbs({ crumbs }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="text-base text-brand-muted">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        {crumbs.map((c, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-2">
              {c.href && !isLast ? (
                <Link href={c.href} className="hover:text-brand-teal hover:underline">
                  {c.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-brand-ink">
                  {c.label}
                </span>
              )}
              {!isLast && <span aria-hidden="true">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
