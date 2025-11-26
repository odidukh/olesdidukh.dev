import { AboutSection } from '@/components/sections/AboutSection';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';

export default function AboutPage() {
  return (
    <>
      <BreadcrumbSchema page="about" />
      <Navigation />
      <main className="pt-20">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
