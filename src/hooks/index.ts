/**
 * Central export for all custom hooks
 */

// Hook exports
export { useMediaQuery } from './useMediaQuery';
export { useReducedMotion } from './useReducedMotion';
export { useIsMobile } from './useIsMobile';
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useIntersectionObserver } from './useIntersectionObserver';
export { useAnalytics } from './useAnalytics';
export { useWebVitals } from './useWebVitals';
export { usePerformance } from './usePerformance';
export { useFocusTrap } from './useFocusTrap';
export { usePWAInstall } from './usePWAInstall';
export { usePageEngagement } from './usePageEngagement';

// Type exports
export type {
  EventProperties,
  AnalyticsEvent,
  UseAnalyticsOptions,
} from './useAnalytics';

export type { UseWebVitalsOptions, WebVitalsState } from './useWebVitals';

export type { UsePerformanceOptions, TimingResult } from './usePerformance';

export type { UseFocusTrapOptions } from './useFocusTrap';

export type {
  IntersectionObserverOptions,
  IntersectionResult,
} from './useIntersectionObserver';

export type { UsePWAInstallReturn } from './usePWAInstall';

export type { UsePageEngagementOptions } from './usePageEngagement';

// Derived return types for advanced use cases
export type UseAnalyticsReturn = ReturnType<
  typeof import('./useAnalytics').useAnalytics
>;
export type UseWebVitalsReturn = ReturnType<
  typeof import('./useWebVitals').useWebVitals
>;
export type UsePerformanceReturn = ReturnType<
  typeof import('./usePerformance').usePerformance
>;
export type UseFocusTrapReturn = ReturnType<
  typeof import('./useFocusTrap').useFocusTrap
>;
