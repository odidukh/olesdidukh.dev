import type { InterviewQuestion } from '@/lib/supabase/types';
import type { ProgressEntry } from '@/stores/useInterviewProgressStore';

// Weak = effective confidence <= 1 (unseen counts as 0). Matches scoring.weakSpots.
const WEAK_THRESHOLD = 1;

export interface SmartSessionOptions {
  size: number;
  categoryId?: string | null;
  weakOnly?: boolean;
}

export function buildSmartSession(
  questions: InterviewQuestion[],
  entries: Record<string, ProgressEntry>,
  options: SmartSessionOptions
): string[] {
  const { size, categoryId = null, weakOnly = false } = options;

  const confidenceOf = (id: string): number => entries[id]?.confidence ?? 0;
  const lastReviewedOf = (id: string): number => {
    const iso = entries[id]?.lastReviewedAt ?? null;
    return iso ? Date.parse(iso) : 0; // never reviewed -> oldest
  };
  const timesSeenOf = (id: string): number => entries[id]?.timesSeen ?? 0;

  let pool = questions;
  if (categoryId) {
    pool = pool.filter(question => question.category_id === categoryId);
  }
  if (weakOnly) {
    pool = pool.filter(question => confidenceOf(question.id) <= WEAK_THRESHOLD);
  }

  const ordered = pool
    .map((question, i) => ({ id: question.id, i }))
    .sort((a, b) => {
      const byConfidence = confidenceOf(a.id) - confidenceOf(b.id);
      if (byConfidence !== 0) return byConfidence;
      const byReviewed = lastReviewedOf(a.id) - lastReviewedOf(b.id);
      if (byReviewed !== 0) return byReviewed;
      const bySeen = timesSeenOf(a.id) - timesSeenOf(b.id);
      if (bySeen !== 0) return bySeen;
      return a.i - b.i; // stable original order
    })
    .map(x => x.id);

  return ordered.slice(0, Math.max(0, size));
}

export function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const a = copy[i] as T;
    copy[i] = copy[j] as T;
    copy[j] = a;
  }
  return copy;
}

export function pickRandom<T>(items: T[], count: number): T[] {
  return shuffle(items).slice(0, Math.max(0, count));
}
