import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ProjectsErrorFallback } from '@/components/ui/SectionErrorFallback';
import { ProjectsSectionClient } from './ProjectsSectionClient';
import { projectsData } from '@/data/projects';
import { getFallbackImageBlur } from '@/lib/images';

/**
 * Client component wrapper for ProjectsSection with ErrorBoundary.
 * This wrapper is needed because ErrorBoundary's fallbackRender prop
 * is a function, which cannot be passed from Server to Client Components.
 */
export async function ProjectsSection() {
  const projectsWithBlur = await Promise.all(
    projectsData.map(async project => {
      const blurDataURL = await getFallbackImageBlur(project.image);
      return { ...project, blurDataURL };
    })
  );

  return (
    <ErrorBoundary
      sectionName="Projects"
      fallbackRender={ProjectsErrorFallback}
    >
      <ProjectsSectionClient initialProjects={projectsWithBlur} />
    </ErrorBoundary>
  );
}
