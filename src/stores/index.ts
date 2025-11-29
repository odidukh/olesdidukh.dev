/**
 * Zustand Stores
 *
 * This module exports all global state management stores.
 * All stores use Zustand with localStorage persistence.
 *
 * @example
 * ```tsx
 * import { useThemeStore, useProjectsFilterStore } from '@/stores';
 *
 * function MyComponent() {
 *   const { isDark, toggleTheme } = useThemeStore();
 *   const { selectedCategory, setSelectedCategory } = useProjectsFilterStore();
 *   // ...
 * }
 * ```
 */

// Theme store - global dark/light mode management
export { useThemeStore, useIsDark, useThemeHydrated } from './useThemeStore';

// Projects filter store - project filtering and view preferences
export {
  useProjectsFilterStore,
  useProjectsCategory,
  useProjectsTechnologies,
  useProjectsSearchQuery,
  useProjectsViewMode,
} from './useProjectsFilterStore';

// Blog filter store - blog filtering and sort preferences
export {
  useBlogFilterStore,
  useBlogCategory,
  useBlogSearchQuery,
  useBlogSortBy,
} from './useBlogFilterStore';

// UI preferences store - user UI preferences
export {
  useUIPreferencesStore,
  useReducedMotionPreference,
  useCompactLayoutPreference,
  useFontSizePreference,
  usePWAInstallState,
} from './useUIPreferencesStore';
