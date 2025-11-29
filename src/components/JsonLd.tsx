/**
 * A reusable component for rendering JSON-LD structured data.
 * Centralizes the pattern of using dangerouslySetInnerHTML for script tags.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
