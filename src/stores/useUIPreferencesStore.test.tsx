import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';

describe('useUIPreferencesStore', () => {
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
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    expect(result.current.reducedMotion).toBe(false);
    expect(result.current.compactLayout).toBe(false);
    expect(result.current.fontSize).toBe('normal');
    expect(result.current.sidebarCollapsed).toBe(false);
    expect(result.current.showReadingProgress).toBe(true);
    expect(result.current.locale).toBe(null);
  });

  it('setReducedMotion updates reduced motion preference', async () => {
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    act(() => {
      result.current.setReducedMotion(true);
    });

    expect(result.current.reducedMotion).toBe(true);

    act(() => {
      result.current.setReducedMotion(false);
    });

    expect(result.current.reducedMotion).toBe(false);
  });

  it('setCompactLayout updates compact layout preference', async () => {
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    act(() => {
      result.current.setCompactLayout(true);
    });

    expect(result.current.compactLayout).toBe(true);
  });

  it('setFontSize updates font size preference', async () => {
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    act(() => {
      result.current.setFontSize('large');
    });

    expect(result.current.fontSize).toBe('large');

    act(() => {
      result.current.setFontSize('small');
    });

    expect(result.current.fontSize).toBe('small');
  });

  it('toggleSidebar toggles sidebar collapsed state', async () => {
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    expect(result.current.sidebarCollapsed).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarCollapsed).toBe(true);

    act(() => {
      result.current.toggleSidebar();
    });

    expect(result.current.sidebarCollapsed).toBe(false);
  });

  it('setSidebarCollapsed sets sidebar state directly', async () => {
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    act(() => {
      result.current.setSidebarCollapsed(true);
    });

    expect(result.current.sidebarCollapsed).toBe(true);
  });

  it('setShowReadingProgress updates reading progress visibility', async () => {
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    act(() => {
      result.current.setShowReadingProgress(false);
    });

    expect(result.current.showReadingProgress).toBe(false);
  });

  it('setLocale updates locale preference', async () => {
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    act(() => {
      result.current.setLocale('uk');
    });

    expect(result.current.locale).toBe('uk');

    act(() => {
      result.current.setLocale('pl');
    });

    expect(result.current.locale).toBe('pl');

    act(() => {
      result.current.setLocale(null);
    });

    expect(result.current.locale).toBe(null);
  });

  it('resetPreferences resets all preferences to defaults', async () => {
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    act(() => {
      result.current.setReducedMotion(true);
      result.current.setCompactLayout(true);
      result.current.setFontSize('large');
      result.current.setSidebarCollapsed(true);
      result.current.setShowReadingProgress(false);
      result.current.setLocale('uk');
    });

    act(() => {
      result.current.resetPreferences();
    });

    expect(result.current.reducedMotion).toBe(false);
    expect(result.current.compactLayout).toBe(false);
    expect(result.current.fontSize).toBe('normal');
    expect(result.current.sidebarCollapsed).toBe(false);
    expect(result.current.showReadingProgress).toBe(true);
    expect(result.current.locale).toBe(null);
  });

  it('persists preferences to localStorage', async () => {
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    act(() => {
      result.current.setReducedMotion(true);
      result.current.setFontSize('large');
      result.current.setLocale('uk');
    });

    expect(mockStorage['ui-preferences-storage']).toBeDefined();
    const stored = JSON.parse(mockStorage['ui-preferences-storage'] ?? '{}');

    expect(stored.state?.reducedMotion).toBe(true);
    expect(stored.state?.fontSize).toBe('large');
    expect(stored.state?.locale).toBe('uk');
  });
});

describe('useUIPreferencesStore selector hooks', () => {
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

  it('useReducedMotionPreference returns reduced motion setting', async () => {
    const { useUIPreferencesStore, useReducedMotionPreference } =
      await import('./useUIPreferencesStore');

    const { result: storeResult } = renderHook(() => useUIPreferencesStore());
    const { result: selectorResult } = renderHook(() =>
      useReducedMotionPreference()
    );

    expect(selectorResult.current).toBe(false);

    act(() => {
      storeResult.current.setReducedMotion(true);
    });

    const { result: updatedResult } = renderHook(() =>
      useReducedMotionPreference()
    );
    expect(updatedResult.current).toBe(true);
  });

  it('useCompactLayoutPreference returns compact layout setting', async () => {
    const { useUIPreferencesStore, useCompactLayoutPreference } =
      await import('./useUIPreferencesStore');

    const { result: storeResult } = renderHook(() => useUIPreferencesStore());
    const { result: selectorResult } = renderHook(() =>
      useCompactLayoutPreference()
    );

    expect(selectorResult.current).toBe(false);

    act(() => {
      storeResult.current.setCompactLayout(true);
    });

    const { result: updatedResult } = renderHook(() =>
      useCompactLayoutPreference()
    );
    expect(updatedResult.current).toBe(true);
  });

  it('useFontSizePreference returns font size setting', async () => {
    const { useUIPreferencesStore, useFontSizePreference } =
      await import('./useUIPreferencesStore');

    const { result: storeResult } = renderHook(() => useUIPreferencesStore());
    const { result: selectorResult } = renderHook(() =>
      useFontSizePreference()
    );

    expect(selectorResult.current).toBe('normal');

    act(() => {
      storeResult.current.setFontSize('large');
    });

    const { result: updatedResult } = renderHook(() => useFontSizePreference());
    expect(updatedResult.current).toBe('large');
  });

  it('useLocalePreference returns locale state', async () => {
    const { useUIPreferencesStore } = await import('./useUIPreferencesStore');

    const { result } = renderHook(() => useUIPreferencesStore());

    expect(result.current.locale).toBe(null);

    act(() => {
      result.current.setLocale('uk');
    });

    expect(result.current.locale).toBe('uk');
  });
});
