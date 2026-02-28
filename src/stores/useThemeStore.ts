import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { captureException } from '@/lib/sentry';

type ThemeMode = 'light' | 'dark' | 'system';
export type ThemeAccent = 'mocha' | 'navy' | 'emerald' | 'rose' | 'amber';

interface ThemeState {
  /** The selected theme mode: light, dark, or system */
  mode: ThemeMode;
  /** The selected theme accent color */
  accent: ThemeAccent;
  /** The resolved theme (always light or dark, based on mode and system preference) */
  resolvedTheme: 'light' | 'dark';
  /** Whether the store has been hydrated from localStorage */
  hasHydrated: boolean;

  /** Set theme mode */
  setMode: (mode: ThemeMode) => void;
  /** Set theme accent */
  setAccent: (accent: ThemeAccent) => void;
  /** Toggle between light and dark (skips system) */
  toggleTheme: () => void;
  /** Update resolved theme based on system preference */
  updateResolvedTheme: () => void;
  /** Set hydrated state */
  setHasHydrated: (hydrated: boolean) => void;
}

/**
 * Get system preference for color scheme
 */
function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/**
 * Apply theme to DOM with smooth transition
 */
function applyTheme(theme: 'light' | 'dark', accent: ThemeAccent = 'mocha') {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Add transition class for smooth theme change
  root.classList.add('theme-transition');

  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Remove all previous accent classes
  root.classList.remove(
    'theme-mocha',
    'theme-navy',
    'theme-emerald',
    'theme-rose',
    'theme-amber'
  );
  // Add new accent class
  root.classList.add(`theme-${accent}`);

  // Remove transition class after animation completes
  // Using requestAnimationFrame to ensure the class is applied first
  requestAnimationFrame(() => {
    setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 300);
  });
}

/**
 * Global theme store using Zustand with localStorage persistence.
 *
 * Supports three modes:
 * - 'light': Always use light theme
 * - 'dark': Always use dark theme
 * - 'system': Follow system preference (prefers-color-scheme)
 *
 * Invariants:
 * - mode is always one of: 'light' | 'dark' | 'system'
 * - resolvedTheme is always 'light' or 'dark' (computed from mode + system preference)
 * - toggleTheme() cycles between light/dark directly, setting mode to the resolved value
 * - Theme changes apply a CSS transition class for 300ms smooth animation
 * - System preference changes are automatically tracked when mode is 'system'
 *
 * @example
 * ```tsx
 * import { useThemeStore } from '@/stores/useThemeStore';
 *
 * function ThemeToggle() {
 *   const { mode, setMode, resolvedTheme } = useThemeStore();
 *   return (
 *     <select value={mode} onChange={(e) => setMode(e.target.value as ThemeMode)}>
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *       <option value="system">System</option>
 *     </select>
 *   );
 * }
 * ```
 */
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      accent: 'mocha',
      resolvedTheme: 'light',
      hasHydrated: false,

      setMode: (mode: ThemeMode) => {
        const resolvedTheme = mode === 'system' ? getSystemPreference() : mode;
        applyTheme(resolvedTheme, get().accent);
        set({ mode, resolvedTheme });
      },

      setAccent: (accent: ThemeAccent) => {
        applyTheme(get().resolvedTheme, accent);
        set({ accent });
      },

      toggleTheme: () => {
        const { resolvedTheme, accent } = get();
        const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme, accent);
        set({ mode: newTheme, resolvedTheme: newTheme });
      },

      updateResolvedTheme: () => {
        const { mode, accent } = get();
        if (mode === 'system') {
          const resolvedTheme = getSystemPreference();
          applyTheme(resolvedTheme, accent);
          set({ resolvedTheme });
        }
      },

      setHasHydrated: (hydrated: boolean) => set({ hasHydrated: hydrated }),
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
      partialize: state => ({ mode: state.mode, accent: state.accent }),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          captureException(error, {
            store: 'useThemeStore',
            action: 'rehydrate',
          });
          return;
        }

        if (state) {
          // Calculate resolved theme
          const resolvedTheme =
            state.mode === 'system' ? getSystemPreference() : state.mode;
          state.resolvedTheme = resolvedTheme;

          // Only call applyTheme if the DOM doesn't already match.
          // The inline <script> in layout.tsx sets the correct dark/light class
          // before React hydrates, so calling applyTheme() unconditionally causes
          // a second class mutation that triggers the theme-transition animation
          // (the flash). We skip the full apply and only set the accent class.
          const domIsDark =
            typeof document !== 'undefined' &&
            document.documentElement.classList.contains('dark');
          const shouldBeDark = resolvedTheme === 'dark';

          if (domIsDark !== shouldBeDark) {
            // DOM is wrong — fix it (shouldn't happen normally)
            applyTheme(resolvedTheme, state.accent);
          } else {
            // DOM already has the right light/dark class — only apply accent
            if (typeof document !== 'undefined') {
              document.documentElement.classList.add(`theme-${state.accent}`);
            }
          }

          // Set up system preference listener
          if (typeof window !== 'undefined') {
            const mediaQuery = window.matchMedia(
              '(prefers-color-scheme: dark)'
            );
            const handleChange = () => {
              state.updateResolvedTheme();
            };
            mediaQuery.addEventListener('change', handleChange);
          }

          // Mark as hydrated
          state.setHasHydrated(true);
        }
      },
    }
  )
);

/**
 * Hook to get only the resolved theme (light or dark).
 * This is useful for components that only need to know the current theme.
 */
export const useResolvedTheme = () =>
  useThemeStore(state => state.resolvedTheme);

/**
 * Hook to check if dark mode is active (shorthand).
 */
export const useIsDark = () =>
  useThemeStore(state => state.resolvedTheme === 'dark');

/**
 * Hook to check if the store has been hydrated from localStorage.
 * Useful for avoiding hydration mismatches.
 */
export const useThemeHydrated = () => useThemeStore(state => state.hasHydrated);
