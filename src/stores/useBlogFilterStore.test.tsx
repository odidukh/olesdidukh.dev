import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

// Mock Sentry before importing the store
vi.mock('@/lib/sentry', () => ({
  captureException: vi.fn(),
}));

describe('useBlogFilterStore', () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(async () => {
    // Clear storage mock
    Object.keys(mockStorage).forEach(key => delete mockStorage[key]);

    // Mock localStorage
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      key => mockStorage[key] ?? null
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockStorage[key] = value;
    });
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(key => {
      delete mockStorage[key];
    });

    // Clear module cache to reset the store
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('initializes with default values', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    expect(result.current.selectedCategory).toBe('All');
    expect(result.current.searchQuery).toBe('');
    expect(result.current.sortBy).toBe('latest');
    expect(result.current.showFilters).toBe(false);
  });

  it('setSelectedCategory updates category', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    act(() => {
      result.current.setSelectedCategory('React');
    });

    expect(result.current.selectedCategory).toBe('React');
  });

  it('setSelectedCategory validates category and falls back to All for invalid', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    act(() => {
      result.current.setSelectedCategory('InvalidCategory');
    });

    expect(result.current.selectedCategory).toBe('All');
  });

  it('setSearchQuery updates search query', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    act(() => {
      result.current.setSearchQuery('typescript');
    });

    expect(result.current.searchQuery).toBe('typescript');
  });

  it('setSortBy updates sort option', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    expect(result.current.sortBy).toBe('latest');

    act(() => {
      result.current.setSortBy('popular');
    });

    expect(result.current.sortBy).toBe('popular');

    act(() => {
      result.current.setSortBy('trending');
    });

    expect(result.current.sortBy).toBe('trending');
  });

  it('toggleShowFilters toggles filter panel visibility', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    expect(result.current.showFilters).toBe(false);

    act(() => {
      result.current.toggleShowFilters();
    });

    expect(result.current.showFilters).toBe(true);

    act(() => {
      result.current.toggleShowFilters();
    });

    expect(result.current.showFilters).toBe(false);
  });

  it('setShowFilters sets filter panel visibility directly', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    act(() => {
      result.current.setShowFilters(true);
    });

    expect(result.current.showFilters).toBe(true);

    act(() => {
      result.current.setShowFilters(false);
    });

    expect(result.current.showFilters).toBe(false);
  });

  it('clearFilters resets category and search but keeps sortBy', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    act(() => {
      result.current.setSelectedCategory('React');
      result.current.setSearchQuery('test');
      result.current.setSortBy('popular');
    });

    expect(result.current.selectedCategory).toBe('React');
    expect(result.current.searchQuery).toBe('test');
    expect(result.current.sortBy).toBe('popular');

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.selectedCategory).toBe('All');
    expect(result.current.searchQuery).toBe('');
    // Sort should be preserved
    expect(result.current.sortBy).toBe('popular');
  });

  it('resetAll resets everything including sortBy', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    act(() => {
      result.current.setSelectedCategory('React');
      result.current.setSearchQuery('test');
      result.current.setSortBy('popular');
    });

    act(() => {
      result.current.resetAll();
    });

    expect(result.current.selectedCategory).toBe('All');
    expect(result.current.searchQuery).toBe('');
    expect(result.current.sortBy).toBe('latest');
  });

  it('hasActiveFilters returns false when no filters are active', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    expect(result.current.hasActiveFilters()).toBe(false);
  });

  it('hasActiveFilters returns true when category is set', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    act(() => {
      result.current.setSelectedCategory('React');
    });

    expect(result.current.hasActiveFilters()).toBe(true);
  });

  it('hasActiveFilters returns true when search query is set', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    act(() => {
      result.current.setSearchQuery('typescript');
    });

    expect(result.current.hasActiveFilters()).toBe(true);
  });

  it('persists filter values to localStorage', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    act(() => {
      result.current.setSelectedCategory('React');
      result.current.setSearchQuery('test');
      result.current.setSortBy('popular');
    });

    expect(mockStorage['blog-filter-storage']).toBeDefined();
    const stored = JSON.parse(mockStorage['blog-filter-storage'] ?? '{}');

    expect(stored.state?.selectedCategory).toBe('React');
    expect(stored.state?.searchQuery).toBe('test');
    expect(stored.state?.sortBy).toBe('popular');
  });

  it('does not persist showFilters to localStorage', async () => {
    const { useBlogFilterStore } = await import('./useBlogFilterStore');

    const { result } = renderHook(() => useBlogFilterStore());

    act(() => {
      result.current.setShowFilters(true);
    });

    const stored = JSON.parse(mockStorage['blog-filter-storage'] ?? '{}');
    expect(stored.state?.showFilters).toBeUndefined();
  });
});

describe('useBlogFilterStore selector hooks', () => {
  beforeEach(async () => {
    vi.resetModules();

    const mockStorage: Record<string, string> = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      key => mockStorage[key] ?? null
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockStorage[key] = value;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('useBlogCategory returns current category', async () => {
    const { useBlogFilterStore, useBlogCategory } = await import(
      './useBlogFilterStore'
    );

    const { result: storeResult } = renderHook(() => useBlogFilterStore());
    const { result: selectorResult } = renderHook(() => useBlogCategory());

    expect(selectorResult.current).toBe('All');

    act(() => {
      storeResult.current.setSelectedCategory('React');
    });

    const { result: updatedResult } = renderHook(() => useBlogCategory());
    expect(updatedResult.current).toBe('React');
  });

  it('useBlogSearchQuery returns search query', async () => {
    const { useBlogFilterStore, useBlogSearchQuery } = await import(
      './useBlogFilterStore'
    );

    const { result: storeResult } = renderHook(() => useBlogFilterStore());
    const { result: selectorResult } = renderHook(() => useBlogSearchQuery());

    expect(selectorResult.current).toBe('');

    act(() => {
      storeResult.current.setSearchQuery('typescript');
    });

    const { result: updatedResult } = renderHook(() => useBlogSearchQuery());
    expect(updatedResult.current).toBe('typescript');
  });

  it('useBlogSortBy returns sort option', async () => {
    const { useBlogFilterStore, useBlogSortBy } = await import(
      './useBlogFilterStore'
    );

    const { result: storeResult } = renderHook(() => useBlogFilterStore());
    const { result: selectorResult } = renderHook(() => useBlogSortBy());

    expect(selectorResult.current).toBe('latest');

    act(() => {
      storeResult.current.setSortBy('popular');
    });

    const { result: updatedResult } = renderHook(() => useBlogSortBy());
    expect(updatedResult.current).toBe('popular');
  });
});
