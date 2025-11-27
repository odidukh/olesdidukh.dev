'use client';

import { useEffect } from 'react';
import { track } from '@vercel/analytics';

interface TrackPageViewProps {
  eventName: string;
  properties?: Record<string, string | number | boolean>;
}

export function TrackPageView({ eventName, properties }: TrackPageViewProps) {
  useEffect(() => {
    track(eventName, properties ?? {});
  }, [eventName, properties]);

  return null;
}
