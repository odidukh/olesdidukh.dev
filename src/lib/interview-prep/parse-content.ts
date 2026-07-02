import vm from 'node:vm';
import type { Difficulty, Tip } from './schemas';

export type ParsedCategory = {
  name: string;
  slug: string;
  sortOrder: number;
  weight: number;
};
export type ParsedStory = {
  slug: string;
  title: string;
  company: string | null;
  situation: string;
  task: string;
  action: string;
  result: string;
  metrics: string | null;
  tags: string[];
  sortOrder: number;
};
export type ParsedQuestion = {
  categorySlug: string;
  storySlug: string | null;
  question: string;
  modelAnswer: string | null;
  tips: Tip[];
  difficulty: Difficulty;
  tags: string[];
  isCustom: boolean;
  source: string | null;
};
export type ParsedSeed = {
  categories: ParsedCategory[];
  stories: ParsedStory[];
  questions: ParsedQuestion[];
};

type RawTip = string | { p: string; d: string };
type RawQuestion = {
  c: string;
  d: Difficulty;
  q: string;
  tips?: RawTip[];
  story?: string;
  a?: string;
};
type RawStory = {
  title: string;
  company?: string;
  s: string;
  t: string;
  a: string;
  r: string;
  tags?: string[];
};

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/·/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Slice a balanced `open`/`close` region starting at the first `open`
// after `anchor`, skipping delimiters that appear inside string literals.
function sliceBalanced(
  src: string,
  anchor: string,
  open: string,
  close: string
): string {
  const anchorAt = src.indexOf(anchor);
  if (anchorAt === -1)
    throw new Error(`parse-content: anchor not found: ${anchor}`);
  const start = src.indexOf(open, anchorAt);
  if (start === -1)
    throw new Error(`parse-content: '${open}' not found after ${anchor}`);
  let depth = 0;
  let inString: string | null = null;
  for (let i = start; i < src.length; i++) {
    const ch = src[i];
    if (inString) {
      if (ch === inString && src[i - 1] !== '\\') inString = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      inString = ch;
    } else if (ch === open) {
      depth++;
    } else if (ch === close) {
      depth--;
      if (depth === 0) return src.slice(start, i + 1);
    }
  }
  throw new Error(`parse-content: unbalanced ${open}${close} after ${anchor}`);
}

function evalLiteral<T>(literal: string): T {
  return vm.runInNewContext(`(${literal})`) as T;
}

function normalizeTip(tip: RawTip): Tip {
  return typeof tip === 'string'
    ? { point: tip, detail: null }
    : { point: tip.p, detail: tip.d };
}

export function parseInterviewContent(html: string): ParsedSeed {
  const rawQuestions = evalLiteral<RawQuestion[]>(
    sliceBalanced(html, 'const Q =', '[', ']')
  );
  const rawStories = evalLiteral<Record<string, RawStory>>(
    sliceBalanced(html, 'const STORIES =', '{', '}')
  );

  const stories: ParsedStory[] = Object.entries(rawStories).map(
    ([slug, s], index) => ({
      slug,
      title: s.title,
      company: s.company ?? null,
      situation: s.s,
      task: s.t,
      action: s.a,
      result: s.r,
      metrics: null,
      tags: s.tags ?? [],
      sortOrder: index,
    })
  );

  const order = new Map<string, number>();
  for (const q of rawQuestions) {
    if (!order.has(q.c)) order.set(q.c, order.size);
  }
  const categories: ParsedCategory[] = [...order.entries()].map(
    ([name, sortOrder]) => ({ name, slug: slugify(name), sortOrder, weight: 1 })
  );

  const questions: ParsedQuestion[] = rawQuestions.map(q => ({
    categorySlug: slugify(q.c),
    storySlug: q.story ?? null,
    question: q.q,
    modelAnswer: q.a ?? null,
    tips: (q.tips ?? []).map(normalizeTip),
    difficulty: q.d,
    tags: [],
    isCustom: false,
    source: null,
  }));

  return { categories, stories, questions };
}
