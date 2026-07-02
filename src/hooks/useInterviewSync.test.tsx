// src/hooks/useInterviewSync.test.tsx
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const upsert = vi.fn();
vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({ from: () => ({ upsert }) }),
}));
vi.mock('sonner', () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

import { useInterviewSync } from './useInterviewSync';
import { useInterviewProgressStore } from '@/stores/useInterviewProgressStore';
import { toast } from 'sonner';

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  useInterviewProgressStore.setState({
    sessionId: 's1',
    entries: {},
    dirty: [],
  });
});
afterEach(() => vi.useRealTimers());

describe('useInterviewSync', () => {
  it('debounces, upserts dirty rows, and clears dirty on success', async () => {
    upsert.mockResolvedValue({ error: null });
    renderHook(() => useInterviewSync());

    act(() => {
      useInterviewProgressStore.getState().setConfidence('q1', 2);
    });
    expect(upsert).not.toHaveBeenCalled();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    expect(upsert).toHaveBeenCalledTimes(1);
    const [rows, opts] = upsert.mock.calls[0]!;
    expect(rows[0]).toMatchObject({
      session_id: 's1',
      question_id: 'q1',
      confidence: 2,
      status: 'learning',
    });
    expect(opts).toEqual({ onConflict: 'session_id,question_id' });
    expect(useInterviewProgressStore.getState().dirty).toEqual([]);
  });

  it('toasts and keeps rows dirty on failure', async () => {
    upsert.mockResolvedValue({ error: { message: 'nope' } });
    renderHook(() => useInterviewSync());

    act(() => {
      useInterviewProgressStore.getState().setConfidence('q1', 1);
    });
    await act(async () => {
      await vi.advanceTimersByTimeAsync(800);
    });

    expect(toast.error).toHaveBeenCalled();
    expect(useInterviewProgressStore.getState().dirty).toEqual(['q1']);
  });
});
