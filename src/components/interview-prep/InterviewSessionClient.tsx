'use client';

import { useState } from 'react';
import type { InterviewProgress } from '@/lib/supabase/types';
import {
  useInterviewProgressStore,
  toProgressEntries,
} from '@/stores/useInterviewProgressStore';
import { useInterviewSync } from '@/hooks/useInterviewSync';

export interface InterviewSessionClientProps {
  sessionId: string;
  initialProgress: InterviewProgress[];
  children: React.ReactNode;
}

export function InterviewSessionClient({
  sessionId,
  initialProgress,
  children,
}: InterviewSessionClientProps) {
  // Hydrate exactly once per mount. The layout keys this component by
  // sessionId, so switching sessions remounts and re-hydrates cleanly.
  useState(() => {
    useInterviewProgressStore
      .getState()
      .hydrate(sessionId, toProgressEntries(initialProgress));
    return true;
  });

  useInterviewSync();

  return <>{children}</>;
}
