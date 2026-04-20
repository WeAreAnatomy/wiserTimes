import type { ArticleFrontmatter } from '@/lib/types';
import { buildFAQSchema } from '@/lib/seo';
import JsonLd from './JsonLd';

export default function FAQSchema({ frontmatter }: { frontmatter: ArticleFrontmatter }) {
  return <JsonLd data={buildFAQSchema(frontmatter)} />;
}
