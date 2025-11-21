import { BlogSection } from '@/components/sections/BlogSection';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';

export default function BlogPage() {
  return (
    <>
      <Navigation />
      <main className="pt-20">
        <BlogSection />
      </main>
      <Footer />
    </>
  );
}
