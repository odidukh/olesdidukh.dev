import Link from 'next/link';

export interface WeakSpotsProps {
  items: { questionId: string; question: string }[];
  slug: string;
}

export function WeakSpots({ items, slug }: WeakSpotsProps) {
  if (items.length === 0) {
    return <p className="text-muted-foreground">No weak spots — great work!</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map(item => (
        <li
          key={item.questionId}
          className="flex items-center justify-between gap-4 border-b border-border pb-2 text-sm last:border-0"
        >
          <span className="text-foreground">{item.question}</span>
          <Link
            href={`/interview-prep/${slug}/study`}
            className="shrink-0 text-primary hover:underline"
          >
            Practice
          </Link>
        </li>
      ))}
    </ul>
  );
}
