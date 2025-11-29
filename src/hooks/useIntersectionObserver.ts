'use client';

import { useState, useEffect, useRef } from 'react';

export interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  freezeOnceVisible?: boolean;
}

export interface IntersectionResult {
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
}

/**
 * Hook to observe element intersection with viewport
 *
 * Useful for lazy loading, animations on scroll, infinite scroll,
 * and tracking element visibility.
 *
 * @param options - IntersectionObserver options
 * @returns Object with ref, isIntersecting, and entry
 *
 * @example
 * ```tsx
 * // Basic usage - animate when visible
 * function AnimateOnScroll() {
 *   const { ref, isIntersecting } = useIntersectionObserver({
 *     threshold: 0.1,
 *     freezeOnceVisible: true, // Only animate once
 *   });
 *
 *   return (
 *     <div
 *       ref={ref}
 *       className={isIntersecting ? 'animate-fade-in' : 'opacity-0'}
 *     >
 *       Content
 *     </div>
 *   );
 * }
 *
 * // Lazy load images
 * function LazyImage({ src, alt }: { src: string; alt: string }) {
 *   const { ref, isIntersecting } = useIntersectionObserver({
 *     rootMargin: '100px', // Start loading 100px before visible
 *     freezeOnceVisible: true,
 *   });
 *
 *   return (
 *     <div ref={ref}>
 *       {isIntersecting && <img src={src} alt={alt} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useIntersectionObserver<T extends Element = Element>(
  options: IntersectionObserverOptions = {}
): {
  ref: React.RefObject<T | null>;
  isIntersecting: boolean;
  entry: IntersectionObserverEntry | null;
} {
  const {
    root = null,
    rootMargin = '0px',
    threshold = 0,
    freezeOnceVisible = false,
  } = options;

  const elementRef = useRef<T | null>(null);
  const [result, setResult] = useState<IntersectionResult>({
    isIntersecting: false,
    entry: null,
  });

  // Track if we've frozen (for freezeOnceVisible option)
  const frozen = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // Fallback: assume element is visible
      setResult({ isIntersecting: true, entry: null });
      return;
    }

    // Don't observe if we're frozen
    if (frozen.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;

        const isIntersecting = entry.isIntersecting;

        setResult({ isIntersecting, entry });

        // Freeze if option is set and element is visible
        if (freezeOnceVisible && isIntersecting) {
          frozen.current = true;
          observer.disconnect();
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [root, rootMargin, threshold, freezeOnceVisible]);

  return {
    ref: elementRef,
    isIntersecting: result.isIntersecting,
    entry: result.entry,
  };
}
