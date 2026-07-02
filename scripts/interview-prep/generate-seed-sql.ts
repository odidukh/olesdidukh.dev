import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseInterviewContent } from '../../src/lib/interview-prep/parse-content.ts';
import { HOUSTON_SESSION } from '../../src/lib/interview-prep/houston-session.ts';
import { buildSeedSql } from '../../src/lib/interview-prep/build-seed-sql.ts';

const root = process.cwd();
const html = readFileSync(
  join(root, 'src', 'app', 'interview-prep', 'content.html'),
  'utf8'
);
const seed = parseInterviewContent(html);
const sql = buildSeedSql(seed, HOUSTON_SESSION);
const outPath = join(
  root,
  'supabase',
  'migrations',
  '004_interview_prep_seed.sql'
);
writeFileSync(outPath, sql, 'utf8');
console.log(
  `Wrote ${outPath}: ${seed.categories.length} categories, ${seed.stories.length} stories, ${seed.questions.length} questions, 1 session.`
);
