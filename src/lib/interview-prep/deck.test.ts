import { describe, it, expect } from 'vitest';
import {
  shuffle,
  pickRandom,
  buildSmartSession,
  summarizeSession,
} from './deck';
import {
  defaultEntry,
  type ProgressEntry,
} from '@/stores/useInterviewProgressStore';
import type { InterviewQuestion } from '@/lib/supabase/types';

const q = (
  id: string,
  category_id: string | null = 'c1'
): InterviewQuestion => ({
  id,
  category_id,
  story_id: null,
  question: `Q ${id}`,
  model_answer: null,
  tips: [],
  difficulty: 'medium',
  time_estimate_sec: null,
  tags: [],
  is_custom: false,
  source: null,
  created_at: 'x',
  updated_at: 'x',
});

const entry = (id: string, over: Partial<ProgressEntry>): ProgressEntry => ({
  ...defaultEntry(id),
  ...over,
});

const asEntries = (list: ProgressEntry[]): Record<string, ProgressEntry> =>
  Object.fromEntries(list.map(e => [e.questionId, e]));

describe('deck util', () => {
  it('shuffle preserves length and membership', () => {
    const input = ['a', 'b', 'c', 'd'];
    const out = shuffle(input);
    expect(out).toHaveLength(4);
    expect([...out].sort()).toEqual(['a', 'b', 'c', 'd']);
    expect(input).toEqual(['a', 'b', 'c', 'd']); // input not mutated
  });

  it('pickRandom caps at count and never returns more than available', () => {
    expect(pickRandom(['a', 'b', 'c', 'd', 'e'], 3)).toHaveLength(3);
    expect(pickRandom(['a', 'b'], 5)).toHaveLength(2);
    expect(pickRandom(['a', 'b'], -1)).toHaveLength(0);
  });
});

describe('buildSmartSession', () => {
  it('orders weakest confidence first, then oldest review, then least seen', () => {
    const questions = [q('a'), q('b'), q('c'), q('d')];
    const entries = asEntries([
      entry('a', { confidence: 3 }), // known -> sinks to last
      entry('b', {
        confidence: 0,
        lastReviewedAt: '2026-01-02T00:00:00Z',
        timesSeen: 2,
      }),
      entry('c', { confidence: 0, lastReviewedAt: null, timesSeen: 5 }), // never reviewed -> before b
      entry('d', { confidence: 1 }),
    ]);
    expect(buildSmartSession(questions, entries, { size: 10 })).toEqual([
      'c',
      'b',
      'd',
      'a',
    ]);
  });

  it('uses timesSeen as the tiebreak when confidence and review time match', () => {
    const questions = [q('a'), q('b')];
    const entries = asEntries([
      entry('a', { confidence: 0, timesSeen: 4 }),
      entry('b', { confidence: 0, timesSeen: 1 }),
    ]);
    expect(buildSmartSession(questions, entries, { size: 10 })).toEqual([
      'b',
      'a',
    ]);
  });

  it('keeps original order when everything ties (all unseen)', () => {
    const questions = [q('a'), q('b'), q('c')];
    expect(buildSmartSession(questions, {}, { size: 10 })).toEqual([
      'a',
      'b',
      'c',
    ]);
  });

  it('caps the deck at size', () => {
    const questions = [q('a'), q('b'), q('c')];
    expect(buildSmartSession(questions, {}, { size: 2 })).toHaveLength(2);
  });

  it('filters by category before ordering', () => {
    const questions = [q('a', 'c1'), q('b', 'c2'), q('c', 'c1')];
    expect(
      buildSmartSession(questions, {}, { size: 10, categoryId: 'c1' })
    ).toEqual(['a', 'c']);
  });

  it('weakOnly keeps only effective confidence <= 1', () => {
    const questions = [q('a'), q('b'), q('c')];
    const entries = asEntries([
      entry('a', { confidence: 2 }),
      entry('b', { confidence: 1 }),
      // c unseen -> effective confidence 0
    ]);
    expect(
      buildSmartSession(questions, entries, { size: 10, weakOnly: true })
    ).toEqual(['c', 'b']);
  });

  it('returns [] for an empty pool or size 0', () => {
    expect(buildSmartSession([], {}, { size: 10 })).toEqual([]);
    expect(buildSmartSession([q('a')], {}, { size: 0 })).toEqual([]);
  });
});

describe('summarizeSession', () => {
  it('buckets improved / unchanged / dropped and lists still-shaky ids', () => {
    const start = { a: 0, b: 2, c: 1, d: 3 };
    const entries = asEntries([
      entry('a', { confidence: 2 }), // 0 -> 2 improved
      entry('b', { confidence: 2 }), // 2 -> 2 unchanged
      entry('c', { confidence: 0 }), // 1 -> 0 dropped, shaky
      entry('d', { confidence: 1 }), // 3 -> 1 dropped, shaky
    ]);
    expect(summarizeSession(start, entries)).toEqual({
      improved: 1,
      unchanged: 1,
      dropped: 2,
      stillShaky: ['c', 'd'],
    });
  });

  it('treats a missing entry as confidence 0', () => {
    const start = { a: 2 };
    expect(summarizeSession(start, {})).toEqual({
      improved: 0,
      unchanged: 0,
      dropped: 1,
      stillShaky: ['a'],
    });
  });
});
