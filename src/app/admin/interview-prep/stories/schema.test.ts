import { describe, it, expect } from 'vitest';
import { storyAdminSchema } from './schema';

const valid = {
  title: 'Migration',
  slug: 'migration',
  company: null,
  situation: 's',
  task: 't',
  action: 'a',
  result: 'r',
  metrics: null,
  tags: ['react'],
  sort_order: 0,
};

describe('storyAdminSchema', () => {
  it('accepts a valid story', () => {
    expect(storyAdminSchema.safeParse(valid).success).toBe(true);
  });
  it('requires all four STAR fields', () => {
    for (const key of ['situation', 'task', 'action', 'result'] as const) {
      expect(storyAdminSchema.safeParse({ ...valid, [key]: '' }).success).toBe(
        false
      );
    }
  });
  it('allows null company and metrics', () => {
    expect(
      storyAdminSchema.safeParse({ ...valid, company: null, metrics: null })
        .success
    ).toBe(true);
  });
  it('rejects a non-URL-friendly slug', () => {
    expect(
      storyAdminSchema.safeParse({ ...valid, slug: 'Not A Slug' }).success
    ).toBe(false);
  });
  it('rejects a non-integer sort_order', () => {
    expect(
      storyAdminSchema.safeParse({ ...valid, sort_order: 1.5 }).success
    ).toBe(false);
  });
});
