/**
 * A reusable component for rendering JSON-LD structured data.
 * Centralizes the pattern of using dangerouslySetInnerHTML for script tags.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
  /** CSP nonce for inline script security */
  nonce?: string | undefined;
}

export function JsonLd({ data, nonce }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
