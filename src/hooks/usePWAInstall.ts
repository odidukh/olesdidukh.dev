'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUIPreferencesStore } from '@/stores';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export interface UsePWAInstallReturn {
  /** Whether the PWA can be installed (prompt is available) */
  canInstall: boolean;
  /** Whether the app is already installed (running in standalone mode) */
  isInstalled: boolean;
  /** Whether the install prompt is currently showing */
  isPrompting: boolean;
  /** Trigger the install prompt */
  promptInstall: () => Promise<'accepted' | 'dismissed' | 'unavailable'>;
  /** Dismiss/hide the install banner */
  dismissBanner: () => void;
  /** Whether the user has dismissed the banner */
  isDismissed: boolean;
}

/**
 * Custom hook for managing PWA installation
 *
 * Features:
 * - Captures beforeinstallprompt event
 * - Provides install prompt trigger
 * - Tracks installation state
 * - Persists dismissal preference (via UIPreferencesStore)
 */
export function usePWAInstall(): UsePWAInstallReturn {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);

  // Use global store for dismissal state
  const { pwaInstallDismissed, dismissPWAInstall, shouldShowPWAInstall } =
    useUIPreferencesStore();

  const shouldShow = shouldShowPWAInstall();

  // Check if already installed (standalone mode)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      // iOS Safari
      ('standalone' in window.navigator &&
        (window.navigator as Navigator & { standalone: boolean }).standalone);

    setIsInstalled(isStandalone);
  }, []);

  // Capture the beforeinstallprompt event
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event for later use
      setDeferredPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) {
      return 'unavailable' as const;
    }

    setIsPrompting(true);

    try {
      // Show the install prompt
      await deferredPrompt.prompt();

      // Wait for user response
      const { outcome } = await deferredPrompt.userChoice;

      // Clear the deferred prompt regardless of outcome
      setDeferredPrompt(null);

      return outcome;
    } finally {
      setIsPrompting(false);
    }
  }, [deferredPrompt]);

  return {
    canInstall: !!deferredPrompt && !isInstalled && shouldShow,
    isInstalled,
    isPrompting,
    promptInstall,
    dismissBanner: dismissPWAInstall,
    isDismissed: pwaInstallDismissed && !shouldShow,
  };
}
