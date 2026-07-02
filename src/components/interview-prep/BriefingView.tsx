import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { InterviewSession } from '@/lib/supabase/types';

export interface BriefingViewProps {
  session: InterviewSession;
}

export function BriefingView({ session }: BriefingViewProps) {
  const hasAny =
    !!session.product ||
    !!session.bottom_line ||
    session.interviewers.length > 0 ||
    session.likely_topics.length > 0 ||
    session.your_numbers.length > 0 ||
    session.stack_map.length > 0;

  if (!hasAny) {
    return <p className="text-muted-foreground">No briefing details yet.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {session.product && (
        <Card>
          <CardHeader>
            <CardTitle>Product</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {session.product}
            </p>
          </CardContent>
        </Card>
      )}

      {session.bottom_line && (
        <Card>
          <CardHeader>
            <CardTitle>Bottom line</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {session.bottom_line}
            </p>
          </CardContent>
        </Card>
      )}

      {session.interviewers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Interviewers</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {session.interviewers.map((person, i) => (
                <li key={`${person.name}-${i}`} className="text-sm">
                  <span className="font-medium text-foreground">
                    {person.name}
                  </span>
                  <span className="text-muted-foreground">
                    {' '}
                    — {person.role}
                  </span>
                  {person.focus && (
                    <p className="text-muted-foreground">{person.focus}</p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {session.likely_topics.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Likely topics</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {session.likely_topics.map((t, i) => (
                <li key={`${t.topic}-${i}`} className="text-sm">
                  <span className="font-medium text-foreground">{t.topic}</span>
                  {t.whereToDrill && (
                    <p className="text-muted-foreground">{t.whereToDrill}</p>
                  )}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {session.your_numbers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your numbers</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-4">
              {session.your_numbers.map((n, i) => (
                <div key={`${n.label}-${i}`}>
                  <dt className="text-xs text-muted-foreground">{n.label}</dt>
                  <dd className="text-lg font-semibold tabular-nums">
                    {n.value}
                  </dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      )}

      {session.stack_map.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Stack map</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {session.stack_map.map((s, i) => (
                <li
                  key={`${s.theirTech}-${i}`}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="font-medium text-foreground">
                    {s.theirTech}
                  </span>
                  <Badge variant="secondary">{s.yourStanding}</Badge>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
