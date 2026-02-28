import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { Container } from '@/components/ui/Container';

export default function ProjectsPage() {
  return (
    <main id="main-content" className="min-h-screen bg-background">
      <BreadcrumbSchema page="projects" />
      <Navigation />
      <div className="pt-24">
        <Container size="wide" padding="lg">
          <Breadcrumb items={[{ label: 'Projects' }]} />
        </Container>
      </div>
      <ProjectsSection />
      <Footer />
    </main>
  );
}
