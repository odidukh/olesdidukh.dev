'use client';

import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import {
  PerformanceMonitor,
  GoogleAnalytics,
  MicrosoftClarity,
} from '@/components/analytics';
import { PWAInstallPrompt } from '@/components/pwa';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

/**
 * Silent error fallback for analytics - we don't want to show errors
 * when analytics scripts are blocked by ad blockers
 */
function AnalyticsErrorFallback() {
  return null;
}

export function Providers() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      {/* Wrap analytics in error boundary to handle ad blocker failures gracefully */}
      <ErrorBoundary fallback={<AnalyticsErrorFallback />}>
        <Suspense fallback={null}>
          <Analytics />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<AnalyticsErrorFallback />}>
        <Suspense fallback={null}>
          <SpeedInsights />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<AnalyticsErrorFallback />}>
        <GoogleAnalytics />
      </ErrorBoundary>
      <ErrorBoundary fallback={<AnalyticsErrorFallback />}>
        <MicrosoftClarity />
      </ErrorBoundary>
      <ErrorBoundary fallback={<AnalyticsErrorFallback />}>
        <PerformanceMonitor />
      </ErrorBoundary>
      <PWAInstallPrompt />
    </>
  );
}
