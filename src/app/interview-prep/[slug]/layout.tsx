import { notFound } from 'next/navigation';
import {
  getSessionBySlug,
  getProgressForSession,
} from '@/lib/interview-prep/data';
import { SessionTabs } from '@/components/interview-prep/SessionTabs';
import { InterviewSessionClient } from '@/components/interview-prep/InterviewSessionClient';
import { Badge } from '@/components/ui/Badge';

export default async function SessionLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getSessionBySlug(slug);
  if (!session) notFound();

  const initialProgress = await getProgressForSession(session.id);

  return (
    <InterviewSessionClient
      key={session.id}
      sessionId={session.id}
      initialProgress={initialProgress}
    >
      <div className="space-y-6">
        <header className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">
              {session.company}
            </h1>
            <Badge
              variant={session.status === 'done' ? 'success' : 'mocha'}
              className="capitalize"
            >
              {session.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {session.role}
            {session.round ? ` · ${session.round}` : ''}
          </p>
        </header>
        <SessionTabs slug={slug} />
        <div>{children}</div>
      </div>
    </InterviewSessionClient>
  );
}
