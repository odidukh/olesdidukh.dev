'use client';

import { useState, useCallback, useMemo } from 'react';
import { useDebounce } from './useDebounce';
import {
  search,
  getRecentItems,
  groupResultsByType,
  type SearchResult,
  type SearchResultType,
} from '@/lib/search';

export interface UseSearchOptions {
  /**
   * Debounce delay in milliseconds
   * @default 150
   */
  debounceMs?: number;
  /**
   * Maximum number of results to return
   * @default 10
   */
  limit?: number;
  /**
   * Filter results by type
   */
  filterType?: SearchResultType;
}

export interface UseSearchReturn {
  /**
   * Current search query
   */
  query: string;
  /**
   * Set the search query
   */
  setQuery: (query: string) => void;
  /**
   * Search results
   */
  results: SearchResult[];
  /**
   * Results grouped by type
   */
  groupedResults: Record<SearchResultType, SearchResult[]>;
  /**
   * Whether the search is currently loading (debouncing)
   */
  isSearching: boolean;
  /**
   * Clear the search query
   */
  clearSearch: () => void;
  /**
   * Whether there are results
   */
  hasResults: boolean;
  /**
   * Recent/suggested items (shown when no query)
   */
  recentItems: SearchResult[];
}

/**
 * Hook for global site search functionality
 *
 * Uses Fuse.js for client-side fuzzy search across blog posts,
 * projects, and static pages.
 *
 * @example
 * ```tsx
 * function SearchDialog() {
 *   const {
 *     query,
 *     setQuery,
 *     results,
 *     groupedResults,
 *     isSearching,
 *     clearSearch,
 *     recentItems,
 *   } = useSearch({ limit: 8 });
 *
 *   return (
 *     <div>
 *       <input
 *         value={query}
 *         onChange={(e) => setQuery(e.target.value)}
 *         placeholder="Search..."
 *       />
 *       {isSearching && <span>Searching...</span>}
 *       {query ? (
 *         <ul>
 *           {results.map((result) => (
 *             <li key={result.id}>{result.title}</li>
 *           ))}
 *         </ul>
 *       ) : (
 *         <ul>
 *           {recentItems.map((item) => (
 *             <li key={item.id}>{item.title}</li>
 *           ))}
 *         </ul>
 *       )}
 *     </div>
 *   );
 * }
 * ```
 */
export function useSearch(options: UseSearchOptions = {}): UseSearchReturn {
  const { debounceMs = 150, limit = 10, filterType } = options;

  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, debounceMs);

  const isSearching = query !== debouncedQuery;

  const results = useMemo(() => {
    let searchResults = search(debouncedQuery, limit);

    if (filterType) {
      searchResults = searchResults.filter(r => r.type === filterType);
    }

    return searchResults;
  }, [debouncedQuery, limit, filterType]);

  const groupedResults = useMemo(() => groupResultsByType(results), [results]);

  const recentItems = useMemo(() => getRecentItems(5), []);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const hasResults = results.length > 0;

  return {
    query,
    setQuery,
    results,
    groupedResults,
    isSearching,
    clearSearch,
    hasResults,
    recentItems,
  };
}
