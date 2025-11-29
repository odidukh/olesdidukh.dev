import {
  generateBreadcrumbSchema,
  breadcrumbConfigs,
  getProjectBreadcrumbs,
} from '@/lib/breadcrumbs';
import { JsonLd } from '@/components/JsonLd';

interface BreadcrumbSchemaProps {
  page: keyof typeof breadcrumbConfigs;
  projectTitle?: string;
  projectSlug?: string;
}

/**
 * Component that renders BreadcrumbList structured data for a given page
 * For project detail pages, pass projectTitle and projectSlug to generate dynamic breadcrumbs
 */
export function BreadcrumbSchema({
  page,
  projectTitle,
  projectSlug,
}: BreadcrumbSchemaProps) {
  // Use dynamic breadcrumbs for project detail pages
  const breadcrumbs =
    page === 'projects' && projectTitle && projectSlug
      ? getProjectBreadcrumbs(projectTitle, projectSlug)
      : breadcrumbConfigs[page];

  const schema = generateBreadcrumbSchema(breadcrumbs);

  return <JsonLd data={schema} />;
}
