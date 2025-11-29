'use client';

import { useCallback, useRef, useEffect } from 'react';
import {
  markPerformance,
  measurePerformance,
  getPerformanceMarks,
  getPerformanceMeasures,
} from '@/lib/performance';
import { useAnalytics } from './useAnalytics';

export interface UsePerformanceOptions {
  /**
   * Prefix for all marks/measures
   */
  prefix?: string;
  /**
   * Report measurements to analytics
   */
  reportToAnalytics?: boolean;
  /**
   * Enable debug logging
   */
  debug?: boolean;
}

export interface TimingResult {
  name: string;
  duration: number;
  startTime: number;
  endTime: number;
}

/**
 * Hook for custom performance tracking
 *
 * Provides utilities for marking, measuring, and reporting performance
 * of specific operations. Uses the Performance API under the hood.
 *
 * @example
 * ```tsx
 * function DataFetcher() {
 *   const { startTiming, endTiming, timeAsync } = usePerformance({
 *     prefix: 'api',
 *     reportToAnalytics: true,
 *   });
 *
 *   const fetchData = async () => {
 *     // Option 1: Manual timing
 *     startTiming('fetch-users');
 *     const response = await fetch('/api/users');
 *     const result = endTiming('fetch-users');
 *     console.log(`Fetch took ${result?.duration}ms`);
 *
 *     // Option 2: Automatic timing with timeAsync
 *     const data = await timeAsync('parse-json', async () => {
 *       return response.json();
 *     });
 *
 *     return data;
 *   };
 *
 *   return <button onClick={fetchData}>Fetch Data</button>;
 * }
 * ```
 */
export function usePerformance(options: UsePerformanceOptions = {}) {
  const {
    prefix = '',
    reportToAnalytics = true,
    debug = process.env.NODE_ENV === 'development',
  } = options;

  const { trackEvent } = useAnalytics({ debug: false });
  const activeTimings = useRef<Map<string, number>>(new Map());

  // Create prefixed name
  const getPrefixedName = useCallback(
    (name: string) => (prefix ? `${prefix}:${name}` : name),
    [prefix]
  );

  /**
   * Start timing an operation
   */
  const startTiming = useCallback(
    (name: string): void => {
      const fullName = getPrefixedName(name);
      const startTime = performance.now();
      activeTimings.current.set(fullName, startTime);
      markPerformance(`${fullName}-start`);

      if (debug) {
        console.log(`[Performance] Started timing: ${fullName}`);
      }
    },
    [getPrefixedName, debug]
  );

  /**
   * End timing and get the result
   */
  const endTiming = useCallback(
    (name: string): TimingResult | null => {
      const fullName = getPrefixedName(name);
      const startTime = activeTimings.current.get(fullName);

      if (startTime === undefined) {
        if (debug) {
          console.warn(`[Performance] No start time found for: ${fullName}`);
        }
        return null;
      }

      const endTime = performance.now();
      const duration = endTime - startTime;
      activeTimings.current.delete(fullName);

      markPerformance(`${fullName}-end`);
      measurePerformance(fullName, `${fullName}-start`, `${fullName}-end`);

      const result: TimingResult = {
        name: fullName,
        duration,
        startTime,
        endTime,
      };

      if (reportToAnalytics) {
        trackEvent('performance_timing', {
          name: fullName,
          duration: Math.round(duration),
        });
      }

      if (debug) {
        console.log(
          `[Performance] Ended timing: ${fullName} = ${duration.toFixed(2)}ms`
        );
      }

      return result;
    },
    [getPrefixedName, reportToAnalytics, trackEvent, debug]
  );

  /**
   * Time an async operation
   */
  const timeAsync = useCallback(
    async <T>(name: string, operation: () => Promise<T>): Promise<T> => {
      startTiming(name);
      try {
        const result = await operation();
        endTiming(name);
        return result;
      } catch (error) {
        endTiming(name);
        throw error;
      }
    },
    [startTiming, endTiming]
  );

  /**
   * Time a sync operation
   */
  const timeSync = useCallback(
    <T>(name: string, operation: () => T): T => {
      startTiming(name);
      try {
        const result = operation();
        endTiming(name);
        return result;
      } catch (error) {
        endTiming(name);
        throw error;
      }
    },
    [startTiming, endTiming]
  );

  /**
   * Create a performance mark
   */
  const mark = useCallback(
    (name: string): void => {
      const fullName = getPrefixedName(name);
      markPerformance(fullName);
    },
    [getPrefixedName]
  );

  /**
   * Measure between two marks
   */
  const measure = useCallback(
    (name: string, startMark: string, endMark?: string): number | null => {
      const fullName = getPrefixedName(name);
      const fullStartMark = getPrefixedName(startMark);
      const fullEndMark = endMark ? getPrefixedName(endMark) : undefined;

      const duration = measurePerformance(fullName, fullStartMark, fullEndMark);

      if (duration !== null && reportToAnalytics) {
        trackEvent('performance_measure', {
          name: fullName,
          duration: Math.round(duration),
          startMark: fullStartMark,
          endMark: fullEndMark || 'auto',
        });
      }

      return duration;
    },
    [getPrefixedName, reportToAnalytics, trackEvent]
  );

  /**
   * Track component render time
   */
  const trackRender = useCallback(
    (componentName: string): (() => void) => {
      const startTime = performance.now();

      return () => {
        const endTime = performance.now();
        const duration = endTime - startTime;

        if (reportToAnalytics && duration > 16) {
          // Only report slow renders (>16ms = below 60fps)
          trackEvent('slow_render', {
            component: componentName,
            duration: Math.round(duration),
          });
        }

        if (debug) {
          const color = duration > 16 ? '\x1b[33m' : '\x1b[32m';
          const reset = '\x1b[0m';
          console.log(
            `[Performance] Render: ${componentName} = ${color}${duration.toFixed(2)}ms${reset}`
          );
        }
      };
    },
    [reportToAnalytics, trackEvent, debug]
  );

  /**
   * Get all performance marks
   */
  const getMarks = useCallback(() => {
    return getPerformanceMarks();
  }, []);

  /**
   * Get all performance measures
   */
  const getMeasures = useCallback(() => {
    return getPerformanceMeasures();
  }, []);

  /**
   * Track resource loading time
   */
  const trackResourceLoad = useCallback(
    (resourceName: string, resourceType: string): void => {
      if (typeof PerformanceObserver === 'undefined') return;

      const observer = new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (entry.name.includes(resourceName)) {
            const duration = entry.duration;

            if (reportToAnalytics) {
              trackEvent('resource_load', {
                name: resourceName,
                type: resourceType,
                duration: Math.round(duration),
              });
            }

            if (debug) {
              console.log(
                `[Performance] Resource loaded: ${resourceName} (${resourceType}) = ${duration.toFixed(2)}ms`
              );
            }

            observer.disconnect();
          }
        }
      });

      observer.observe({ type: 'resource', buffered: true });
    },
    [reportToAnalytics, trackEvent, debug]
  );

  // Cleanup active timings on unmount
  useEffect(() => {
    const timings = activeTimings.current;
    return () => {
      timings.clear();
    };
  }, []);

  return {
    // Timing operations
    startTiming,
    endTiming,
    timeAsync,
    timeSync,

    // Mark/measure operations
    mark,
    measure,

    // Specialized tracking
    trackRender,
    trackResourceLoad,

    // Getters
    getMarks,
    getMeasures,
  };
}
