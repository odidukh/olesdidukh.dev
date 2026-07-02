import { create } from 'zustand';
import type { ScoringProgress } from '@/lib/interview-prep/scoring';
import type { InterviewProgress } from '@/lib/supabase/types';

export interface ProgressEntry {
  questionId: string;
  status: 'new' | 'learning' | 'known';
  confidence: number; // 0..3
  starred: boolean;
  timesSeen: number;
  lastReviewedAt: string | null;
}

export function statusFor(confidence: number): ProgressEntry['status'] {
  if (confidence >= 3) return 'known';
  if (confidence >= 1) return 'learning';
  return 'new';
}

export function defaultEntry(questionId: string): ProgressEntry {
  return {
    questionId,
    status: 'new',
    confidence: 0,
    starred: false,
    timesSeen: 0,
    lastReviewedAt: null,
  };
}

export function toProgressEntries(rows: InterviewProgress[]): ProgressEntry[] {
  return rows.map(r => ({
    questionId: r.question_id,
    status: r.status,
    confidence: r.confidence,
    starred: r.starred,
    timesSeen: r.times_seen,
    lastReviewedAt: r.last_reviewed_at,
  }));
}

function markDirty(dirty: string[], id: string): string[] {
  return dirty.includes(id) ? dirty : [...dirty, id];
}

interface InterviewProgressState {
  sessionId: string | null;
  entries: Record<string, ProgressEntry>;
  dirty: string[];
  hydrate: (sessionId: string, entries: ProgressEntry[]) => void;
  entryFor: (questionId: string) => ProgressEntry;
  setConfidence: (questionId: string, confidence: number) => void;
  toggleStar: (questionId: string) => void;
  markSeen: (questionId: string) => void;
  clearDirty: (questionIds: string[]) => void;
  resetAll: () => void;
}

export const useInterviewProgressStore = create<InterviewProgressState>(
  (set, get) => ({
    sessionId: null,
    entries: {},
    dirty: [],

    hydrate: (sessionId, entries) =>
      set({
        sessionId,
        entries: Object.fromEntries(entries.map(e => [e.questionId, e])),
        dirty: [],
      }),

    entryFor: questionId =>
      get().entries[questionId] ?? defaultEntry(questionId),

    setConfidence: (questionId, confidence) =>
      set(state => {
        const clamped = Math.max(0, Math.min(3, Math.round(confidence)));
        const current = state.entries[questionId] ?? defaultEntry(questionId);
        const updated: ProgressEntry = {
          ...current,
          confidence: clamped,
          status: statusFor(clamped),
        };
        return {
          entries: { ...state.entries, [questionId]: updated },
          dirty: markDirty(state.dirty, questionId),
        };
      }),

    toggleStar: questionId =>
      set(state => {
        const current = state.entries[questionId] ?? defaultEntry(questionId);
        const updated: ProgressEntry = {
          ...current,
          starred: !current.starred,
        };
        return {
          entries: { ...state.entries, [questionId]: updated },
          dirty: markDirty(state.dirty, questionId),
        };
      }),

    markSeen: questionId =>
      set(state => {
        const current = state.entries[questionId] ?? defaultEntry(questionId);
        const updated: ProgressEntry = {
          ...current,
          timesSeen: current.timesSeen + 1,
          lastReviewedAt: new Date().toISOString(),
        };
        return {
          entries: { ...state.entries, [questionId]: updated },
          dirty: markDirty(state.dirty, questionId),
        };
      }),

    clearDirty: questionIds =>
      set(state => ({
        dirty: state.dirty.filter(id => !questionIds.includes(id)),
      })),

    resetAll: () => set({ entries: {}, dirty: [] }),
  })
);

export function selectScoringProgress(
  state: Pick<InterviewProgressState, 'entries'>
): ScoringProgress[] {
  return Object.values(state.entries).map(e => ({
    questionId: e.questionId,
    confidence: e.confidence,
    timesSeen: e.timesSeen,
  }));
}
