import { HeroSimple } from '@/components/sections/HeroSimple';
import { AboutSection } from '@/components/sections/AboutSection';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <Navigation />
      <HeroSimple />
      <AboutSection />

      {/* Quick Links for Development */}
      <section className="py-20 bg-muted/50">
        <Container size="lg" padding="lg">
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold">Development Showcase</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Explore all the components and sections built for this portfolio
            </p>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-8">
              <Button variant="outline" asChild>
                <Link href="/hero">Full Hero Demo</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/about">About Page</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/components">Components</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/layout-demo">Layouts</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/design-system">Design System</Link>
              </Button>
            </div>
          </div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
