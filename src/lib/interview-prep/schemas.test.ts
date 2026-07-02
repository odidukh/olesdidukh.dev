import { describe, it, expect } from 'vitest';
import {
  tipSchema,
  difficultySchema,
  interviewerSchema,
  likelyTopicSchema,
} from './schemas';

describe('interview-prep schemas', () => {
  it('accepts a tip with a null detail', () => {
    expect(tipSchema.parse({ point: 'Measure first', detail: null })).toEqual({
      point: 'Measure first',
      detail: null,
    });
  });

  it('rejects a tip missing its point', () => {
    expect(tipSchema.safeParse({ detail: 'x' }).success).toBe(false);
  });

  it('accepts the three difficulty levels and rejects others', () => {
    expect(difficultySchema.parse('hard')).toBe('hard');
    expect(difficultySchema.safeParse('trivial').success).toBe(false);
  });

  it('validates an interviewer and a likely topic', () => {
    expect(
      interviewerSchema.parse({
        name: 'Harry',
        role: 'Founder',
        focus: 'depth',
      })
    ).toMatchObject({ name: 'Harry' });
    expect(
      likelyTopicSchema.parse({ topic: 'State', whereToDrill: 'Context' })
    ).toMatchObject({ whereToDrill: 'Context' });
  });
});
