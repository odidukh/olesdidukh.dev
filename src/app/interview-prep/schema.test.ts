import { describe, it, expect } from 'vitest';
import { customQuestionSchema } from './schema';

describe('customQuestionSchema', () => {
  const valid = {
    question: 'What is hydration?',
    model_answer: null,
    category_id: null,
    difficulty: 'medium' as const,
  };

  it('accepts a valid custom question', () => {
    expect(customQuestionSchema.safeParse(valid).success).toBe(true);
  });

  it('requires a non-empty question', () => {
    expect(
      customQuestionSchema.safeParse({ ...valid, question: '' }).success
    ).toBe(false);
  });

  it('accepts a category id or null', () => {
    expect(
      customQuestionSchema.safeParse({ ...valid, category_id: 'c1' }).success
    ).toBe(true);
    expect(
      customQuestionSchema.safeParse({ ...valid, category_id: null }).success
    ).toBe(true);
  });

  it('rejects an unknown difficulty', () => {
    expect(
      customQuestionSchema.safeParse({ ...valid, difficulty: 'extreme' })
        .success
    ).toBe(false);
  });
});
