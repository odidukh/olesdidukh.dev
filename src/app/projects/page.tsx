import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { ProjectsSection } from '@/components/sections/ProjectsSection';

export default function ProjectsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <BreadcrumbSchema page="projects" />
      <Navigation />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
