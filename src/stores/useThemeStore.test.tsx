import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

// Must mock before importing the store
vi.mock('@/lib/sentry', () => ({
  captureException: vi.fn(),
}));

describe('useThemeStore', () => {
  const mockStorage: Record<string, string> = {};
  let mockMediaQueryList: {
    matches: boolean;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

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

    // Mock matchMedia
    mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi
      .fn()
      .mockImplementation(
        () => mockMediaQueryList
      ) as unknown as typeof window.matchMedia;

    // Mock document.documentElement
    const mockClassList = {
      add: vi.fn(),
      remove: vi.fn(),
    };
    Object.defineProperty(document, 'documentElement', {
      value: { classList: mockClassList },
      configurable: true,
    });

    // Mock requestAnimationFrame
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      cb(0);
      return 0;
    });

    // Clear module cache to reset the store
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('initializes with default values', async () => {
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    expect(result.current.mode).toBe('system');
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('setMode updates mode to light', async () => {
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setMode('light');
    });

    expect(result.current.mode).toBe('light');
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('setMode updates mode to dark', async () => {
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setMode('dark');
    });

    expect(result.current.mode).toBe('dark');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('setMode with system uses system preference', async () => {
    mockMediaQueryList.matches = true; // System prefers dark
    vi.mocked(window.matchMedia).mockImplementation(
      () =>
        ({
          ...mockMediaQueryList,
          matches: true,
          media: '',
          onchange: null,
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        }) as unknown as MediaQueryList
    );

    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setMode('system');
    });

    expect(result.current.mode).toBe('system');
    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('toggleTheme switches between light and dark', async () => {
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    // Start with light
    act(() => {
      result.current.setMode('light');
    });
    expect(result.current.resolvedTheme).toBe('light');

    // Toggle to dark
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.resolvedTheme).toBe('dark');
    expect(result.current.mode).toBe('dark');

    // Toggle back to light
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.resolvedTheme).toBe('light');
    expect(result.current.mode).toBe('light');
  });

  it('updateResolvedTheme updates when in system mode', async () => {
    mockMediaQueryList.matches = false;
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setMode('system');
    });
    expect(result.current.resolvedTheme).toBe('light');

    // Simulate system preference change
    vi.mocked(window.matchMedia).mockImplementation(
      () =>
        ({
          ...mockMediaQueryList,
          matches: true,
          media: '',
          onchange: null,
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        }) as unknown as MediaQueryList
    );

    act(() => {
      result.current.updateResolvedTheme();
    });

    expect(result.current.resolvedTheme).toBe('dark');
  });

  it('updateResolvedTheme does nothing when not in system mode', async () => {
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setMode('light');
    });

    // Simulate system preference change
    vi.mocked(window.matchMedia).mockImplementation(
      () =>
        ({
          ...mockMediaQueryList,
          matches: true,
          media: '',
          onchange: null,
          dispatchEvent: vi.fn(),
          addListener: vi.fn(),
          removeListener: vi.fn(),
        }) as unknown as MediaQueryList
    );

    act(() => {
      result.current.updateResolvedTheme();
    });

    // Should still be light since we're not in system mode
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('setHasHydrated updates hydration state', async () => {
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    // Initial state may vary depending on persistence
    const initialHydrated = result.current.hasHydrated;

    act(() => {
      result.current.setHasHydrated(!initialHydrated);
    });

    expect(result.current.hasHydrated).toBe(!initialHydrated);
  });

  it('persists mode to localStorage', async () => {
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setMode('dark');
    });

    // Check that storage was updated
    expect(mockStorage['theme-storage']).toBeDefined();
    const stored = JSON.parse(mockStorage['theme-storage'] ?? '{}');
    expect(stored.state?.mode).toBe('dark');
  });

  it('applies dark class to documentElement when dark mode', async () => {
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setMode('dark');
    });

    expect(document.documentElement.classList.add).toHaveBeenCalledWith('dark');
  });

  it('removes dark class from documentElement when light mode', async () => {
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    // First set to dark
    act(() => {
      result.current.setMode('dark');
    });

    // Then set to light
    act(() => {
      result.current.setMode('light');
    });

    expect(document.documentElement.classList.remove).toHaveBeenCalledWith(
      'dark'
    );
  });

  it('adds theme-transition class during theme change', async () => {
    const { useThemeStore } = await import('./useThemeStore');

    const { result } = renderHook(() => useThemeStore());

    act(() => {
      result.current.setMode('dark');
    });

    expect(document.documentElement.classList.add).toHaveBeenCalledWith(
      'theme-transition'
    );
  });
});

describe('useThemeStore selector hooks', () => {
  beforeEach(async () => {
    vi.resetModules();

    // Setup mocks
    const mockStorage: Record<string, string> = {};
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      key => mockStorage[key] ?? null
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation((key, value) => {
      mockStorage[key] = value;
    });

    const mockMediaQueryList = {
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };
    window.matchMedia = vi.fn().mockImplementation(() => mockMediaQueryList);

    const mockClassList = {
      add: vi.fn(),
      remove: vi.fn(),
    };
    Object.defineProperty(document, 'documentElement', {
      value: { classList: mockClassList },
      configurable: true,
    });

    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('useResolvedTheme returns current resolved theme', async () => {
    const { useThemeStore, useResolvedTheme } = await import('./useThemeStore');

    const { result: storeResult } = renderHook(() => useThemeStore());
    const { result: selectorResult } = renderHook(() => useResolvedTheme());

    expect(selectorResult.current).toBe('light');

    act(() => {
      storeResult.current.setMode('dark');
    });

    const { result: updatedResult } = renderHook(() => useResolvedTheme());
    expect(updatedResult.current).toBe('dark');
  });

  it('useIsDark returns true when dark mode is active', async () => {
    const { useThemeStore, useIsDark } = await import('./useThemeStore');

    const { result: storeResult } = renderHook(() => useThemeStore());
    const { result: isDarkResult } = renderHook(() => useIsDark());

    expect(isDarkResult.current).toBe(false);

    act(() => {
      storeResult.current.setMode('dark');
    });

    const { result: updatedResult } = renderHook(() => useIsDark());
    expect(updatedResult.current).toBe(true);
  });

  it('useThemeHydrated returns hydration state', async () => {
    const { useThemeStore, useThemeHydrated } = await import('./useThemeStore');

    const { result: storeResult } = renderHook(() => useThemeStore());
    const { result: hydratedResult } = renderHook(() => useThemeHydrated());

    // Get initial state
    const initialHydrated = hydratedResult.current;

    // Toggle hydration
    act(() => {
      storeResult.current.setHasHydrated(!initialHydrated);
    });

    const { result: updatedResult } = renderHook(() => useThemeHydrated());
    expect(updatedResult.current).toBe(!initialHydrated);
  });
});
