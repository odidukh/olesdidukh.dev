import type {
  ParsedCategory,
  ParsedQuestion,
  ParsedSeed,
  ParsedStory,
} from './parse-content';
import type { SessionSeed } from './houston-session';

const q = (value: string): string => `'${value.replace(/'/g, "''")}'`;
const qn = (value: string | null): string =>
  value === null ? 'NULL' : q(value);
const jsonb = (value: unknown): string => `${q(JSON.stringify(value))}::jsonb`;
const textArray = (values: string[]): string =>
  values.length === 0 ? `'{}'` : `ARRAY[${values.map(q).join(', ')}]::text[]`;

function categoryInsert(c: ParsedCategory): string {
  return (
    `INSERT INTO interview_categories (name, slug, sort_order, weight) VALUES ` +
    `(${q(c.name)}, ${q(c.slug)}, ${c.sortOrder}, ${c.weight}) ` +
    `ON CONFLICT (slug) DO NOTHING;`
  );
}

function storyInsert(s: ParsedStory): string {
  return (
    `INSERT INTO interview_stories (slug, title, company, situation, task, action, result, metrics, tags, sort_order) VALUES ` +
    `(${q(s.slug)}, ${q(s.title)}, ${qn(s.company)}, ${q(s.situation)}, ${q(s.task)}, ${q(s.action)}, ${q(s.result)}, ${qn(s.metrics)}, ${textArray(s.tags)}, ${s.sortOrder}) ` +
    `ON CONFLICT (slug) DO NOTHING;`
  );
}

function questionInsert(qn2: ParsedQuestion): string {
  const categoryRef = `(SELECT id FROM interview_categories WHERE slug = ${q(qn2.categorySlug)})`;
  const storyRef =
    qn2.storySlug === null
      ? 'NULL'
      : `(SELECT id FROM interview_stories WHERE slug = ${q(qn2.storySlug)})`;
  return (
    `INSERT INTO interview_questions (category_id, story_id, question, model_answer, tips, difficulty, tags, is_custom, source) VALUES ` +
    `(${categoryRef}, ${storyRef}, ${q(qn2.question)}, ${qn(qn2.modelAnswer)}, ${jsonb(qn2.tips)}, ${q(qn2.difficulty)}::interview_difficulty, ${textArray(qn2.tags)}, ${qn2.isCustom}, ${qn(qn2.source)});`
  );
}

function sessionInsert(s: SessionSeed): string {
  const focusRef =
    s.focusCategorySlugs.length === 0
      ? `'{}'`
      : `ARRAY(SELECT id FROM interview_categories WHERE slug IN (${s.focusCategorySlugs.map(q).join(', ')}))`;
  return (
    `INSERT INTO interview_sessions (slug, company, role, round, scheduled_at, status, product, interviewers, likely_topics, your_numbers, bottom_line, stack_map, focus_category_ids) VALUES ` +
    `(${q(s.slug)}, ${q(s.company)}, ${q(s.role)}, ${q(s.round)}, ${s.scheduledAt === null ? 'NULL' : q(s.scheduledAt)}, ${q(s.status)}::interview_session_status, ${qn(s.product)}, ${jsonb(s.interviewers)}, ${jsonb(s.likelyTopics)}, ${jsonb(s.yourNumbers)}, ${qn(s.bottomLine)}, ${jsonb(s.stackMap)}, ${focusRef}) ` +
    `ON CONFLICT (slug) DO NOTHING;`
  );
}

export function buildSeedSql(seed: ParsedSeed, session: SessionSeed): string {
  const lines = [
    'BEGIN;',
    ...seed.categories.map(categoryInsert),
    ...seed.stories.map(storyInsert),
    ...seed.questions.map(questionInsert),
    sessionInsert(session),
    'COMMIT;',
    '',
  ];
  return lines.join('\n');
}
