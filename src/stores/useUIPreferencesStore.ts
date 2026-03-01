import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import type { FontSize } from '@/config/ui';

/** Supported locales */
type Locale = 'en' | 'uk' | 'pl';

interface UIPreferencesState {
  /** Whether to use reduced motion animations */
  reducedMotion: boolean;
  /** Whether to use compact layout */
  compactLayout: boolean;
  /** Font size preference */
  fontSize: FontSize;
  /** Whether sidebar/panel is collapsed */
  sidebarCollapsed: boolean;
  /** Whether to show reading progress indicator */
  showReadingProgress: boolean;
  /** Preferred locale/language */
  locale: Locale | null;

  /** Whether UI sounds are enabled */
  soundEnabled: boolean;

  /** Set reduced motion preference */
  setReducedMotion: (reduced: boolean) => void;
  /** Set compact layout preference */
  setCompactLayout: (compact: boolean) => void;
  /** Set font size preference */
  setFontSize: (size: FontSize) => void;
  /** Toggle sidebar collapsed state */
  toggleSidebar: () => void;
  /** Set sidebar collapsed state */
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** Set reading progress visibility */
  setShowReadingProgress: (show: boolean) => void;
  /** Set locale preference */
  setLocale: (locale: Locale | null) => void;
  /** Set sound enabled preference */
  setSoundEnabled: (enabled: boolean) => void;
  /** Reset all preferences to defaults */
  resetPreferences: () => void;
}

const initialState = {
  reducedMotion: false,
  compactLayout: false,
  fontSize: 'normal' as FontSize,
  sidebarCollapsed: false,
  showReadingProgress: true,
  locale: null as Locale | null,
  soundEnabled: false,
};

/**
 * Global UI preferences store using Zustand with localStorage persistence.
 *
 * Features:
 * - Persists user UI preferences
 * - Respects reduced motion preferences
 * - Controls layout and accessibility options
 * Invariants:
 * - fontSize is always one of: 'small' | 'normal' | 'large'
 * - locale is null (system default) or a valid Locale type
 *
 * @example
 * ```tsx
 * import { useUIPreferencesStore } from '@/stores/useUIPreferencesStore';
 *
 * function AccessibilitySettings() {
 *   const { reducedMotion, setReducedMotion, fontSize, setFontSize } =
 *     useUIPreferencesStore();
 *
 *   return (
 *     <div>
 *       <label>
 *         <input
 *           type="checkbox"
 *           checked={reducedMotion}
 *           onChange={(e) => setReducedMotion(e.target.checked)}
 *         />
 *         Reduce motion
 *       </label>
 *       <select
 *         value={fontSize}
 *         onChange={(e) => setFontSize(e.target.value as FontSize)}
 *       >
 *         <option value="small">Small</option>
 *         <option value="normal">Normal</option>
 *         <option value="large">Large</option>
 *       </select>
 *     </div>
 *   );
 * }
 * ```
 */
export const useUIPreferencesStore = create<UIPreferencesState>()(
  persist(
    set => ({
      ...initialState,

      setReducedMotion: reduced => set({ reducedMotion: reduced }),

      setCompactLayout: compact => set({ compactLayout: compact }),

      setFontSize: size => set({ fontSize: size }),

      toggleSidebar: () =>
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),

      setShowReadingProgress: show => set({ showReadingProgress: show }),

      setLocale: locale => set({ locale }),

      setSoundEnabled: enabled => set({ soundEnabled: enabled }),

      resetPreferences: () =>
        set({
          reducedMotion: false,
          compactLayout: false,
          fontSize: 'normal',
          sidebarCollapsed: false,
          showReadingProgress: true,
          locale: null,
          soundEnabled: false,
        }),
    }),
    {
      name: 'ui-preferences-storage',
      storage: createJSONStorage(() => {
        if (typeof window === 'undefined') {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
    }
  )
);

/**
 * Selector hooks for specific parts of the state
 */
export const useReducedMotionPreference = () =>
  useUIPreferencesStore(state => state.reducedMotion);

export const useCompactLayoutPreference = () =>
  useUIPreferencesStore(state => state.compactLayout);

export const useFontSizePreference = () =>
  useUIPreferencesStore(state => state.fontSize);

export const useLocalePreference = () =>
  useUIPreferencesStore(
    useShallow(state => ({
      locale: state.locale,
      setLocale: state.setLocale,
    }))
  );

export const useSoundPreference = () =>
  useUIPreferencesStore(
    useShallow(state => ({
      soundEnabled: state.soundEnabled,
      setSoundEnabled: state.setSoundEnabled,
    }))
  );

export type { Locale };
