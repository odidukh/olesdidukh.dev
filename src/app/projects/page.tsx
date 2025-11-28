'use client';

import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

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
