import { HeroSection } from '@/components/sections/HeroSection';
import { Navigation } from '@/components/ui/Navigation';

export default function HeroPage() {
  return (
    <>
      <Navigation />
      <HeroSection />

      {/* Placeholder for next section - shows scroll works */}
      <div className="min-h-screen bg-muted/50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-4xl font-bold">Next Section</h2>
          <p className="text-muted-foreground">
            The hero scroll animations work! This would be your About section.
          </p>
        </div>
      </div>
    </>
  );
}
