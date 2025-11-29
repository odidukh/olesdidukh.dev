'use client';

import { useMediaQuery } from './useMediaQuery';

/**
 * Hook to detect user's reduced motion preference
 *
 * @returns boolean indicating if reduced motion is preferred
 *
 * @example
 * ```tsx
 * function AnimatedCard() {
 *   const reducedMotion = useReducedMotion();
 *
 *   return (
 *     <motion.div
 *       initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
 *       animate={{ opacity: 1, y: 0 }}
 *       transition={{ duration: reducedMotion ? 0 : 0.3 }}
 *     >
 *       Content
 *     </motion.div>
 *   );
 * }
 * ```
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)');
}
