import {
  getSessions,
  getQuestions,
  getCategories,
  getProgressForSession,
} from '@/lib/interview-prep/data';
import {
  toScoringCategories,
  toScoringQuestions,
  toScoringProgress,
} from '@/lib/interview-prep/adapters';
import { overallReadiness } from '@/lib/interview-prep/scoring';
import { SessionCard } from '@/components/interview-prep/SessionCard';

export default async function InterviewPrepHubPage() {
  const [sessions, questions, categories] = await Promise.all([
    getSessions(),
    getQuestions(),
    getCategories(),
  ]);

  const scoringCategories = toScoringCategories(categories);
  const scoringQuestions = toScoringQuestions(questions);

  const cards = await Promise.all(
    sessions.map(async session => {
      const progress = await getProgressForSession(session.id);
      const readiness = overallReadiness(
        scoringCategories,
        scoringQuestions,
        toScoringProgress(progress)
      );
      return { session, readiness };
    })
  );

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Interview Prep</h1>
        <p className="text-muted-foreground">
          {sessions.length} prep{' '}
          {sessions.length === 1 ? 'session' : 'sessions'}
          {' · '}
          {questions.length} questions in the bank
        </p>
      </header>

      {cards.length === 0 ? (
        <p className="text-muted-foreground">
          No sessions yet. Seed the interview tables to get started.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map(({ session, readiness }) => (
            <SessionCard
              key={session.id}
              session={session}
              readiness={readiness}
            />
          ))}
        </div>
      )}
    </div>
  );
}
