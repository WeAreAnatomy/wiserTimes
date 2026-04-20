import { buildBreadcrumbSchema } from '@/lib/seo';
import type { BreadcrumbItem } from '@/lib/seo';
import JsonLd from './JsonLd';

export default function BreadcrumbSchema({ items }: { items: BreadcrumbItem[] }) {
  return <JsonLd data={buildBreadcrumbSchema(items)} />;
}
