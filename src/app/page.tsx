import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  BlogErrorFallback,
  ContactErrorFallback,
} from '@/components/ui/SectionErrorFallback';
import { BlogSection } from '@/components/sections/BlogSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { HeroSectionClient } from '@/components/sections/HeroSectionClient';
import { CtaSectionClient } from '@/components/sections/CtaSectionClient';
import { AboutSection } from '@/components/sections/AboutSection';
import { JourneySection } from '@/components/sections/JourneySection';
import { SkillsPreviewSection } from '@/components/sections/SkillsPreviewSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';

// Lazy load below-the-fold heavy components (Only needed for Client components, Server components are fine natively)
// We import Server components directly instead of dynamic because Next.js handles Server Component splitting.

export default function HomePage() {
  return (
    <>
      {/* Main Navigation */}
      <Navigation />

      <main id="main-content">
        {/* Hero Section Client */}
        <HeroSectionClient />

        {/* About Section - Using Redesigned Component */}
        <AboutSection />

        {/* Featured Journey Teaser */}
        <JourneySection />

        {/* Skills & Expertise Teaser */}
        <SkillsPreviewSection />

        {/* Philosophy Teaser */}
        <PhilosophySection />

        {/* Projects Section */}
        {/* <ErrorBoundary
          sectionName="Projects"
          fallbackRender={ProjectsErrorFallback}
        >
          <ProjectsSection />
        </ErrorBoundary> */}

        {/* Blog Section */}
        <ErrorBoundary sectionName="Blog" fallbackRender={BlogErrorFallback}>
          <BlogSection />
        </ErrorBoundary>

        {/* Contact Section */}
        <ErrorBoundary
          sectionName="Contact"
          fallbackRender={ContactErrorFallback}
        >
          <ContactSection />
        </ErrorBoundary>

        {/* Final CTA Section */}
        <CtaSectionClient />
      </main>

      <Footer />
    </>
  );
}
