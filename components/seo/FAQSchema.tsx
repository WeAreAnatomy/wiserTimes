import type { FAQItem } from '@/lib/types';
import { buildFAQSchema } from '@/lib/seo';
import JsonLd from './JsonLd';

export interface FAQSchemaProps {
  /**
   * Pass the UNION of frontmatter `faqs:` and inline `:::faq` shortcodes
   * (use `extractInlineFAQs(article.body)`). Google penalises mismatches
   * between visible FAQ and FAQ schema, so this must reflect the page.
   */
  items: FAQItem[];
}

export default function FAQSchema({ items }: FAQSchemaProps) {
  return <JsonLd data={buildFAQSchema(items)} />;
}
