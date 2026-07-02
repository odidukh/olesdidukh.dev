import type {
  InterviewCategory,
  InterviewQuestion,
  InterviewProgress,
} from '@/lib/supabase/types';
import type {
  ScoringCategory,
  ScoringQuestion,
  ScoringProgress,
} from './scoring';

export function toScoringCategories(
  categories: InterviewCategory[]
): ScoringCategory[] {
  return categories.map(c => ({ id: c.id, weight: c.weight }));
}

export function toScoringQuestions(
  questions: InterviewQuestion[]
): ScoringQuestion[] {
  return questions.map(q => ({ id: q.id, categoryId: q.category_id }));
}

export function toScoringProgress(
  progress: InterviewProgress[]
): ScoringProgress[] {
  return progress.map(p => ({
    questionId: p.question_id,
    confidence: p.confidence,
    timesSeen: p.times_seen,
  }));
}
