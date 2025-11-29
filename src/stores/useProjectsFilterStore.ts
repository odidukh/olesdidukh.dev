import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  /** Clear all filters */
  clearFilters: () => void;
  /** Check if any filters are active */
  hasActiveFilters: () => boolean;
}

const initialState = {
  selectedCategory: 'All',
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
  persist(
    (set, get) => ({
      ...initialState,

      setSelectedCategory: category => set({ selectedCategory: category }),

      toggleTechnology: tech =>
        set(state => ({
          selectedTechnologies: state.selectedTechnologies.includes(tech)
            ? state.selectedTechnologies.filter(t => t !== tech)
            : [...state.selectedTechnologies, tech],
        })),

      setSelectedTechnologies: technologies =>
        set({ selectedTechnologies: technologies }),

      setSearchQuery: query => set({ searchQuery: query }),

      setViewMode: mode => set({ viewMode: mode }),

      toggleShowFilters: () =>
        set(state => ({ showFilters: !state.showFilters })),

      setShowFilters: show => set({ showFilters: show }),

      clearFilters: () =>
        set({
          selectedCategory: 'All',
          selectedTechnologies: [],
          searchQuery: '',
        }),

      hasActiveFilters: () => {
        const state = get();
        return (
          state.selectedCategory !== 'All' ||
          state.selectedTechnologies.length > 0 ||
          state.searchQuery !== ''
        );
      },
    }),
    {
      name: 'projects-filter-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      // Only persist filter values and view mode, not UI state like showFilters
      partialize: state => ({
        selectedCategory: state.selectedCategory,
        selectedTechnologies: state.selectedTechnologies,
        searchQuery: state.searchQuery,
        viewMode: state.viewMode,
      }),
    }
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
