import { describe, it, expect } from 'vitest';
import { HOUSTON_SESSION, sessionSeedSchema } from './houston-session';

describe('HOUSTON_SESSION', () => {
  it('is a valid session seed', () => {
    expect(sessionSeedSchema.safeParse(HOUSTON_SESSION).success).toBe(true);
  });

  it('targets the three Houston focus categories', () => {
    expect(HOUSTON_SESSION.focusCategorySlugs).toEqual(
      expect.arrayContaining([
        'houston-technical',
        'houston-day-to-day',
        'houston-ask-them',
      ])
    );
  });

  it('names the founder interviewer and carries a product summary', () => {
    expect(
      HOUSTON_SESSION.interviewers.some(i => i.name.includes('Harry'))
    ).toBe(true);
    expect(HOUSTON_SESSION.product).toBeTruthy();
    expect(HOUSTON_SESSION.slug).toBe('houston-systems-round-2');
  });
});
