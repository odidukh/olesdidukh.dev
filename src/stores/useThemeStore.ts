import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  /** Whether dark mode is enabled */
  isDark: boolean;
  /** Whether the store has been hydrated from localStorage */
  hasHydrated: boolean;

  /** Toggle between light and dark mode */
  toggleTheme: () => void;
  /** Set theme explicitly */
  setTheme: (isDark: boolean) => void;
  /** Set hydrated state */
  setHasHydrated: (hydrated: boolean) => void;
}

/**
 * Global theme store using Zustand with localStorage persistence.
 *
 * @example
 * ```tsx
 * import { useThemeStore } from '@/stores/useThemeStore';
 *
 * function ThemeToggle() {
 *   const { isDark, toggleTheme } = useThemeStore();
 *   return (
 *     <button onClick={toggleTheme}>
 *       {isDark ? 'Light' : 'Dark'} Mode
 *     </button>
 *   );
 * }
 * ```
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    set => ({
      isDark: false,
      hasHydrated: false,

      toggleTheme: () =>
        set(state => {
          const newIsDark = !state.isDark;
          // Apply to DOM
          if (typeof document !== 'undefined') {
            if (newIsDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { isDark: newIsDark };
        }),

      setTheme: isDark =>
        set(() => {
          // Apply to DOM
          if (typeof document !== 'undefined') {
            if (isDark) {
              document.documentElement.classList.add('dark');
            } else {
              document.documentElement.classList.remove('dark');
            }
          }
          return { isDark };
        }),

      setHasHydrated: hydrated => set({ hasHydrated: hydrated }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => {
        // Handle SSR
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      partialize: state => ({ isDark: state.isDark }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Failed to rehydrate theme store:', error);
          return;
        }

        // Apply theme to DOM on rehydrate
        if (state?.isDark && typeof document !== 'undefined') {
          document.documentElement.classList.add('dark');
        }

        // Mark as hydrated
        if (state) {
          state.setHasHydrated(true);
        }
      },
    }
  )
);

/**
 * Hook to get only the isDark value without subscribing to other state changes.
 * This is useful for components that only need to know the theme.
 */
export const useIsDark = () => useThemeStore(state => state.isDark);

/**
 * Hook to check if the store has been hydrated from localStorage.
 * Useful for avoiding hydration mismatches.
 */
export const useThemeHydrated = () => useThemeStore(state => state.hasHydrated);
