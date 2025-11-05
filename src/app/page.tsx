'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import {
  Download,
  Mail,
  Github,
  Trash2,
  Heart,
  Settings,
  Plus,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const handleLoadingDemo = (key: string) => {
    setLoading(prev => ({ ...prev, [key]: true }));
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [key]: false }));
    }, 2000);
  };

  return (
    <main className="min-h-screen p-8 md:p-24">
      {/* Navigation */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="flex gap-4 p-4 bg-muted rounded-lg">
          <Button variant="secondary" size="sm" asChild>
            <Link href="/">Button Components</Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/layout-demo">Layout Components</Link>
          </Button>
          <Button variant="secondary" size="sm" asChild>
            <Link href="/design-system">Design System</Link>
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Button Component Showcase
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Production-ready button component with 8 variants, 5 sizes, loading
            states, and full accessibility support.
          </p>
        </div>

        {/* All Variants Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">All Variants</h2>
            <p className="text-muted-foreground">
              Eight carefully designed variants for different use cases
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="default">Default</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Button variant="gradient">Gradient</Button>
            <Button variant="glow">Glow</Button>
          </div>
        </section>

        {/* All Sizes Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">All Sizes</h2>
            <p className="text-muted-foreground">
              Five size variants to fit different contexts
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
            <Button size="xl">Extra Large</Button>
            <Button size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* With Icons Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">With Icons</h2>
            <p className="text-muted-foreground">
              Buttons combined with Lucide icons for enhanced clarity
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download CV
            </Button>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Contact Me
            </Button>
            <Button variant="secondary">
              <Github className="mr-2 h-4 w-4" />
              View GitHub
            </Button>
            <Button variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Project
            </Button>
            <Button variant="ghost">
              <Heart className="mr-2 h-4 w-4" />
              Like
            </Button>
            <Button variant="link">
              <ExternalLink className="mr-2 h-4 w-4" />
              External Link
            </Button>
          </div>
        </section>

        {/* Loading States Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Loading States</h2>
            <p className="text-muted-foreground">
              Built-in loading spinner with accessible announcements
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <Button
              loading={loading['default'] ?? false}
              onClick={() => handleLoadingDemo('default')}
            >
              {loading['default'] ? 'Saving...' : 'Save Changes'}
            </Button>

            <Button
              variant="outline"
              loading={loading['outline'] ?? false}
              onClick={() => handleLoadingDemo('outline')}
            >
              {loading['outline'] ? 'Loading...' : 'Load Data'}
            </Button>

            <Button
              variant="destructive"
              loading={loading['destructive'] ?? false}
              onClick={() => handleLoadingDemo('destructive')}
              loadingText="Deleting..."
            >
              Delete Forever
            </Button>

            <Button
              variant="gradient"
              loading={loading['gradient'] ?? false}
              onClick={() => handleLoadingDemo('gradient')}
            >
              {loading['gradient'] ? 'Processing...' : 'Submit Form'}
            </Button>
          </div>
        </section>

        {/* Disabled States Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Disabled States</h2>
            <p className="text-muted-foreground">
              Proper disabled styling with pointer events disabled
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button disabled>Default</Button>
            <Button variant="destructive" disabled>
              Destructive
            </Button>
            <Button variant="outline" disabled>
              Outline
            </Button>
            <Button variant="secondary" disabled>
              Secondary
            </Button>
          </div>
        </section>

        {/* Real-World Examples Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Real-World Usage</h2>
            <p className="text-muted-foreground">
              Common button combinations in professional applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Hero CTA */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="text-xl font-semibold">Hero Call-to-Action</h3>
              <div className="space-y-3">
                <Button variant="gradient" size="lg" className="w-full">
                  <Download className="mr-2 h-5 w-5" />
                  Download Portfolio
                </Button>
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1">
                    View Projects
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Mail className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="text-xl font-semibold">Form Actions</h3>
              <div className="space-y-3">
                <Button
                  variant="default"
                  className="w-full"
                  loading={loading['form'] ?? false}
                  onClick={() => handleLoadingDemo('form')}
                >
                  {loading['form'] ? 'Submitting...' : 'Submit Application'}
                </Button>
                <div className="flex gap-3">
                  <Button variant="ghost" className="flex-1">
                    Cancel
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Save Draft
                  </Button>
                </div>
              </div>
            </div>

            {/* Toolbar Actions */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="text-xl font-semibold">Toolbar Actions</h3>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="ghost">
                  <Heart className="h-4 w-4" />
                </Button>
                <div className="flex-1" />
                <Button size="sm" variant="destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Social Actions */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="text-xl font-semibold">Social Links</h3>
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full justify-start">
                  <Github className="mr-2 h-4 w-4" />
                  github.com/yourusername
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  your.email@example.com
                </Button>
                <Button variant="link" className="justify-start px-0">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View LinkedIn Profile
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AsChild Pattern Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">AsChild Pattern</h2>
            <p className="text-muted-foreground">
              Render buttons as links or other elements while maintaining
              styling
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild variant="outline">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-2 h-4 w-4" />
                Visit GitHub
              </a>
            </Button>

            <Button asChild variant="default">
              <a href="mailto:your.email@example.com">
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </a>
            </Button>

            <Button asChild variant="secondary">
              <a href="/projects">View Projects</a>
            </Button>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <code className="text-sm">
              {`<Button asChild variant="outline">\n  <a href="...">Link Button</a>\n</Button>`}
            </code>
          </div>
        </section>

        {/* Technical Highlights Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">Technical Highlights</h2>
            <p className="text-muted-foreground">
              What makes this button component production-ready
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold">✅ Type Safety</h3>
              <p className="text-sm text-muted-foreground">
                Full TypeScript support with proper generics and inferred types
              </p>
            </div>

            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold">✅ Accessibility</h3>
              <p className="text-sm text-muted-foreground">
                ARIA attributes, keyboard navigation, and screen reader support
              </p>
            </div>

            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold">✅ Performance</h3>
              <p className="text-sm text-muted-foreground">
                Class Variance Authority for optimal CSS, minimal re-renders
              </p>
            </div>

            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold">✅ Flexibility</h3>
              <p className="text-sm text-muted-foreground">
                AsChild pattern for composition, forwarded refs support
              </p>
            </div>

            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold">✅ DX</h3>
              <p className="text-sm text-muted-foreground">
                Perfect IntelliSense, clear documentation, consistent API
              </p>
            </div>

            <div className="p-6 border rounded-lg space-y-2">
              <h3 className="font-semibold">✅ Customizable</h3>
              <p className="text-sm text-muted-foreground">
                Easy to extend with new variants, supports className overrides
              </p>
            </div>
          </div>
        </section>
        {/* Keyboard Navigation Section */}
        <section className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">
              Keyboard Navigation & Accessibility
            </h2>
            <p className="text-muted-foreground">
              Full keyboard support and WCAG 2.1 AA compliance
            </p>
          </div>

          <div className="p-6 border rounded-lg space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Try Keyboard Navigation:</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Button 1</Button>
                <Button variant="outline">Button 2</Button>
                <Button variant="secondary">Button 3</Button>
                <Button variant="ghost">Button 4</Button>
                <Button disabled>Button 5 (Disabled)</Button>
              </div>
              <p className="text-sm text-muted-foreground mt-4">
                Press{' '}
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Tab</kbd> to
                navigate,
                <kbd className="px-2 py-1 bg-muted rounded text-xs ml-2">
                  Enter
                </kbd>{' '}
                or
                <kbd className="px-2 py-1 bg-muted rounded text-xs ml-2">
                  Space
                </kbd>{' '}
                to activate
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Accessibility Features:</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>Focus-visible ring:</strong> Clear visual indicator
                    for keyboard navigation
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>ARIA attributes:</strong> aria-disabled,
                    aria-describedby for loading states
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>Screen reader support:</strong> Hidden text
                    announces loading states
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>Disabled state handling:</strong> Proper
                    pointer-events and opacity
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>Semantic HTML:</strong> Uses button vs link
                    appropriately with asChild
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">✓</span>
                  <span>
                    <strong>Color contrast:</strong> WCAG AA compliant text and
                    background ratios
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Code Quality Section */}
        <section className="space-y-6 mb-16">
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold">
              Code Quality & Best Practices
            </h2>
            <p className="text-muted-foreground">
              Professional development standards demonstrated
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Component Architecture</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Separation of concerns (variants, logic, rendering)</li>
                <li>• Composable with React.forwardRef</li>
                <li>• Extensible variant system with CVA</li>
                <li>• Clean prop interface design</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Developer Experience</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• IntelliSense autocompletion for all props</li>
                <li>• Type-safe variant selection</li>
                <li>• Self-documenting prop names</li>
                <li>• Predictable API design</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">
                Performance Optimizations
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Minimal bundle size with tree-shaking</li>
                <li>• Optimized CSS with Tailwind merge</li>
                <li>• No unnecessary re-renders</li>
                <li>• Lazy-loaded icons from Lucide</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">Testing & Maintenance</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Strict TypeScript catches bugs early</li>
                <li>• Testable with React Testing Library</li>
                <li>• Maintainable variant system</li>
                <li>• Easy to extend with new variants</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
