import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

// Mock Sentry before importing the store
vi.mock('@/lib/sentry', () => ({
  captureException: vi.fn(),
}));

describe('useProjectsFilterStore', () => {
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
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    expect(result.current.selectedCategory).toBe('All');
    expect(result.current.selectedTechnologies).toEqual([]);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.viewMode).toBe('grid');
    expect(result.current.showFilters).toBe(false);
  });

  it('setSelectedCategory updates category', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.setSelectedCategory('Web Application');
    });

    expect(result.current.selectedCategory).toBe('Web Application');
  });

  it('toggleTechnology adds technology when not present', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.toggleTechnology('React');
    });

    expect(result.current.selectedTechnologies).toContain('React');
  });

  it('toggleTechnology removes technology when present', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.toggleTechnology('React');
      result.current.toggleTechnology('TypeScript');
    });

    expect(result.current.selectedTechnologies).toEqual([
      'React',
      'TypeScript',
    ]);

    act(() => {
      result.current.toggleTechnology('React');
    });

    expect(result.current.selectedTechnologies).toEqual(['TypeScript']);
  });

  it('setSelectedTechnologies sets technologies directly', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    const techs = ['React', 'TypeScript', 'Next.js'];
    act(() => {
      result.current.setSelectedTechnologies(techs);
    });

    expect(result.current.selectedTechnologies).toEqual(techs);
  });

  it('setSearchQuery updates search query', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.setSearchQuery('dashboard');
    });

    expect(result.current.searchQuery).toBe('dashboard');
  });

  it('setViewMode updates view mode', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    expect(result.current.viewMode).toBe('grid');

    act(() => {
      result.current.setViewMode('list');
    });

    expect(result.current.viewMode).toBe('list');
  });

  it('toggleShowFilters toggles filter panel visibility', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

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
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.setShowFilters(true);
    });

    expect(result.current.showFilters).toBe(true);

    act(() => {
      result.current.setShowFilters(false);
    });

    expect(result.current.showFilters).toBe(false);
  });

  it('clearFilters resets category, technologies, and search but keeps view mode', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.setSelectedCategory('Web Application');
      result.current.toggleTechnology('React');
      result.current.setSearchQuery('test');
      result.current.setViewMode('list');
    });

    expect(result.current.selectedCategory).toBe('Web Application');
    expect(result.current.selectedTechnologies).toEqual(['React']);
    expect(result.current.searchQuery).toBe('test');
    expect(result.current.viewMode).toBe('list');

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.selectedCategory).toBe('All');
    expect(result.current.selectedTechnologies).toEqual([]);
    expect(result.current.searchQuery).toBe('');
    // View mode should be preserved
    expect(result.current.viewMode).toBe('list');
  });

  it('resetAll resets everything including view mode', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.setSelectedCategory('Web Application');
      result.current.toggleTechnology('React');
      result.current.setSearchQuery('test');
      result.current.setViewMode('list');
    });

    act(() => {
      result.current.resetAll();
    });

    expect(result.current.selectedCategory).toBe('All');
    expect(result.current.selectedTechnologies).toEqual([]);
    expect(result.current.searchQuery).toBe('');
    expect(result.current.viewMode).toBe('grid');
  });

  it('hasActiveFilters returns false when no filters are active', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    expect(result.current.hasActiveFilters()).toBe(false);
  });

  it('hasActiveFilters returns true when category is set', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.setSelectedCategory('Web Application');
    });

    expect(result.current.hasActiveFilters()).toBe(true);
  });

  it('hasActiveFilters returns true when technologies are selected', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.toggleTechnology('React');
    });

    expect(result.current.hasActiveFilters()).toBe(true);
  });

  it('hasActiveFilters returns true when search query is set', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.setSearchQuery('dashboard');
    });

    expect(result.current.hasActiveFilters()).toBe(true);
  });

  it('persists filter values to localStorage', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.setSelectedCategory('Web Application');
      result.current.toggleTechnology('React');
      result.current.setSearchQuery('test');
      result.current.setViewMode('list');
    });

    expect(mockStorage['projects-filter-storage']).toBeDefined();
    const stored = JSON.parse(mockStorage['projects-filter-storage'] ?? '{}');

    expect(stored.state?.selectedCategory).toBe('Web Application');
    expect(stored.state?.selectedTechnologies).toEqual(['React']);
    expect(stored.state?.searchQuery).toBeUndefined();
    expect(stored.state?.viewMode).toBe('list');
  });

  it('does not persist showFilters to localStorage', async () => {
    const { useProjectsFilterStore } = await import('./useProjectsFilterStore');

    const { result } = renderHook(() => useProjectsFilterStore());

    act(() => {
      result.current.setShowFilters(true);
    });

    const stored = JSON.parse(mockStorage['projects-filter-storage'] ?? '{}');
    expect(stored.state?.showFilters).toBeUndefined();
  });
});

describe('useProjectsFilterStore selector hooks', () => {
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

  it('useProjectsCategory returns current category', async () => {
    const { useProjectsFilterStore, useProjectsCategory } =
      await import('./useProjectsFilterStore');

    const { result: storeResult } = renderHook(() => useProjectsFilterStore());
    const { result: selectorResult } = renderHook(() => useProjectsCategory());

    expect(selectorResult.current).toBe('All');

    act(() => {
      storeResult.current.setSelectedCategory('Web Application');
    });

    const { result: updatedResult } = renderHook(() => useProjectsCategory());
    expect(updatedResult.current).toBe('Web Application');
  });

  it('useProjectsTechnologies returns selected technologies', async () => {
    const { useProjectsFilterStore, useProjectsTechnologies } =
      await import('./useProjectsFilterStore');

    const { result: storeResult } = renderHook(() => useProjectsFilterStore());
    const { result: selectorResult } = renderHook(() =>
      useProjectsTechnologies()
    );

    expect(selectorResult.current).toEqual([]);

    act(() => {
      storeResult.current.toggleTechnology('React');
    });

    const { result: updatedResult } = renderHook(() =>
      useProjectsTechnologies()
    );
    expect(updatedResult.current).toEqual(['React']);
  });

  it('useProjectsSearchQuery returns search query', async () => {
    const { useProjectsFilterStore, useProjectsSearchQuery } =
      await import('./useProjectsFilterStore');

    const { result: storeResult } = renderHook(() => useProjectsFilterStore());
    const { result: selectorResult } = renderHook(() =>
      useProjectsSearchQuery()
    );

    expect(selectorResult.current).toBe('');

    act(() => {
      storeResult.current.setSearchQuery('dashboard');
    });

    const { result: updatedResult } = renderHook(() =>
      useProjectsSearchQuery()
    );
    expect(updatedResult.current).toBe('dashboard');
  });

  it('useProjectsViewMode returns view mode', async () => {
    const { useProjectsFilterStore, useProjectsViewMode } =
      await import('./useProjectsFilterStore');

    const { result: storeResult } = renderHook(() => useProjectsFilterStore());
    const { result: selectorResult } = renderHook(() => useProjectsViewMode());

    expect(selectorResult.current).toBe('grid');

    act(() => {
      storeResult.current.setViewMode('list');
    });

    const { result: updatedResult } = renderHook(() => useProjectsViewMode());
    expect(updatedResult.current).toBe('list');
  });
});
