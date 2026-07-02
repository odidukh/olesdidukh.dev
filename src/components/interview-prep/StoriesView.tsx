import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { InterviewStory } from '@/lib/supabase/types';

export interface StoriesViewProps {
  stories: InterviewStory[];
}

const PARTS: {
  key: 'situation' | 'task' | 'action' | 'result';
  label: string;
}[] = [
  { key: 'situation', label: 'Situation' },
  { key: 'task', label: 'Task' },
  { key: 'action', label: 'Action' },
  { key: 'result', label: 'Result' },
];

export function StoriesView({ stories }: StoriesViewProps) {
  if (stories.length === 0) {
    return <p className="text-muted-foreground">No stories yet.</p>;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {stories.map(story => (
        <Card key={story.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{story.title}</CardTitle>
            {story.company && (
              <p className="text-sm text-muted-foreground">{story.company}</p>
            )}
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            <dl className="space-y-3">
              {PARTS.map(part => (
                <div key={part.key}>
                  <dt className="text-xs font-semibold uppercase tracking-wide text-primary">
                    {part.label}
                  </dt>
                  <dd className="text-sm leading-relaxed text-muted-foreground">
                    {story[part.key]}
                  </dd>
                </div>
              ))}
            </dl>
            {story.metrics && (
              <p className="rounded-md bg-muted/50 px-3 py-2 text-sm font-medium">
                {story.metrics}
              </p>
            )}
            {story.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {story.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
