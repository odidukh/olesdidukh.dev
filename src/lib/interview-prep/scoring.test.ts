import { describe, it, expect } from 'vitest';
import {
  categoryReadiness,
  overallReadiness,
  weakSpots,
  type ScoringCategory,
  type ScoringQuestion,
  type ScoringProgress,
} from './scoring';

const questions: ScoringQuestion[] = [
  { id: 'q1', categoryId: 'c1' },
  { id: 'q2', categoryId: 'c1' },
  { id: 'q3', categoryId: 'c2' },
];

describe('categoryReadiness', () => {
  it('treats a missing progress row as confidence 0', () => {
    const progress: ScoringProgress[] = [
      { questionId: 'q1', confidence: 3, timesSeen: 2 },
    ];
    // c1 has q1=3 and q2=missing(0): mean 1.5 / 3 = 0.5
    expect(categoryReadiness('c1', questions, progress)).toBeCloseTo(0.5);
  });

  it('returns 0 for a category with no questions', () => {
    expect(categoryReadiness('nope', questions, [])).toBe(0);
  });
});

describe('overallReadiness', () => {
  it('weights category readiness by category weight', () => {
    const categories: ScoringCategory[] = [
      { id: 'c1', weight: 1 },
      { id: 'c2', weight: 3 },
    ];
    const progress: ScoringProgress[] = [
      { questionId: 'q1', confidence: 3, timesSeen: 1 },
      { questionId: 'q2', confidence: 3, timesSeen: 1 },
      { questionId: 'q3', confidence: 0, timesSeen: 1 },
    ];
    // c1 readiness = 1.0 (weight 1), c2 readiness = 0.0 (weight 3)
    // weighted = (1*1 + 0*3) / (1+3) = 0.25
    expect(overallReadiness(categories, questions, progress)).toBeCloseTo(0.25);
  });

  it('returns 0 when no category has questions', () => {
    expect(overallReadiness([{ id: 'x', weight: 1 }], [], [])).toBe(0);
  });
});

describe('weakSpots', () => {
  it('includes unseen questions as confidence 0 and sorts weakest first', () => {
    const progress: ScoringProgress[] = [
      { questionId: 'q1', confidence: 1, timesSeen: 5 },
      { questionId: 'q2', confidence: 3, timesSeen: 1 },
    ];
    const result = weakSpots(questions, progress);
    // q3 (unseen, conf 0) first, then q1 (conf 1); q2 excluded (conf 3 > 1)
    expect(result.map(w => w.questionId)).toEqual(['q3', 'q1']);
  });

  it('respects the limit', () => {
    expect(weakSpots(questions, [], 1)).toHaveLength(1);
  });
});
