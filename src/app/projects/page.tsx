import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { ProjectsErrorFallback } from '@/components/ui/SectionErrorFallback';

export default function ProjectsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <BreadcrumbSchema page="projects" />
      <Navigation />
      <ErrorBoundary
        sectionName="Projects"
        fallbackRender={ProjectsErrorFallback}
      >
        <ProjectsSection />
      </ErrorBoundary>
      <Footer />
    </main>
  );
}
