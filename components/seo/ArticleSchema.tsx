import type { Article } from '@/lib/types';
import { buildArticleSchema } from '@/lib/seo';
import JsonLd from './JsonLd';

export default function ArticleSchema({ article }: { article: Article }) {
  return <JsonLd data={buildArticleSchema(article)} />;
}
