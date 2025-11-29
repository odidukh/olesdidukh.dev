'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to check if a media query matches
 *
 * @param query - CSS media query string
 * @returns boolean indicating if the query matches
 *
 * @example
 * ```tsx
 * function ResponsiveComponent() {
 *   const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 *   const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
 *
 *   return (
 *     <div>
 *       {isLargeScreen ? <DesktopLayout /> : <MobileLayout />}
 *       {prefersDark && <DarkModeIndicator />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
