import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createSSRSafeStorage, createRehydrateHandler } from '@/lib/storage';
import { ALL_FILTER } from '@/constants';
import {
  PROJECT_CATEGORIES,
  PROJECT_TECHNOLOGIES,
} from '@/config/project-filters';

/** Valid category values for filtering */
const validCategories = new Set<string>(PROJECT_CATEGORIES);
/** Valid technology values for filtering */
const validTechnologies = new Set<string>(PROJECT_TECHNOLOGIES);

type ViewMode = 'grid' | 'list';

interface ProjectsFilterState {
  /** Selected category filter ('All' for no filter) */
  selectedCategory: string;
  /** Selected technology tags */
  selectedTechnologies: string[];
  /** Search query text */
  searchQuery: string;
  /** View mode (grid or list) */
  viewMode: ViewMode;
  /** Whether the filter panel is expanded */
  showFilters: boolean;

  /** Set selected category */
  setSelectedCategory: (category: string) => void;
  /** Toggle a technology in the selection */
  toggleTechnology: (tech: string) => void;
  /** Set selected technologies directly */
  setSelectedTechnologies: (technologies: string[]) => void;
  /** Set search query */
  setSearchQuery: (query: string) => void;
  /** Set view mode */
  setViewMode: (mode: ViewMode) => void;
  /** Toggle filter panel visibility */
  toggleShowFilters: () => void;
  /** Set filter panel visibility */
  setShowFilters: (show: boolean) => void;
  /** Clear all filters (resets category, technologies, and search, keeps view mode) */
  clearFilters: () => void;
  /** Reset all to defaults including view mode */
  resetAll: () => void;
  /** Check if any filters are active */
  hasActiveFilters: () => boolean;
}

const initialState = {
  selectedCategory: ALL_FILTER,
  selectedTechnologies: [] as string[],
  searchQuery: '',
  viewMode: 'grid' as ViewMode,
  showFilters: false,
};

/**
 * Global projects filter store using Zustand with localStorage persistence.
 *
 * Features:
 * - Persists filter preferences across page navigations
 * - Maintains filter state when returning to projects page
 * - Supports category, technology, and search query filters
 * - Remembers view mode preference (grid/list)
 *
 * Invariants:
 * - selectedCategory is always a valid category from PROJECT_CATEGORIES (defaults to ALL_FILTER)
 * - selectedTechnologies only contains valid technologies from PROJECT_TECHNOLOGIES
 * - showFilters is transient (not persisted to localStorage)
 * - clearFilters() preserves viewMode; resetAll() resets everything
 *
 * @example
 * ```tsx
 * import { useProjectsFilterStore } from '@/stores/useProjectsFilterStore';
 *
 * function ProjectFilters() {
 *   const {
 *     selectedCategory,
 *     setSelectedCategory,
 *     searchQuery,
 *     setSearchQuery,
 *     clearFilters,
 *   } = useProjectsFilterStore();
 *
 *   return (
 *     <div>
 *       <input
 *         value={searchQuery}
 *         onChange={(e) => setSearchQuery(e.target.value)}
 *       />
 *       <button onClick={clearFilters}>Clear</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useProjectsFilterStore = create<ProjectsFilterState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        setSelectedCategory: category => {
          // Validate category against allowed values, fallback to ALL_FILTER
          const validCategory = validCategories.has(category)
            ? category
            : ALL_FILTER;
          set({ selectedCategory: validCategory });
        },

        toggleTechnology: tech => {
          // Only toggle valid technologies
          if (!validTechnologies.has(tech)) return;
          set(state => ({
            selectedTechnologies: state.selectedTechnologies.includes(tech)
              ? state.selectedTechnologies.filter(t => t !== tech)
              : [...state.selectedTechnologies, tech],
          }));
        },

        setSelectedTechnologies: technologies => {
          // Filter to only valid technologies
          const validTechs = technologies.filter(t => validTechnologies.has(t));
          set({ selectedTechnologies: validTechs });
        },

        setSearchQuery: query => set({ searchQuery: query }),

        setViewMode: mode => set({ viewMode: mode }),

        toggleShowFilters: () =>
          set(state => ({ showFilters: !state.showFilters })),

        setShowFilters: show => set({ showFilters: show }),

        clearFilters: () =>
          set({
            selectedCategory: ALL_FILTER,
            selectedTechnologies: [],
            searchQuery: '',
          }),

        resetAll: () =>
          set({
            selectedCategory: ALL_FILTER,
            selectedTechnologies: [],
            searchQuery: '',
            viewMode: 'grid',
          }),

        hasActiveFilters: () => {
          const state = get();
          return (
            state.selectedCategory !== ALL_FILTER ||
            state.selectedTechnologies.length > 0 ||
            state.searchQuery !== ''
          );
        },
      }),
      {
        name: 'projects-filter-storage',
        storage: createSSRSafeStorage(),
        // Only persist filter values and view mode, not UI state like showFilters
        partialize: state => ({
          selectedCategory: state.selectedCategory,
          selectedTechnologies: state.selectedTechnologies,
          searchQuery: state.searchQuery,
          viewMode: state.viewMode,
        }),
        onRehydrateStorage: createRehydrateHandler<ProjectsFilterState>(
          'useProjectsFilterStore'
        ),
      }
    ),
    { name: 'ProjectsFilter', enabled: process.env.NODE_ENV === 'development' }
  )
);

/**
 * Selector hooks for specific parts of the state
 */
export const useProjectsCategory = () =>
  useProjectsFilterStore(state => state.selectedCategory);

export const useProjectsTechnologies = () =>
  useProjectsFilterStore(state => state.selectedTechnologies);

export const useProjectsSearchQuery = () =>
  useProjectsFilterStore(state => state.searchQuery);

export const useProjectsViewMode = () =>
  useProjectsFilterStore(state => state.viewMode);

export const useProjectsHasActiveFilters = () =>
  useProjectsFilterStore(state => state.hasActiveFilters());
