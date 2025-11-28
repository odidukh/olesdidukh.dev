'use client';

import { useMediaQuery } from './useMediaQuery';

/**
 * Hook to detect user's reduced motion preference
 * @returns boolean indicating if reduced motion is preferred
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
