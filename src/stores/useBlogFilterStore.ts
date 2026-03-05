import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import { createSSRSafeStorage, createRehydrateHandler } from '@/lib/storage';
import { ALL_FILTER } from '@/constants';
import { blogCategories } from '@/data/blog';

/** Valid category values for filtering */
const validCategories = new Set<string>(blogCategories);

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
  selectedCategory: ALL_FILTER,
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
 * Invariants:
 * - selectedCategory is always a valid category from blogCategories (defaults to ALL_FILTER)
 * - showFilters is transient (not persisted to localStorage)
 * - clearFilters() preserves sortBy; resetAll() resets everything
 * - hasActiveFilters() returns true only for category or search, not sortBy
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

        setSearchQuery: query => set({ searchQuery: query }),

        setSortBy: sort => set({ sortBy: sort }),

        toggleShowFilters: () =>
          set(state => ({ showFilters: !state.showFilters })),

        setShowFilters: show => set({ showFilters: show }),

        clearFilters: () =>
          set({
            selectedCategory: ALL_FILTER,
            searchQuery: '',
          }),

        resetAll: () =>
          set({
            selectedCategory: ALL_FILTER,
            searchQuery: '',
            sortBy: 'latest',
          }),

        hasActiveFilters: () => {
          const state = get();
          return (
            state.selectedCategory !== ALL_FILTER || state.searchQuery !== ''
          );
        },
      }),
      {
        name: 'blog-filter-storage',
        storage: createSSRSafeStorage(),
        // Only persist filter values and sort, not UI state like showFilters
        partialize: state => ({
          selectedCategory: state.selectedCategory,
          sortBy: state.sortBy,
        }),
        onRehydrateStorage:
          createRehydrateHandler<BlogFilterState>('useBlogFilterStore'),
      }
    ),
    { name: 'BlogFilter', enabled: process.env.NODE_ENV === 'development' }
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
