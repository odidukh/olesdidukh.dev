'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';

// Loading skeleton for the 3D scene
function LoadingSkeleton() {
  return (
    <div className="absolute inset-0 -z-10 opacity-60">
      {/* Animated gradient placeholder */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 animate-pulse" />

      {/* Floating orb placeholders */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-primary/5 blur-2xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-primary/5 blur-2xl animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary/5 blur-xl animate-pulse"
        style={{ animationDelay: '1s' }}
      />
    </div>
  );
}

// Dynamically import the heavy 3D component
const HeroBackground3D = dynamic(
  () =>
    import('./HeroBackground3D').then(mod => {
      // Track when the 3D component is loaded
      if (typeof window !== 'undefined' && 'performance' in window) {
        performance.mark('three-js-loaded');
        try {
          performance.measure(
            'three-js-load-time',
            'three-js-start',
            'three-js-loaded'
          );
          const measure = performance.getEntriesByName('three-js-load-time')[0];
          if (measure && process.env.NODE_ENV === 'development') {
            console.log(
              `[Performance] Three.js loaded in ${measure.duration.toFixed(2)}ms`
            );
          }
        } catch {
          // Ignore if measure fails (mark may not exist)
        }
      }
      return mod.HeroBackground3D;
    }),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  }
);

interface LazyHeroBackground3DProps {
  // Root margin for intersection observer (how early to start loading)
  rootMargin?: string;
  // Whether to track performance metrics
  trackPerformance?: boolean;
}

export function LazyHeroBackground3D({
  rootMargin = '100px',
  trackPerformance = true,
}: LazyHeroBackground3DProps) {
  const [shouldLoad, setShouldLoad] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Intersection observer for lazy loading
  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check if IntersectionObserver is available
    if (!('IntersectionObserver' in window)) {
      // Fallback: load immediately if IntersectionObserver is not supported
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          // Start performance tracking
          if (
            trackPerformance &&
            typeof window !== 'undefined' &&
            'performance' in window
          ) {
            performance.mark('three-js-start');
          }

          // Start loading the 3D component
          setShouldLoad(true);

          // Disconnect after first intersection
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0,
      }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [rootMargin, trackPerformance]);

  // Also load on user interaction (mouse move, scroll) for better UX
  React.useEffect(() => {
    if (shouldLoad) return;

    const handleInteraction = () => {
      if (!shouldLoad) {
        // Start performance tracking
        if (
          trackPerformance &&
          typeof window !== 'undefined' &&
          'performance' in window
        ) {
          performance.mark('three-js-start');
        }
        setShouldLoad(true);
      }
    };

    // Use passive event listeners for better performance
    const options = { passive: true, once: true };

    window.addEventListener('mousemove', handleInteraction, options);
    window.addEventListener('scroll', handleInteraction, options);
    window.addEventListener('touchstart', handleInteraction, options);

    // Also load after a delay as fallback
    const timeoutId = setTimeout(() => {
      if (!shouldLoad) {
        if (
          trackPerformance &&
          typeof window !== 'undefined' &&
          'performance' in window
        ) {
          performance.mark('three-js-start');
        }
        setShouldLoad(true);
      }
    }, 2000);

    return () => {
      window.removeEventListener('mousemove', handleInteraction);
      window.removeEventListener('scroll', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
      clearTimeout(timeoutId);
    };
  }, [shouldLoad, trackPerformance]);

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10">
      {shouldLoad ? <HeroBackground3D /> : <LoadingSkeleton />}
    </div>
  );
}
