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
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SocialProofBar } from '@/components/sections/SocialProofBar';

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
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <SocialProofBar />

        {/* About Section - Using Redesigned Component */}
        <AboutSection />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Featured Journey Teaser */}
        <JourneySection />

        {/* Skills & Expertise Teaser */}
        <SkillsPreviewSection />

        {/* Philosophy Teaser */}
        <PhilosophySection />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Projects Section */}
        <ErrorBoundary
          sectionName="Projects"
          fallbackRender={BlogErrorFallback}
        >
          <ProjectsSection />
        </ErrorBoundary>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Blog Section */}
        <ErrorBoundary sectionName="Blog" fallbackRender={BlogErrorFallback}>
          <BlogSection />
        </ErrorBoundary>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

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
