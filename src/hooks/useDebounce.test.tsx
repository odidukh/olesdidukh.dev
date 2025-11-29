import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('returns debounced value after delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    expect(result.current).toBe('initial');

    // Update the value
    rerender({ value: 'updated', delay: 500 });

    // Value should still be initial before delay
    expect(result.current).toBe('initial');

    // Advance timers
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now it should be updated
    expect(result.current).toBe('updated');
  });

  it('resets timer when value changes before delay completes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // First update
    rerender({ value: 'first', delay: 500 });

    // Advance partway through delay
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Value should still be initial
    expect(result.current).toBe('initial');

    // Second update - should reset timer
    rerender({ value: 'second', delay: 500 });

    // Advance another 300ms (total 600ms from first, 300ms from second)
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Value should still be initial because timer was reset
    expect(result.current).toBe('initial');

    // Advance remaining 200ms
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Now it should show the second value
    expect(result.current).toBe('second');
  });

  it('updates when delay changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    rerender({ value: 'updated', delay: 500 });

    // Change the delay to shorter
    rerender({ value: 'updated', delay: 100 });

    // Advance by the new shorter delay
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(result.current).toBe('updated');
  });

  it('works with different types', () => {
    // Test with number
    const { result: numberResult, rerender: rerenderNumber } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 42, delay: 100 } }
    );

    expect(numberResult.current).toBe(42);
    rerenderNumber({ value: 100, delay: 100 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(numberResult.current).toBe(100);

    // Test with object
    const initialObj = { name: 'test' };
    const { result: objResult, rerender: rerenderObj } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: initialObj, delay: 100 } }
    );

    expect(objResult.current).toBe(initialObj);

    const updatedObj = { name: 'updated' };
    rerenderObj({ value: updatedObj, delay: 100 });

    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(objResult.current).toBe(updatedObj);
  });

  it('cleans up timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');

    const { unmount, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 500 } }
    );

    // Trigger a timeout to be set
    rerender({ value: 'updated', delay: 500 });

    unmount();

    // clearTimeout should have been called during cleanup
    expect(clearTimeoutSpy).toHaveBeenCalled();

    clearTimeoutSpy.mockRestore();
  });

  it('handles zero delay', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'initial', delay: 0 } }
    );

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 0 });

    act(() => {
      vi.advanceTimersByTime(0);
    });

    expect(result.current).toBe('updated');
  });

  it('handles rapid value changes', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'a', delay: 100 } }
    );

    // Rapid changes
    rerender({ value: 'b', delay: 100 });
    rerender({ value: 'c', delay: 100 });
    rerender({ value: 'd', delay: 100 });
    rerender({ value: 'e', delay: 100 });

    // Value should still be initial
    expect(result.current).toBe('a');

    // Advance past delay
    act(() => {
      vi.advanceTimersByTime(100);
    });

    // Should only show the last value
    expect(result.current).toBe('e');
  });
});
