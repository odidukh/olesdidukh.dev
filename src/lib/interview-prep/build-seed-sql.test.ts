import { describe, it, expect } from 'vitest';
import { buildSeedSql } from './build-seed-sql';
import type { ParsedSeed } from './parse-content';
import type { SessionSeed } from './houston-session';

const seed: ParsedSeed = {
  categories: [
    { name: 'Behavioral', slug: 'behavioral', sortOrder: 0, weight: 1 },
  ],
  stories: [
    {
      slug: 'migration',
      title: 'jQuery → React',
      company: 'Inango',
      situation: "It's a 45k-line app",
      task: 'Modernize it',
      action: 'Strangler Fig',
      result: '−74% load',
      metrics: null,
      tags: ['migration'],
      sortOrder: 0,
    },
  ],
  questions: [
    {
      categorySlug: 'behavioral',
      storySlug: 'migration',
      question: "Tell me about a migration you've done",
      modelAnswer: null,
      tips: [{ point: 'Own it', detail: null }],
      difficulty: 'medium',
      tags: [],
      isCustom: false,
      source: null,
    },
  ],
};

const session: SessionSeed = {
  slug: 'houston-systems-round-2',
  company: 'Houston Systems',
  role: 'Senior Frontend Engineer',
  round: 'Round 2',
  scheduledAt: null,
  status: 'upcoming',
  product: null,
  interviewers: [],
  likelyTopics: [],
  yourNumbers: [],
  bottomLine: null,
  stackMap: [],
  focusCategorySlugs: ['behavioral'],
};

describe('buildSeedSql', () => {
  const sql = buildSeedSql(seed, session);

  it('wraps the seed in a transaction', () => {
    expect(sql.trim().startsWith('BEGIN;')).toBe(true);
    expect(sql.trim().endsWith('COMMIT;')).toBe(true);
  });

  it('escapes single quotes in text so the SQL stays valid', () => {
    // "Tell me about a migration you've done" -> doubled apostrophe
    expect(sql).toContain("you''ve done");
  });

  it('resolves category and story by slug via subqueries', () => {
    expect(sql).toContain(
      "(SELECT id FROM interview_categories WHERE slug = 'behavioral')"
    );
    expect(sql).toContain(
      "(SELECT id FROM interview_stories WHERE slug = 'migration')"
    );
  });

  it('encodes tips as a jsonb literal', () => {
    expect(sql).toMatch(/'\[\{"point":"Own it","detail":null\}\]'::jsonb/);
  });

  it('is idempotent on slug', () => {
    expect(sql).toContain('ON CONFLICT (slug) DO NOTHING');
  });

  it('resolves session focus categories via an array subquery', () => {
    expect(sql).toContain(
      "ARRAY(SELECT id FROM interview_categories WHERE slug IN ('behavioral'))"
    );
  });
});
