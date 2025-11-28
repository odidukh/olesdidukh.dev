'use client';

import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';
import { Container } from './Container';
import type { FallbackProps } from './ErrorBoundary';

interface SectionErrorFallbackProps extends FallbackProps {
  title?: string;
  description?: string;
  showRetry?: boolean;
  minHeight?: string;
}

/**
 * Generic section error fallback with customizable content
 */
export function SectionErrorFallback({
  error,
  resetErrorBoundary,
  sectionName,
  title,
  description,
  showRetry = true,
  minHeight = 'min-h-[300px]',
}: SectionErrorFallbackProps) {
  return (
    <section className={`py-16 ${minHeight} flex items-center`}>
      <Container size="md">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 mb-6 text-muted-foreground/50">
            <AlertTriangle className="w-full h-full" />
          </div>

          <h3 className="text-xl font-semibold mb-2">
            {title || `Unable to load ${sectionName || 'this section'}`}
          </h3>

          <p className="text-muted-foreground mb-6 max-w-md">
            {description ||
              "We're having trouble loading this content. Please try again."}
          </p>

          {process.env.NODE_ENV === 'development' && error && (
            <details className="text-left mb-6 w-full max-w-lg">
              <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                Error details (development only)
              </summary>
              <pre className="mt-2 text-xs bg-muted p-3 rounded overflow-auto">
                {error.message}
                {error.stack && `\n\n${error.stack}`}
              </pre>
            </details>
          )}

          {showRetry && (
            <Button onClick={resetErrorBoundary} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}

/**
 * Projects section specific fallback
 */
export function ProjectsErrorFallback(props: FallbackProps) {
  return (
    <SectionErrorFallback
      {...props}
      title="Unable to load projects"
      description="We couldn't load the projects at this time. Please try again or check back later."
      minHeight="min-h-[400px]"
    />
  );
}

/**
 * Blog section specific fallback
 */
export function BlogErrorFallback(props: FallbackProps) {
  return (
    <SectionErrorFallback
      {...props}
      title="Unable to load blog posts"
      description="We couldn't load the blog posts at this time. Please try again or check back later."
      minHeight="min-h-[400px]"
    />
  );
}

/**
 * Contact section specific fallback
 */
export function ContactErrorFallback(props: FallbackProps) {
  return (
    <SectionErrorFallback
      {...props}
      title="Unable to load contact form"
      description="We couldn't load the contact form. Please try again or reach out via email directly."
      minHeight="min-h-[300px]"
    />
  );
}

/**
 * Testimonials section specific fallback
 */
export function TestimonialsErrorFallback(props: FallbackProps) {
  return (
    <SectionErrorFallback
      {...props}
      title="Unable to load testimonials"
      description="We couldn't load the testimonials at this time."
      showRetry={false}
      minHeight="min-h-[200px]"
    />
  );
}

/**
 * Skills section specific fallback
 */
export function SkillsErrorFallback(props: FallbackProps) {
  return (
    <SectionErrorFallback
      {...props}
      title="Unable to load skills"
      description="We couldn't load the skills section at this time."
      minHeight="min-h-[300px]"
    />
  );
}
