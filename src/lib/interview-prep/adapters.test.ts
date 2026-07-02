import { describe, it, expect } from 'vitest';
import {
  toScoringCategories,
  toScoringQuestions,
  toScoringProgress,
} from './adapters';
import type {
  InterviewCategory,
  InterviewQuestion,
  InterviewProgress,
} from '@/lib/supabase/types';

const category = (over: Partial<InterviewCategory>): InterviewCategory => ({
  id: 'c1',
  name: 'System Design',
  slug: 'system-design',
  sort_order: 0,
  weight: 2,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  ...over,
});

const question = (over: Partial<InterviewQuestion>): InterviewQuestion => ({
  id: 'q1',
  category_id: 'c1',
  story_id: null,
  question: 'Explain X',
  model_answer: 'Y',
  tips: [],
  difficulty: 'medium',
  time_estimate_sec: 120,
  tags: [],
  is_custom: false,
  source: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  ...over,
});

const progress = (over: Partial<InterviewProgress>): InterviewProgress => ({
  id: 'p1',
  session_id: 's1',
  question_id: 'q1',
  status: 'learning',
  confidence: 2,
  starred: false,
  times_seen: 4,
  last_reviewed_at: null,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
  ...over,
});

describe('interview-prep adapters', () => {
  it('maps categories to {id, weight}', () => {
    expect(toScoringCategories([category({ id: 'c2', weight: 5 })])).toEqual([
      { id: 'c2', weight: 5 },
    ]);
  });

  it('maps questions to {id, categoryId}', () => {
    expect(
      toScoringQuestions([question({ id: 'q9', category_id: 'c3' })])
    ).toEqual([{ id: 'q9', categoryId: 'c3' }]);
  });

  it('maps progress to {questionId, confidence, timesSeen}', () => {
    expect(
      toScoringProgress([
        progress({ question_id: 'q9', confidence: 3, times_seen: 7 }),
      ])
    ).toEqual([{ questionId: 'q9', confidence: 3, timesSeen: 7 }]);
  });
});
