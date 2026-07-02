'use client';

import { useMemo } from 'react';
import {
  useInterviewProgressStore,
  selectScoringProgress,
} from '@/stores/useInterviewProgressStore';
import {
  toScoringCategories,
  toScoringQuestions,
} from '@/lib/interview-prep/adapters';
import {
  overallReadiness,
  categoryReadiness,
  weakSpots,
} from '@/lib/interview-prep/scoring';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { ReadinessRing } from './ReadinessRing';
import { CategoryReadinessList } from './CategoryReadinessList';
import { WeakSpots } from './WeakSpots';
import type {
  InterviewCategory,
  InterviewQuestion,
} from '@/lib/supabase/types';

export interface DashboardViewProps {
  categories: InterviewCategory[];
  questions: InterviewQuestion[];
  slug: string;
}

export function DashboardView({
  categories,
  questions,
  slug,
}: DashboardViewProps) {
  const entries = useInterviewProgressStore(state => state.entries);

  const { overall, perCategory, weak } = useMemo(() => {
    const progress = selectScoringProgress({ entries });
    const scoringCategories = toScoringCategories(categories);
    const scoringQuestions = toScoringQuestions(questions);
    const byId = new Map(questions.map(question => [question.id, question]));

    return {
      overall: overallReadiness(scoringCategories, scoringQuestions, progress),
      perCategory: categories.map(c => ({
        id: c.id,
        name: c.name,
        readiness: categoryReadiness(c.id, scoringQuestions, progress),
      })),
      weak: weakSpots(scoringQuestions, progress).map(w => ({
        questionId: w.questionId,
        question: byId.get(w.questionId)?.question ?? w.questionId,
      })),
    };
  }, [entries, categories, questions]);

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="flex flex-col items-center justify-center py-8 lg:col-span-1">
        <ReadinessRing value={overall} label="Overall" size={160} />
      </Card>
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Category readiness</CardTitle>
        </CardHeader>
        <CardContent>
          <CategoryReadinessList items={perCategory} />
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Weak spots</CardTitle>
        </CardHeader>
        <CardContent>
          <WeakSpots items={weak} slug={slug} />
        </CardContent>
      </Card>
    </div>
  );
}
