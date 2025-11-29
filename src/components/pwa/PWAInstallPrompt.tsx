'use client';

import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface PWAInstallPromptProps {
  /** Custom class name for the banner */
  className?: string;
}

/**
 * PWA Install Prompt Banner
 *
 * Shows a banner prompting users to install the PWA.
 * - Only shows when installation is available
 * - Respects user dismissal for 7 days
 * - Animated entrance and exit
 * - Accessible with proper ARIA attributes
 */
export function PWAInstallPrompt({ className }: PWAInstallPromptProps) {
  const { canInstall, isPrompting, promptInstall, dismissBanner } =
    usePWAInstall();

  const handleInstall = async () => {
    const outcome = await promptInstall();
    if (outcome === 'dismissed') {
      // User dismissed the native prompt, dismiss our banner too
      dismissBanner();
    }
  };

  return (
    <AnimatePresence>
      {canInstall && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          role="banner"
          aria-label="Install app prompt"
          className={cn(
            'fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:max-w-sm',
            className
          )}
        >
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-navy-700 dark:bg-navy-900">
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className="flex-shrink-0 rounded-full bg-mocha-100 p-2 dark:bg-mocha-900/30">
                <Smartphone className="h-5 w-5 text-mocha-600 dark:text-mocha-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  Install App
                </h3>
                <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Add this site to your home screen for quick access and offline
                  support.
                </p>

                {/* Actions */}
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleInstall}
                    loading={isPrompting}
                    loadingText="Installing..."
                    className="gap-1.5"
                  >
                    <Download className="h-3.5 w-3.5" />
                    Install
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={dismissBanner}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Not now
                  </Button>
                </div>
              </div>

              {/* Close button */}
              <button
                onClick={dismissBanner}
                className="flex-shrink-0 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-navy-800 dark:hover:text-gray-200"
                aria-label="Dismiss install prompt"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
