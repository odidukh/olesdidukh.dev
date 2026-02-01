import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { ProjectsSectionWithErrorBoundary } from '@/components/sections/ProjectsSectionWithErrorBoundary';

export default function ProjectsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <BreadcrumbSchema page="projects" />
      <Navigation />
      <ProjectsSectionWithErrorBoundary />
      <Footer />
    </main>
  );
}
