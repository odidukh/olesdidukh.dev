import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useMediaQuery } from './useMediaQuery';

describe('useMediaQuery', () => {
  let mockMediaQueryList: {
    matches: boolean;
    media: string;
    addEventListener: ReturnType<typeof vi.fn>;
    removeEventListener: ReturnType<typeof vi.fn>;
  };

  beforeEach(() => {
    mockMediaQueryList = {
      matches: false,
      media: '',
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      ...mockMediaQueryList,
      media: query,
    })) as unknown as typeof window.matchMedia;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns false initially when query does not match', () => {
    mockMediaQueryList.matches = false;

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(result.current).toBe(false);
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');
  });

  it('returns true when query matches', () => {
    mockMediaQueryList.matches = true;
    vi.mocked(window.matchMedia).mockImplementation((query: string) => ({
      ...mockMediaQueryList,
      matches: true,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
    }));

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(result.current).toBe(true);
  });

  it('adds event listener for changes', () => {
    renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('removes event listener on unmount', () => {
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    unmount();

    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('updates when media query changes', () => {
    mockMediaQueryList.matches = false;
    let changeHandler: ((event: MediaQueryListEvent) => void) | null = null;

    mockMediaQueryList.addEventListener = vi.fn((event, handler) => {
      if (event === 'change') {
        changeHandler = handler as (event: MediaQueryListEvent) => void;
      }
    });

    const { result } = renderHook(() => useMediaQuery('(min-width: 1024px)'));

    expect(result.current).toBe(false);

    // Simulate media query change
    act(() => {
      if (changeHandler) {
        changeHandler({ matches: true } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(true);

    // Simulate another change
    act(() => {
      if (changeHandler) {
        changeHandler({ matches: false } as MediaQueryListEvent);
      }
    });

    expect(result.current).toBe(false);
  });

  it('re-queries when query string changes', () => {
    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(min-width: 1024px)' },
    });

    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 1024px)');

    rerender({ query: '(min-width: 768px)' });

    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 768px)');
  });

  it('removes old listener and adds new one when query changes', () => {
    const { rerender } = renderHook(({ query }) => useMediaQuery(query), {
      initialProps: { query: '(min-width: 1024px)' },
    });

    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledTimes(1);

    rerender({ query: '(min-width: 768px)' });

    expect(mockMediaQueryList.removeEventListener).toHaveBeenCalled();
    expect(mockMediaQueryList.addEventListener).toHaveBeenCalledTimes(2);
  });

  it('works with different media query types', () => {
    const queries = [
      '(prefers-color-scheme: dark)',
      '(prefers-reduced-motion: reduce)',
      '(orientation: landscape)',
      '(hover: hover)',
    ];

    queries.forEach(query => {
      vi.mocked(window.matchMedia).mockClear();
      renderHook(() => useMediaQuery(query));
      expect(window.matchMedia).toHaveBeenCalledWith(query);
    });
  });

  it('handles multiple instances with different queries', () => {
    mockMediaQueryList.matches = false;

    const matchMediaCalls: string[] = [];
    vi.mocked(window.matchMedia).mockImplementation((query: string) => {
      matchMediaCalls.push(query);
      return {
        ...mockMediaQueryList,
        matches: query === '(min-width: 768px)',
        media: query,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      };
    });

    const { result: result1 } = renderHook(() =>
      useMediaQuery('(min-width: 1024px)')
    );
    const { result: result2 } = renderHook(() =>
      useMediaQuery('(min-width: 768px)')
    );

    expect(result1.current).toBe(false);
    expect(result2.current).toBe(true);
    expect(matchMediaCalls).toContain('(min-width: 1024px)');
    expect(matchMediaCalls).toContain('(min-width: 768px)');
  });
});
