'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * Hook to sync state with localStorage
 *
 * Automatically persists state to localStorage and syncs across browser tabs.
 * Handles SSR safely by returning initial value on server.
 *
 * @param key - localStorage key
 * @param initialValue - Initial value if key doesn't exist
 * @returns Tuple of [value, setValue, removeValue]
 *
 * @example
 * ```tsx
 * function UserPreferences() {
 *   const [theme, setTheme, clearTheme] = useLocalStorage('theme', 'light');
 *
 *   return (
 *     <div>
 *       <button onClick={() => setTheme('dark')}>Dark Mode</button>
 *       <button onClick={() => setTheme('light')}>Light Mode</button>
 *       <button onClick={clearTheme}>Reset to Default</button>
 *     </div>
 *   );
 * }
 *
 * // With complex objects
 * interface Settings {
 *   notifications: boolean;
 *   language: string;
 * }
 *
 * function SettingsPanel() {
 *   const [settings, setSettings] = useLocalStorage<Settings>('settings', {
 *     notifications: true,
 *     language: 'en',
 *   });
 *
 *   return (
 *     <button onClick={() => setSettings(prev => ({ ...prev, notifications: !prev.notifications }))}>
 *       Toggle Notifications
 *     </button>
 *   );
 * }
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Get initial value from localStorage or use default
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Update localStorage when state changes
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen for changes in other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue !== null) {
        try {
          setStoredValue(JSON.parse(event.newValue) as T);
        } catch (error) {
          console.warn(`Error parsing localStorage value for "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setStoredValue, removeValue];
}
