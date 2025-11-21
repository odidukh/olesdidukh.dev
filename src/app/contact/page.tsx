import { ContactSection } from '@/components/sections/ContactSection';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
