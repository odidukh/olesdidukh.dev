// src/lib/interview-prep/data.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { InterviewCategory, InterviewSession } from '@/lib/supabase/types';

const rows: Record<string, unknown[]> = {};

// A minimal thenable query builder that records the table and resolves rows.
function makeClient() {
  return {
    from(table: string) {
      const builder: Record<string, unknown> = {
        _rows: rows[table] ?? [],
        select() {
          return builder;
        },
        order() {
          return builder;
        },
        eq(_col: string, value: string) {
          builder['_rows'] = (rows[table] ?? []).filter(
            r =>
              (r as Record<string, unknown>)['slug'] === value ||
              (r as Record<string, unknown>)['session_id'] === value
          );
          return builder;
        },
        maybeSingle() {
          return Promise.resolve({
            data: (builder['_rows'] as unknown[])[0] ?? null,
            error: null,
          });
        },
        then(resolve: (v: { data: unknown[]; error: null }) => void) {
          resolve({ data: builder['_rows'] as unknown[], error: null });
        },
      };
      return builder;
    },
  };
}

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(async () => makeClient()),
}));

import { getCategories, getSessionBySlug, getProgressForSession } from './data';

describe('interview-prep data layer', () => {
  beforeEach(() => {
    for (const key of Object.keys(rows)) delete rows[key];
  });

  it('returns categories', async () => {
    rows['interview_categories'] = [
      { id: 'c1', name: 'Behavioral', slug: 'behavioral' },
    ] satisfies Partial<InterviewCategory>[];
    const result = await getCategories();
    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe('behavioral');
  });

  it('returns a single session by slug or null', async () => {
    rows['interview_sessions'] = [
      { id: 's1', slug: 'houston-systems-round-2', company: 'Houston Systems' },
    ] satisfies Partial<InterviewSession>[];
    expect((await getSessionBySlug('houston-systems-round-2'))?.company).toBe(
      'Houston Systems'
    );
    expect(await getSessionBySlug('missing')).toBeNull();
  });

  it('filters progress by session id', async () => {
    rows['interview_progress'] = [
      { id: 'p1', session_id: 's1', question_id: 'q1' },
      { id: 'p2', session_id: 's2', question_id: 'q2' },
    ];
    const result = await getProgressForSession('s1');
    expect(result).toHaveLength(1);
    expect(result[0]?.id).toBe('p1');
  });
});
