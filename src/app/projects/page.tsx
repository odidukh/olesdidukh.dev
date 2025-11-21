'use client';

import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { ProjectsSection } from '@/components/sections/ProjectsSection';

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <ProjectsSection />
      <Footer />
    </main>
  );
}
