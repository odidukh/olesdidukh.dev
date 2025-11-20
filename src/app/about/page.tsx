import { AboutSection } from '@/sections/AboutSection';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <AboutSection />
      </main>
      <Footer />
    </>
  );
}
