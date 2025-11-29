import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { captureException } from '@/lib/sentry';

type SortOption = 'latest' | 'popular' | 'trending';

interface BlogFilterState {
  /** Selected category filter ('All' for no filter) */
  selectedCategory: string;
  /** Search query text */
  searchQuery: string;
  /** Sort order for posts */
  sortBy: SortOption;
  /** Whether the filter panel is expanded */
  showFilters: boolean;

  /** Set selected category */
  setSelectedCategory: (category: string) => void;
  /** Set search query */
  setSearchQuery: (query: string) => void;
  /** Set sort option */
  setSortBy: (sort: SortOption) => void;
  /** Toggle filter panel visibility */
  toggleShowFilters: () => void;
  /** Set filter panel visibility */
  setShowFilters: (show: boolean) => void;
  /** Clear all filters (resets category and search, keeps sort) */
  clearFilters: () => void;
  /** Reset all to defaults including sort */
  resetAll: () => void;
  /** Check if any filters are active */
  hasActiveFilters: () => boolean;
}

const initialState = {
  selectedCategory: 'All',
  searchQuery: '',
  sortBy: 'latest' as SortOption,
  showFilters: false,
};

/**
 * Global blog filter store using Zustand with localStorage persistence.
 *
 * Features:
 * - Persists filter preferences across page navigations
 * - Maintains filter state when returning to blog page
 * - Supports category and search query filters
 * - Remembers sort preference
 *
 * @example
 * ```tsx
 * import { useBlogFilterStore } from '@/stores/useBlogFilterStore';
 *
 * function BlogFilters() {
 *   const {
 *     selectedCategory,
 *     setSelectedCategory,
 *     searchQuery,
 *     setSearchQuery,
 *     sortBy,
 *     setSortBy,
 *     clearFilters,
 *   } = useBlogFilterStore();
 *
 *   return (
 *     <div>
 *       <input
 *         value={searchQuery}
 *         onChange={(e) => setSearchQuery(e.target.value)}
 *       />
 *       <select
 *         value={sortBy}
 *         onChange={(e) => setSortBy(e.target.value as SortOption)}
 *       >
 *         <option value="latest">Latest</option>
 *         <option value="popular">Popular</option>
 *         <option value="trending">Trending</option>
 *       </select>
 *       <button onClick={clearFilters}>Clear</button>
 *     </div>
 *   );
 * }
 * ```
 */
export const useBlogFilterStore = create<BlogFilterState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setSelectedCategory: category => set({ selectedCategory: category }),

      setSearchQuery: query => set({ searchQuery: query }),

      setSortBy: sort => set({ sortBy: sort }),

      toggleShowFilters: () =>
        set(state => ({ showFilters: !state.showFilters })),

      setShowFilters: show => set({ showFilters: show }),

      clearFilters: () =>
        set({
          selectedCategory: 'All',
          searchQuery: '',
        }),

      resetAll: () =>
        set({
          selectedCategory: 'All',
          searchQuery: '',
          sortBy: 'latest',
        }),

      hasActiveFilters: () => {
        const state = get();
        return state.selectedCategory !== 'All' || state.searchQuery !== '';
      },
    }),
    {
      name: 'blog-filter-storage',
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
      // Only persist filter values and sort, not UI state like showFilters
      partialize: state => ({
        selectedCategory: state.selectedCategory,
        searchQuery: state.searchQuery,
        sortBy: state.sortBy,
      }),
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          captureException(error, {
            store: 'useBlogFilterStore',
            action: 'rehydrate',
          });
        }
      },
    }
  )
);

/**
 * Selector hooks for specific parts of the state
 */
export const useBlogCategory = () =>
  useBlogFilterStore(state => state.selectedCategory);

export const useBlogSearchQuery = () =>
  useBlogFilterStore(state => state.searchQuery);

export const useBlogSortBy = () => useBlogFilterStore(state => state.sortBy);
