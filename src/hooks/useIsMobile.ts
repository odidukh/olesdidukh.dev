'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect mobile/touch devices
 * @param breakpoint - Width breakpoint in pixels (default: 768)
 * @returns boolean indicating if device is mobile
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
