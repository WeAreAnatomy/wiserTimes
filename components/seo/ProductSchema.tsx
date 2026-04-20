import type { ArticleFrontmatter } from '@/lib/types';
import { buildProductSchema } from '@/lib/seo';
import JsonLd from './JsonLd';

export default function ProductSchema({ frontmatter }: { frontmatter: ArticleFrontmatter }) {
  return <JsonLd data={buildProductSchema(frontmatter)} />;
}
