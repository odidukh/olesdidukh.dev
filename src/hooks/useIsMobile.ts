'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect mobile/touch devices
 *
 * Combines viewport width check with touch capability detection for
 * accurate mobile device detection.
 *
 * @param breakpoint - Width breakpoint in pixels (default: 768)
 * @returns boolean indicating if device is mobile
 *
 * @example
 * ```tsx
 * function Navigation() {
 *   const isMobile = useIsMobile();
 *
 *   return isMobile ? <MobileMenu /> : <DesktopNav />;
 * }
 *
 * // With custom breakpoint
 * function TabletAwareComponent() {
 *   const isSmallDevice = useIsMobile(1024);
 *
 *   return isSmallDevice ? <CompactView /> : <FullView />;
 * }
 * ```
 */
export function useIsMobile(breakpoint: number = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isNarrow = window.innerWidth < breakpoint;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isNarrow || isTouch);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}
