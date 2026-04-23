export interface JsonLdProps {
  data: Record<string, unknown> | null;
}

/**
 * Tiny primitive: emits a <script type="application/ld+json"> with the
 * given schema object. All schema-specific components wrap this - do
 * not write your own script tag at a page level.
 */
export default function JsonLd({ data }: JsonLdProps) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
