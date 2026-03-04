import { createJSONStorage } from 'zustand/middleware';
import { captureException } from '@/lib/sentry';

/**
 * SSR-safe localStorage wrapper for Zustand persist middleware.
 * Returns a no-op storage on the server to prevent hydration errors.
 */
export function createSSRSafeStorage() {
  return createJSONStorage(() => {
    if (typeof window === 'undefined') {
      return {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      };
    }
    return localStorage;
  });
}

/**
 * Standard rehydration error handler for Zustand stores.
 * Captures the exception with the store name for debugging.
 */
export function createRehydrateHandler<T>(storeName: string) {
  return () => (_state: T | undefined, error?: unknown) => {
    if (error) {
      captureException(error, {
        store: storeName,
        action: 'rehydrate',
      });
    }
  };
}
