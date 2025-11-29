import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type FontSize = 'small' | 'normal' | 'large';

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
  /** Whether PWA install banner was dismissed */
  pwaInstallDismissed: boolean;
  /** Timestamp when PWA install was dismissed */
  pwaInstallDismissedAt: number | null;

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
  /** Dismiss PWA install banner */
  dismissPWAInstall: () => void;
  /** Check if PWA install should be shown (after 7 days cooldown) */
  shouldShowPWAInstall: () => boolean;
  /** Reset all preferences to defaults */
  resetPreferences: () => void;
}

const initialState = {
  reducedMotion: false,
  compactLayout: false,
  fontSize: 'normal' as FontSize,
  sidebarCollapsed: false,
  showReadingProgress: true,
  pwaInstallDismissed: false,
  pwaInstallDismissedAt: null as number | null,
};

// 7 days in milliseconds
const PWA_DISMISS_COOLDOWN = 7 * 24 * 60 * 60 * 1000;

/**
 * Global UI preferences store using Zustand with localStorage persistence.
 *
 * Features:
 * - Persists user UI preferences
 * - Respects reduced motion preferences
 * - Controls layout and accessibility options
 * - Manages PWA install prompt dismissal
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
    (set, get) => ({
      ...initialState,

      setReducedMotion: reduced => set({ reducedMotion: reduced }),

      setCompactLayout: compact => set({ compactLayout: compact }),

      setFontSize: size => set({ fontSize: size }),

      toggleSidebar: () =>
        set(state => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: collapsed => set({ sidebarCollapsed: collapsed }),

      setShowReadingProgress: show => set({ showReadingProgress: show }),

      dismissPWAInstall: () =>
        set({
          pwaInstallDismissed: true,
          pwaInstallDismissedAt: Date.now(),
        }),

      shouldShowPWAInstall: () => {
        const state = get();
        if (!state.pwaInstallDismissed) return true;
        if (!state.pwaInstallDismissedAt) return true;

        const elapsed = Date.now() - state.pwaInstallDismissedAt;
        return elapsed > PWA_DISMISS_COOLDOWN;
      },

      resetPreferences: () =>
        set({
          reducedMotion: false,
          compactLayout: false,
          fontSize: 'normal',
          sidebarCollapsed: false,
          showReadingProgress: true,
          // Keep PWA dismissal state
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

export const usePWAInstallState = () =>
  useUIPreferencesStore(state => ({
    dismissed: state.pwaInstallDismissed,
    shouldShow: state.shouldShowPWAInstall(),
    dismiss: state.dismissPWAInstall,
  }));
