import Link from 'next/link';
import { getSessions } from '@/lib/interview-prep/data';

// Interim hub — replaced by the SessionCard grid in Task 3.
export default async function InterviewPrepHubPage() {
  const sessions = await getSessions();

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Interview Prep</h1>
        <p className="text-muted-foreground">
          {sessions.length} prep{' '}
          {sessions.length === 1 ? 'session' : 'sessions'}
        </p>
      </header>
      {sessions.length === 0 ? (
        <p className="text-muted-foreground">No sessions yet.</p>
      ) : (
        <ul className="space-y-2">
          {sessions.map(session => (
            <li key={session.id}>
              <Link
                href={`/interview-prep/${session.slug}`}
                className="text-primary hover:underline"
              >
                {session.company} — {session.role}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
