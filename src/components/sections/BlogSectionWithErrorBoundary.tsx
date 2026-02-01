'use client';

import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { BlogErrorFallback } from '@/components/ui/SectionErrorFallback';
import { BlogSection } from './BlogSection';

/**
 * Client component wrapper for BlogSection with ErrorBoundary.
 * This wrapper is needed because ErrorBoundary's fallbackRender prop
 * is a function, which cannot be passed from Server to Client Components.
 */
export function BlogSectionWithErrorBoundary() {
  return (
    <ErrorBoundary sectionName="Blog" fallbackRender={BlogErrorFallback}>
      <BlogSection />
    </ErrorBoundary>
  );
}
