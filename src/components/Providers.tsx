'use client';

import { Toaster } from 'sonner';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import {
  PerformanceMonitor,
  GoogleAnalytics,
  MicrosoftClarity,
} from '@/components/analytics';

export function Providers() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Analytics />
      <SpeedInsights />
      <GoogleAnalytics />
      <MicrosoftClarity />
      <PerformanceMonitor />
    </>
  );
}
