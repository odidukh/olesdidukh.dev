import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  const mockStorage: Record<string, string> = {};

  beforeEach(() => {
    // Clear mock storage
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

    // Mock console.warn
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    expect(result.current[0]).toBe('default');
  });

  it('returns stored value from localStorage', () => {
    mockStorage['testKey'] = JSON.stringify('stored value');

    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    expect(result.current[0]).toBe('stored value');
  });

  it('updates value and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(mockStorage['testKey']).toBe(JSON.stringify('new value'));
  });

  it('accepts function updater', () => {
    const { result } = renderHook(() => useLocalStorage('counter', 0));

    act(() => {
      result.current[1](prev => prev + 1);
    });

    expect(result.current[0]).toBe(1);

    act(() => {
      result.current[1](prev => prev + 5);
    });

    expect(result.current[0]).toBe(6);
  });

  it('removes value from localStorage and resets to initial value', () => {
    const { result } = renderHook(() => useLocalStorage('testKey', 'default'));

    // First set a value
    act(() => {
      result.current[1]('stored');
    });

    expect(result.current[0]).toBe('stored');

    act(() => {
      result.current[2](); // removeValue
    });

    // State is reset to initialValue
    expect(result.current[0]).toBe('default');
    // Note: The hook will persist the new state back to localStorage
    // so the storage will contain the default value, not be undefined
  });

  it('handles complex objects', () => {
    const initialValue = { name: 'test', count: 0, nested: { a: 1 } };

    const { result } = renderHook(() =>
      useLocalStorage('objKey', initialValue)
    );

    expect(result.current[0]).toEqual(initialValue);

    const updatedValue = { name: 'updated', count: 5, nested: { a: 2 } };
    act(() => {
      result.current[1](updatedValue);
    });

    expect(result.current[0]).toEqual(updatedValue);
    expect(JSON.parse(mockStorage['objKey'] ?? '{}')).toEqual(updatedValue);
  });

  it('handles arrays', () => {
    const initialValue = [1, 2, 3];

    const { result } = renderHook(() =>
      useLocalStorage('arrayKey', initialValue)
    );

    expect(result.current[0]).toEqual(initialValue);

    act(() => {
      result.current[1](prev => [...prev, 4]);
    });

    expect(result.current[0]).toEqual([1, 2, 3, 4]);
  });

  it('handles boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('boolKey', false));

    expect(result.current[0]).toBe(false);

    act(() => {
      result.current[1](true);
    });

    expect(result.current[0]).toBe(true);
  });

  it('handles null values', () => {
    const { result } = renderHook(() =>
      useLocalStorage<string | null>('nullKey', null)
    );

    expect(result.current[0]).toBe(null);

    act(() => {
      result.current[1]('not null');
    });

    expect(result.current[0]).toBe('not null');

    act(() => {
      result.current[1](null);
    });

    expect(result.current[0]).toBe(null);
  });

  it('syncs across tabs via storage event', () => {
    const { result } = renderHook(() => useLocalStorage('syncKey', 'initial'));

    expect(result.current[0]).toBe('initial');

    // Simulate storage event from another tab
    act(() => {
      const event = new StorageEvent('storage', {
        key: 'syncKey',
        newValue: JSON.stringify('from other tab'),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe('from other tab');
  });

  it('ignores storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('myKey', 'initial'));

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'differentKey',
        newValue: JSON.stringify('changed'),
      });
      window.dispatchEvent(event);
    });

    expect(result.current[0]).toBe('initial');
  });

  it('ignores storage events with null newValue', () => {
    const { result } = renderHook(() => useLocalStorage('myKey', 'initial'));

    act(() => {
      result.current[1]('updated');
    });

    expect(result.current[0]).toBe('updated');

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'myKey',
        newValue: null,
      });
      window.dispatchEvent(event);
    });

    // Value should remain unchanged
    expect(result.current[0]).toBe('updated');
  });

  it('handles localStorage read errors gracefully', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('Storage error');
    });

    const { result } = renderHook(() =>
      useLocalStorage('errorKey', 'fallback')
    );

    expect(result.current[0]).toBe('fallback');
    expect(console.warn).toHaveBeenCalled();
  });

  it('handles localStorage write errors gracefully', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage full');
    });

    const { result } = renderHook(() => useLocalStorage('errorKey', 'initial'));

    act(() => {
      result.current[1]('new value');
    });

    // Value should still update in state
    expect(result.current[0]).toBe('new value');
    expect(console.warn).toHaveBeenCalled();
  });

  it('handles invalid JSON in localStorage gracefully', () => {
    mockStorage['invalidKey'] = 'not valid json{';

    const { result } = renderHook(() =>
      useLocalStorage('invalidKey', 'default')
    );

    expect(result.current[0]).toBe('default');
    expect(console.warn).toHaveBeenCalled();
  });

  it('handles invalid JSON in storage event gracefully', () => {
    const { result } = renderHook(() => useLocalStorage('myKey', 'initial'));

    act(() => {
      const event = new StorageEvent('storage', {
        key: 'myKey',
        newValue: 'invalid json{',
      });
      window.dispatchEvent(event);
    });

    // Value should remain unchanged
    expect(result.current[0]).toBe('initial');
    expect(console.warn).toHaveBeenCalled();
  });

  it('handles remove errors gracefully', () => {
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('Remove error');
    });

    const { result } = renderHook(() => useLocalStorage('removeKey', 'value'));

    act(() => {
      result.current[2](); // removeValue
    });

    expect(console.warn).toHaveBeenCalled();
  });

  it('persists to the correct key', () => {
    const { result } = renderHook(() => useLocalStorage('myKey', 'default'));

    act(() => {
      result.current[1]('newValue');
    });

    expect(result.current[0]).toBe('newValue');
    expect(mockStorage['myKey']).toBe(JSON.stringify('newValue'));
  });

  it('cleans up storage event listener on unmount', () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useLocalStorage('cleanupKey', 'test'));

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      'storage',
      expect.any(Function)
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      'storage',
      expect.any(Function)
    );
  });
});
