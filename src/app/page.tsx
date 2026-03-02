import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  ProjectsErrorFallback,
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
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { SocialProofBar } from '@/components/sections/SocialProofBar';

export default function HomePage() {
  return (
    <>
      <Navigation />

      <main id="main-content">
        {/* Hero — first impression */}
        <HeroSectionClient />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Social proof — immediate credibility */}
        <SocialProofBar />

        {/* About — who you are */}
        <AboutSection />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Projects — your best work (what recruiters want to see) */}
        <ErrorBoundary
          sectionName="Projects"
          fallbackRender={ProjectsErrorFallback}
        >
          <ProjectsSection />
        </ErrorBoundary>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Skills — technical breadth */}
        <SkillsPreviewSection />

        {/* Journey — career progression */}
        <JourneySection />
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Blog — thought leadership */}
        <ErrorBoundary sectionName="Blog" fallbackRender={BlogErrorFallback}>
          <BlogSection />
        </ErrorBoundary>
        <div className="h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        {/* Contact — call to action */}
        <ErrorBoundary
          sectionName="Contact"
          fallbackRender={ContactErrorFallback}
        >
          <ContactSection />
        </ErrorBoundary>

        {/* Final CTA */}
        <CtaSectionClient />
      </main>

      <Footer />
    </>
  );
}
