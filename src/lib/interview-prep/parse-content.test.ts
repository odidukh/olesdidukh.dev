import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseInterviewContent, slugify } from './parse-content';

const html = readFileSync(
  join(process.cwd(), 'src', 'app', 'interview-prep', 'content.html'),
  'utf8'
);
const seed = parseInterviewContent(html);

describe('slugify', () => {
  it('turns a middot category name into a hyphen slug', () => {
    expect(slugify('Houston · Technical')).toBe('houston-technical');
    expect(slugify('Behavioral')).toBe('behavioral');
  });
});

describe('parseInterviewContent', () => {
  it('extracts exactly 83 questions, 10 categories, 7 stories', () => {
    expect(seed.questions).toHaveLength(83);
    expect(seed.categories).toHaveLength(10);
    expect(seed.stories).toHaveLength(7);
  });

  it('orders categories by first appearance and slugifies them', () => {
    expect(seed.categories[0]).toMatchObject({
      name: 'Behavioral',
      slug: 'behavioral',
      sortOrder: 0,
      weight: 1,
    });
    expect(seed.categories.map(c => c.slug)).toContain('houston-technical');
  });

  it('normalizes string tips to { point, detail: null }', () => {
    const q = seed.questions.find(
      q => q.question === 'Tell me about yourself.'
    );
    expect(q?.tips[0]).toEqual({
      point: expect.stringContaining('60-90s'),
      detail: null,
    });
  });

  it('normalizes { p, d } tips to { point, detail }', () => {
    const q = seed.questions.find(q => q.tips.some(t => t.detail !== null));
    expect(q?.tips.find(t => t.detail !== null)).toMatchObject({
      point: expect.any(String),
      detail: expect.any(String),
    });
  });

  it('links behavioral questions to a reused story slug', () => {
    const migration = seed.stories.find(s => s.slug === 'migration');
    expect(migration).toBeDefined();
    const linked = seed.questions.filter(q => q.storySlug === 'migration');
    expect(linked.length).toBeGreaterThanOrEqual(2);
  });

  it('maps every question to a category that exists', () => {
    const slugs = new Set(seed.categories.map(c => c.slug));
    expect(seed.questions.every(q => slugs.has(q.categorySlug))).toBe(true);
  });
});
