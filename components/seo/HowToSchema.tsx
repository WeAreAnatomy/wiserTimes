import type { ArticleFrontmatter } from '@/lib/types';
import { buildHowToSchema } from '@/lib/seo';
import JsonLd from './JsonLd';

export default function HowToSchema({ frontmatter }: { frontmatter: ArticleFrontmatter }) {
  return <JsonLd data={buildHowToSchema(frontmatter)} />;
}
