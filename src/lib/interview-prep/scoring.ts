export type ScoringCategory = { id: string; weight: number };
export type ScoringQuestion = { id: string; categoryId: string | null };
export type ScoringProgress = {
  questionId: string;
  confidence: number;
  timesSeen: number;
};

const MAX_CONFIDENCE = 3;

function confidenceByQuestion(
  progress: ScoringProgress[]
): Map<string, ScoringProgress> {
  return new Map(progress.map(p => [p.questionId, p]));
}

export function categoryReadiness(
  categoryId: string,
  questions: ScoringQuestion[],
  progress: ScoringProgress[]
): number {
  const inCategory = questions.filter(q => q.categoryId === categoryId);
  if (inCategory.length === 0) return 0;
  const byQuestion = confidenceByQuestion(progress);
  const total = inCategory.reduce(
    (sum, q) => sum + (byQuestion.get(q.id)?.confidence ?? 0),
    0
  );
  return total / (MAX_CONFIDENCE * inCategory.length);
}

export function overallReadiness(
  categories: ScoringCategory[],
  questions: ScoringQuestion[],
  progress: ScoringProgress[]
): number {
  const scored = categories
    .filter(c => questions.some(q => q.categoryId === c.id))
    .map(c => ({
      weight: c.weight,
      readiness: categoryReadiness(c.id, questions, progress),
    }));
  const weightSum = scored.reduce((s, c) => s + c.weight, 0);
  if (weightSum === 0) return 0;
  return scored.reduce((s, c) => s + c.weight * c.readiness, 0) / weightSum;
}

export function weakSpots(
  questions: ScoringQuestion[],
  progress: ScoringProgress[],
  limit = 10
): ScoringProgress[] {
  const byQuestion = confidenceByQuestion(progress);
  return questions
    .map(
      q =>
        byQuestion.get(q.id) ?? {
          questionId: q.id,
          confidence: 0,
          timesSeen: 0,
        }
    )
    .filter(p => p.confidence <= 1)
    .sort((a, b) => a.confidence - b.confidence || a.timesSeen - b.timesSeen)
    .slice(0, limit);
}
