'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to debounce a value
 *
 * Delays updating the returned value until after the specified delay
 * has passed since the last change. Useful for search inputs, resize
 * handlers, and API calls.
 *
 * @param value - Value to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced value
 *
 * @example
 * ```tsx
 * function SearchInput() {
 *   const [query, setQuery] = useState('');
 *   const debouncedQuery = useDebounce(query, 300);
 *
 *   useEffect(() => {
 *     if (debouncedQuery) {
 *       // Only fires 300ms after user stops typing
 *       searchAPI(debouncedQuery);
 *     }
 *   }, [debouncedQuery]);
 *
 *   return (
 *     <input
 *       value={query}
 *       onChange={(e) => setQuery(e.target.value)}
 *       placeholder="Search..."
 *     />
 *   );
 * }
 * ```
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
