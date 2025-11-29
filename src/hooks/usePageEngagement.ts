'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';

export interface UsePageEngagementOptions {
  /**
   * Scroll depth milestones to track (percentages)
   * @default [25, 50, 75, 90, 100]
   */
  scrollMilestones?: number[];
  /**
   * Time intervals to track (seconds)
   * @default [30, 60, 120, 300]
   */
  timeIntervals?: number[];
  /**
   * Whether to track scroll depth
   * @default true
   */
  trackScroll?: boolean;
  /**
   * Whether to track time on page
   * @default true
   */
  trackTime?: boolean;
  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

/**
 * Hook to automatically track user engagement metrics:
 * - Scroll depth milestones (25%, 50%, 75%, 90%, 100%)
 * - Time on page intervals (30s, 60s, 120s, 300s)
 *
 * @example
 * ```tsx
 * function BlogPost() {
 *   usePageEngagement();
 *   return <article>...</article>;
 * }
 * ```
 */
export function usePageEngagement(options: UsePageEngagementOptions = {}) {
  const {
    scrollMilestones = [25, 50, 75, 90, 100],
    timeIntervals = [30, 60, 120, 300],
    trackScroll = true,
    trackTime = true,
    debug = false,
  } = options;

  const { trackScrollDepth, trackTimeOnPage } = useAnalytics({ debug });
  const trackedScrollMilestones = useRef<Set<number>>(new Set());
  const trackedTimeIntervals = useRef<Set<number>>(new Set());
  const startTimeRef = useRef<number>(Date.now());

  // Track scroll depth
  const handleScroll = useCallback(() => {
    if (!trackScroll) return;

    const scrollHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (scrollHeight <= 0) return;

    const scrolled = window.scrollY;
    const percentScrolled = Math.round((scrolled / scrollHeight) * 100);

    for (const milestone of scrollMilestones) {
      if (
        percentScrolled >= milestone &&
        !trackedScrollMilestones.current.has(milestone)
      ) {
        trackedScrollMilestones.current.add(milestone);
        trackScrollDepth(milestone);
      }
    }
  }, [trackScroll, scrollMilestones, trackScrollDepth]);

  // Set up scroll tracking
  useEffect(() => {
    if (!trackScroll) return;

    // Throttle scroll events
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // Check initial scroll position (user might have scrolled before hydration)
    handleScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
    };
  }, [trackScroll, handleScroll]);

  // Set up time tracking
  useEffect(() => {
    if (!trackTime) return;

    const checkTimeIntervals = () => {
      const elapsedSeconds = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );

      for (const interval of timeIntervals) {
        if (
          elapsedSeconds >= interval &&
          !trackedTimeIntervals.current.has(interval)
        ) {
          trackedTimeIntervals.current.add(interval);
          trackTimeOnPage(interval);
        }
      }
    };

    // Check every 5 seconds
    const intervalId = setInterval(checkTimeIntervals, 5000);

    // Track time on unmount/navigation
    return () => {
      clearInterval(intervalId);
      const finalSeconds = Math.floor(
        (Date.now() - startTimeRef.current) / 1000
      );
      if (finalSeconds > 0) {
        trackTimeOnPage(finalSeconds, { event: 'page_exit' });
      }
    };
  }, [trackTime, timeIntervals, trackTimeOnPage]);

  // Reset on mount (for SPA navigation)
  useEffect(() => {
    trackedScrollMilestones.current.clear();
    trackedTimeIntervals.current.clear();
    startTimeRef.current = Date.now();
  }, []);
}
