import { describe, it, expect } from 'vitest';
import { questionAdminSchema } from './schema';

const valid = {
  question: 'Tell me about yourself.',
  model_answer: null,
  category_id: null,
  story_id: null,
  difficulty: 'medium' as const,
  time_estimate_sec: null,
  tags: [],
  tips: [{ point: 'Keep it 60-90s', detail: null }],
  is_custom: false,
  source: null,
};

describe('questionAdminSchema', () => {
  it('accepts a valid question', () => {
    expect(questionAdminSchema.safeParse(valid).success).toBe(true);
  });
  it('requires a question body', () => {
    const r = questionAdminSchema.safeParse({ ...valid, question: '' });
    expect(r.success === false && r.error.issues[0]?.message).toBe(
      'Question is required'
    );
  });
  it('rejects an invalid difficulty', () => {
    expect(
      questionAdminSchema.safeParse({ ...valid, difficulty: 'trivial' }).success
    ).toBe(false);
  });
  it('rejects a tip missing its point', () => {
    expect(
      questionAdminSchema.safeParse({
        ...valid,
        tips: [{ point: '', detail: null }],
      }).success
    ).toBe(false);
  });
  it('accepts a null category and story', () => {
    expect(
      questionAdminSchema.safeParse({
        ...valid,
        category_id: null,
        story_id: null,
      }).success
    ).toBe(true);
  });
});
