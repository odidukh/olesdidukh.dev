import { describe, it, expect } from 'vitest';
import { categoryAdminSchema } from './schema';

const valid = {
  name: 'Behavioral',
  slug: 'behavioral',
  weight: 1,
  sort_order: 0,
};

describe('categoryAdminSchema', () => {
  it('accepts a valid category', () => {
    expect(categoryAdminSchema.safeParse(valid).success).toBe(true);
  });
  it('rejects an empty name', () => {
    const r = categoryAdminSchema.safeParse({ ...valid, name: '' });
    expect(r.success).toBe(false);
    expect(r.success === false && r.error.issues[0]?.message).toBe(
      'Name is required'
    );
  });
  it('rejects a non-URL-friendly slug', () => {
    expect(
      categoryAdminSchema.safeParse({ ...valid, slug: 'Not A Slug' }).success
    ).toBe(false);
  });
  it('rejects a negative weight', () => {
    expect(
      categoryAdminSchema.safeParse({ ...valid, weight: -1 }).success
    ).toBe(false);
  });
});
