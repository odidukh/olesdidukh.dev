import { describe, it, expect, beforeEach } from 'vitest';
import {
  useInterviewProgressStore,
  statusFor,
  defaultEntry,
  toProgressEntries,
  selectScoringProgress,
  type ProgressEntry,
} from './useInterviewProgressStore';
import type { InterviewProgress } from '@/lib/supabase/types';

const reset = () =>
  useInterviewProgressStore.setState({
    sessionId: null,
    entries: {},
    dirty: [],
  });

beforeEach(reset);

describe('statusFor', () => {
  it('maps confidence to status (0→new, 1-2→learning, 3→known)', () => {
    expect(statusFor(0)).toBe('new');
    expect(statusFor(1)).toBe('learning');
    expect(statusFor(2)).toBe('learning');
    expect(statusFor(3)).toBe('known');
  });
});

describe('useInterviewProgressStore', () => {
  it('hydrates entries keyed by questionId and clears dirty', () => {
    const entries: ProgressEntry[] = [
      { ...defaultEntry('q1'), confidence: 2, status: 'learning' },
    ];
    useInterviewProgressStore.getState().hydrate('s1', entries);
    const state = useInterviewProgressStore.getState();
    expect(state.sessionId).toBe('s1');
    expect(state.entries['q1']?.confidence).toBe(2);
    expect(state.dirty).toEqual([]);
  });

  it('entryFor returns a default for an unknown question', () => {
    expect(useInterviewProgressStore.getState().entryFor('nope')).toEqual(
      defaultEntry('nope')
    );
  });

  it('setConfidence clamps, updates status, and marks dirty', () => {
    useInterviewProgressStore.getState().setConfidence('q1', 5);
    const entry = useInterviewProgressStore.getState().entries['q1'];
    expect(entry?.confidence).toBe(3);
    expect(entry?.status).toBe('known');
    expect(useInterviewProgressStore.getState().dirty).toEqual(['q1']);
  });

  it('toggleStar flips starred and marks dirty without duplicating', () => {
    const store = useInterviewProgressStore.getState();
    store.toggleStar('q1');
    store.toggleStar('q1');
    const entry = useInterviewProgressStore.getState().entries['q1'];
    expect(entry?.starred).toBe(false);
    expect(useInterviewProgressStore.getState().dirty).toEqual(['q1']);
  });

  it('markSeen increments timesSeen and stamps lastReviewedAt', () => {
    useInterviewProgressStore.getState().markSeen('q1');
    const entry = useInterviewProgressStore.getState().entries['q1'];
    expect(entry?.timesSeen).toBe(1);
    expect(entry?.lastReviewedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  it('clearDirty removes the given ids only', () => {
    const store = useInterviewProgressStore.getState();
    store.setConfidence('q1', 1);
    store.setConfidence('q2', 1);
    store.clearDirty(['q1']);
    expect(useInterviewProgressStore.getState().dirty).toEqual(['q2']);
  });

  it('resetAll clears entries and dirty', () => {
    const store = useInterviewProgressStore.getState();
    store.setConfidence('q1', 2);
    store.resetAll();
    const state = useInterviewProgressStore.getState();
    expect(state.entries).toEqual({});
    expect(state.dirty).toEqual([]);
  });
});

describe('toProgressEntries + selectScoringProgress', () => {
  it('maps DB rows to entries', () => {
    const rows: InterviewProgress[] = [
      {
        id: 'p1',
        session_id: 's1',
        question_id: 'q1',
        status: 'known',
        confidence: 3,
        starred: true,
        times_seen: 5,
        last_reviewed_at: '2026-01-02T00:00:00Z',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: '2026-01-01T00:00:00Z',
      },
    ];
    expect(toProgressEntries(rows)).toEqual([
      {
        questionId: 'q1',
        status: 'known',
        confidence: 3,
        starred: true,
        timesSeen: 5,
        lastReviewedAt: '2026-01-02T00:00:00Z',
      },
    ]);
  });

  it('selectScoringProgress projects entries to the scoring shape', () => {
    useInterviewProgressStore
      .getState()
      .hydrate('s1', [{ ...defaultEntry('q1'), confidence: 3, timesSeen: 2 }]);
    expect(selectScoringProgress(useInterviewProgressStore.getState())).toEqual(
      [{ questionId: 'q1', confidence: 3, timesSeen: 2 }]
    );
  });
});
