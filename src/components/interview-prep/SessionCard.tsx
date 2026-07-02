import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ReadinessRing } from './ReadinessRing';
import type { InterviewSession } from '@/lib/supabase/types';

export interface SessionCardProps {
  session: InterviewSession;
  readiness: number; // 0..1
}

export function SessionCard({ session, readiness }: SessionCardProps) {
  const scheduled = session.scheduled_at
    ? new Date(session.scheduled_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  return (
    <Link href={`/interview-prep/${session.slug}`} className="group block">
      <Card className="h-full transition-shadow group-hover:shadow-md">
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <CardTitle className="text-xl">{session.company}</CardTitle>
            <p className="text-sm text-muted-foreground">{session.role}</p>
          </div>
          <ReadinessRing value={readiness} size={72} strokeWidth={7} />
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          {session.round && <span>{session.round}</span>}
          {scheduled && <span aria-hidden>·</span>}
          {scheduled && <span>{scheduled}</span>}
          <Badge
            variant={session.status === 'done' ? 'success' : 'mocha'}
            className="ml-auto capitalize"
          >
            {session.status}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
