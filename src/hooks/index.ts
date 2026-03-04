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
export { usePageEngagement } from './usePageEngagement';
export { useSearch } from './useSearch';
export { useImageLoading } from './useImageLoading';
export { useNewsletterForm } from './useNewsletterForm';

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

export type { UsePageEngagementOptions } from './usePageEngagement';

export type { UseSearchOptions, UseSearchReturn } from './useSearch';

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
