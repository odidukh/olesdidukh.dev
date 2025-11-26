import { generateBreadcrumbSchema, breadcrumbConfigs } from '@/lib/breadcrumbs';

interface BreadcrumbSchemaProps {
  page: keyof typeof breadcrumbConfigs;
}

/**
 * Component that renders BreadcrumbList structured data for a given page
 */
export function BreadcrumbSchema({ page }: BreadcrumbSchemaProps) {
  const breadcrumbs = breadcrumbConfigs[page];
  const schema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
