// src/hooks/useInterviewSync.ts
'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import {
  useInterviewProgressStore,
  type ProgressEntry,
} from '@/stores/useInterviewProgressStore';

const DEBOUNCE_MS = 800;

export function useInterviewSync(): void {
  const dirty = useInterviewProgressStore(state => state.dirty);
  const [supabase] = useState(() => createClient());
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (dirty.length === 0) return;
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(async () => {
      const state = useInterviewProgressStore.getState();
      if (!state.sessionId) return;
      const ids = [...state.dirty];
      const rows = ids
        .map(id => state.entries[id])
        .filter((e): e is ProgressEntry => Boolean(e))
        .map(e => ({
          session_id: state.sessionId as string,
          question_id: e.questionId,
          status: e.status,
          confidence: e.confidence,
          starred: e.starred,
          times_seen: e.timesSeen,
          last_reviewed_at: e.lastReviewedAt,
        }));
      if (rows.length === 0) return;

      const { error } = await supabase
        .from('interview_progress')
        .upsert(rows, { onConflict: 'session_id,question_id' });

      if (error) {
        toast.error('Could not save progress — will retry.');
        return; // leave ids dirty for the next debounce tick
      }
      state.clearDirty(ids);
    }, DEBOUNCE_MS);

    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, [dirty, supabase]);
}
