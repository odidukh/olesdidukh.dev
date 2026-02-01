'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ProjectsErrorFallback } from '@/components/ui/SectionErrorFallback';
import { ProjectsSection } from './ProjectsSection';

/**
 * Client component wrapper for ProjectsSection with ErrorBoundary.
 * This wrapper is needed because ErrorBoundary's fallbackRender prop
 * is a function, which cannot be passed from Server to Client Components.
 */
export function ProjectsSectionWithErrorBoundary() {
  return (
    <ErrorBoundary
      sectionName="Projects"
      fallbackRender={ProjectsErrorFallback}
    >
      <ProjectsSection />
    </ErrorBoundary>
  );
}
