import { describe, it, expect } from 'vitest';
import { sessionAdminSchema } from './schema';

const valid = {
  slug: 'houston-round-2',
  company: 'Houston',
  role: 'Senior FE',
  round: 'Round 2',
  scheduled_at: null,
  status: 'upcoming' as const,
  product: null,
  interviewers: [{ name: 'Harry', role: 'Founder', focus: 'depth' }],
  likely_topics: [{ topic: 'Charts', whereToDrill: 'Technical' }],
  your_numbers: [{ label: 'LCP', value: '1.5s' }],
  bottom_line: null,
  stack_map: [{ theirTech: 'React', yourStanding: 'Expert' }],
  focus_category_ids: [] as string[],
};

describe('sessionAdminSchema', () => {
  it('accepts a valid session', () => {
    expect(sessionAdminSchema.safeParse(valid).success).toBe(true);
  });

  it('accepts a full session with all four arrays, a focus category uuid, and a scheduled time', () => {
    const full = {
      ...valid,
      scheduled_at: '2026-07-10T07:00:00Z',
      focus_category_ids: ['3f7b1a2e-4c5d-4e6f-8a9b-0c1d2e3f4a5b'],
    };
    expect(sessionAdminSchema.safeParse(full).success).toBe(true);
  });

  it('requires company/role/round', () => {
    for (const key of ['company', 'role', 'round'] as const) {
      expect(
        sessionAdminSchema.safeParse({ ...valid, [key]: '' }).success
      ).toBe(false);
    }
  });

  it('rejects a non-URL-friendly slug', () => {
    expect(
      sessionAdminSchema.safeParse({ ...valid, slug: 'Not A Slug!' }).success
    ).toBe(false);
  });

  it('rejects an empty company', () => {
    expect(
      sessionAdminSchema.safeParse({ ...valid, company: '' }).success
    ).toBe(false);
  });

  it('rejects an interviewer missing its name', () => {
    expect(
      sessionAdminSchema.safeParse({
        ...valid,
        interviewers: [{ name: '', role: 'x', focus: 'y' }],
      }).success
    ).toBe(false);
  });

  it('rejects an invalid status', () => {
    expect(
      sessionAdminSchema.safeParse({ ...valid, status: 'pending' }).success
    ).toBe(false);
  });
});
