import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useSearch } from './useSearch';
import type { SearchResult } from '@/lib/search';

// Mock the search module
vi.mock('@/lib/search', () => ({
  search: vi.fn(),
  getRecentItems: vi.fn(),
  groupResultsByType: vi.fn(),
}));

// Import the mocked functions
import { search, getRecentItems, groupResultsByType } from '@/lib/search';

const mockSearchResults: SearchResult[] = [
  {
    id: '1',
    type: 'blog',
    title: 'React Hooks Guide',
    description: 'A guide to React hooks',
    url: '/blog/react-hooks',
    category: 'React',
    tags: ['react', 'hooks'],
  },
  {
    id: '2',
    type: 'project',
    title: 'Dashboard App',
    description: 'Analytics dashboard project',
    url: '/projects/dashboard',
    category: 'Web App',
    tags: ['react', 'typescript'],
  },
  {
    id: '3',
    type: 'page',
    title: 'About',
    description: 'About page',
    url: '/about',
  },
];

const mockRecentItems: SearchResult[] = [
  {
    id: 'recent-1',
    type: 'page',
    title: 'Home',
    description: 'Home page',
    url: '/',
  },
  {
    id: 'recent-2',
    type: 'blog',
    title: 'Featured Post',
    description: 'A featured blog post',
    url: '/blog/featured',
  },
];

const mockGroupedResults = {
  blog: [mockSearchResults[0]!],
  project: [mockSearchResults[1]!],
  page: [mockSearchResults[2]!],
};

describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(search).mockReturnValue([]);
    vi.mocked(getRecentItems).mockReturnValue(mockRecentItems);
    vi.mocked(groupResultsByType).mockReturnValue({
      blog: [],
      project: [],
      page: [],
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('returns initial state correctly', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.query).toBe('');
    expect(result.current.results).toEqual([]);
    expect(result.current.isSearching).toBe(false);
    expect(result.current.hasResults).toBe(false);
    expect(result.current.recentItems).toEqual(mockRecentItems);
  });

  it('updates query when setQuery is called', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery('react');
    });

    expect(result.current.query).toBe('react');
  });

  it('shows isSearching during debounce period', () => {
    const { result } = renderHook(() => useSearch({ debounceMs: 200 }));

    expect(result.current.isSearching).toBe(false);

    act(() => {
      result.current.setQuery('react');
    });

    // Should be searching during debounce
    expect(result.current.isSearching).toBe(true);

    // Advance past debounce delay
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current.isSearching).toBe(false);
  });

  it('searches after debounce delay', () => {
    vi.mocked(search).mockReturnValue(mockSearchResults);
    vi.mocked(groupResultsByType).mockReturnValue(mockGroupedResults);

    const { result } = renderHook(() => useSearch({ debounceMs: 150 }));

    act(() => {
      result.current.setQuery('react');
    });

    // Advance past debounce
    act(() => {
      vi.advanceTimersByTime(150);
    });

    // The hook should have searched with the debounced query
    expect(result.current.results).toEqual(mockSearchResults);
    expect(result.current.hasResults).toBe(true);
  });

  it('clears search when clearSearch is called', () => {
    vi.mocked(search).mockReturnValue(mockSearchResults);
    vi.mocked(groupResultsByType).mockReturnValue(mockGroupedResults);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery('react');
    });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(result.current.query).toBe('react');
    expect(result.current.hasResults).toBe(true);

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.query).toBe('');
  });

  it('respects limit option', () => {
    vi.mocked(search).mockReturnValue(mockSearchResults.slice(0, 2));

    const { result } = renderHook(() => useSearch({ limit: 2 }));

    act(() => {
      result.current.setQuery('test');
    });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(search).toHaveBeenCalledWith('test', 2);
  });

  it('filters results by type when filterType is provided', () => {
    vi.mocked(search).mockReturnValue(mockSearchResults);

    const { result } = renderHook(() => useSearch({ filterType: 'blog' }));

    act(() => {
      result.current.setQuery('react');
    });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    // Should only include blog results
    expect(result.current.results.every(r => r.type === 'blog')).toBe(true);
    expect(result.current.results).toHaveLength(1);
  });

  it('provides grouped results', () => {
    vi.mocked(search).mockReturnValue(mockSearchResults);
    vi.mocked(groupResultsByType).mockReturnValue(mockGroupedResults);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery('react');
    });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(groupResultsByType).toHaveBeenCalled();
    expect(result.current.groupedResults).toEqual(mockGroupedResults);
  });

  it('uses default debounce of 150ms', () => {
    vi.mocked(search).mockReturnValue(mockSearchResults);
    vi.mocked(groupResultsByType).mockReturnValue(mockGroupedResults);

    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery('test');
    });

    // At 100ms, should still be searching (isSearching is true)
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(result.current.isSearching).toBe(true);

    // At 150ms, search should be complete
    act(() => {
      vi.advanceTimersByTime(50);
    });
    expect(result.current.isSearching).toBe(false);
  });

  it('uses default limit of 10', () => {
    const { result } = renderHook(() => useSearch());

    act(() => {
      result.current.setQuery('test');
    });

    act(() => {
      vi.advanceTimersByTime(150);
    });

    expect(search).toHaveBeenCalledWith('test', 10);
  });

  it('returns empty results for empty query', () => {
    const { result } = renderHook(() => useSearch());

    expect(result.current.results).toEqual([]);
    expect(result.current.hasResults).toBe(false);
  });

  it('debounces rapid query changes', () => {
    vi.mocked(search).mockReturnValue(mockSearchResults);
    vi.mocked(groupResultsByType).mockReturnValue(mockGroupedResults);

    const { result } = renderHook(() => useSearch({ debounceMs: 100 }));

    act(() => {
      result.current.setQuery('r');
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    act(() => {
      result.current.setQuery('re');
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    act(() => {
      result.current.setQuery('rea');
    });

    act(() => {
      vi.advanceTimersByTime(50);
    });

    act(() => {
      result.current.setQuery('reac');
    });

    // Should still be searching since we keep updating
    expect(result.current.isSearching).toBe(true);

    // Wait for debounce to complete
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should now be done searching
    expect(result.current.isSearching).toBe(false);
    expect(result.current.query).toBe('reac');
  });

  it('respects custom debounceMs option', () => {
    vi.mocked(search).mockReturnValue([]);
    vi.mocked(groupResultsByType).mockReturnValue({
      blog: [],
      project: [],
      page: [],
    });

    const { result } = renderHook(() => useSearch({ debounceMs: 500 }));

    act(() => {
      result.current.setQuery('test');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Still searching because debounce hasn't completed
    expect(result.current.isSearching).toBe(true);

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Debounce should be complete
    expect(result.current.isSearching).toBe(false);
  });

  it('fetches recent items on mount', () => {
    renderHook(() => useSearch());

    expect(getRecentItems).toHaveBeenCalledWith(5);
  });

  it('maintains stable function references', () => {
    const { result, rerender } = renderHook(() => useSearch());

    const initialSetQuery = result.current.setQuery;
    const initialClearSearch = result.current.clearSearch;

    rerender();

    expect(result.current.setQuery).toBe(initialSetQuery);
    expect(result.current.clearSearch).toBe(initialClearSearch);
  });
});
