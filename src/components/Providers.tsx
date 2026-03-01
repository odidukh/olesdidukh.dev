'use client';

import dynamic from 'next/dynamic';
import { Toaster } from 'sonner';
import {
  PerformanceMonitor,
  GoogleAnalytics,
  MicrosoftClarity,
} from '@/components/analytics';
import { CommandMenu } from '@/components/ui/CommandMenu';
import { BackToTop } from '@/components/ui/BackToTop';

/**
 * Dynamically import Vercel analytics with SSR disabled and no loading state.
 * This prevents errors when scripts are blocked by ad blockers.
 */
const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(mod => mod.Analytics),
  { ssr: false }
);

const SpeedInsights = dynamic(
  () => import('@vercel/speed-insights/next').then(mod => mod.SpeedInsights),
  { ssr: false }
);

export function Providers() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <CommandMenu />
      <Analytics />
      <SpeedInsights />
      <GoogleAnalytics />
      <MicrosoftClarity />
      <PerformanceMonitor />
      <BackToTop />
    </>
  );
}
