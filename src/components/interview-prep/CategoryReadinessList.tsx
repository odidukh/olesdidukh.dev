export interface CategoryReadinessListProps {
  items: { id: string; name: string; readiness: number }[];
}

export function CategoryReadinessList({ items }: CategoryReadinessListProps) {
  return (
    <ul className="space-y-3">
      {items.map(item => {
        const pct = Math.round(Math.max(0, Math.min(1, item.readiness)) * 100);
        return (
          <li key={item.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{item.name}</span>
              <span className="tabular-nums text-muted-foreground">{pct}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={item.name}
              className="h-2 w-full overflow-hidden rounded-full bg-muted"
            >
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
