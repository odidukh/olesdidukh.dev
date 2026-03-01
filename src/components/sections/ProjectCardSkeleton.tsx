import { Card, CardContent, CardFooter } from '@/components/ui/Card';

export function ProjectCardSkeleton() {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      {/* Image placeholder */}
      <div className="h-48 bg-muted animate-pulse" />

      <CardContent className="pt-4 flex-1 flex flex-col">
        <div className="space-y-3 flex-1">
          {/* Title + badge row */}
          <div className="flex items-start justify-between gap-2">
            <div className="h-5 w-3/4 bg-muted animate-pulse rounded" />
            <div className="h-5 w-20 bg-muted animate-pulse rounded-full shrink-0" />
          </div>

          {/* Description lines */}
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
            <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          </div>

          {/* Technology badges */}
          <div className="flex gap-1 pt-2">
            <div className="h-5 w-14 bg-muted animate-pulse rounded-full" />
            <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
            <div className="h-5 w-12 bg-muted animate-pulse rounded-full" />
          </div>
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-4 w-10 bg-muted animate-pulse rounded" />
            <div className="h-4 w-14 bg-muted animate-pulse rounded" />
          </div>
          <div className="h-4 w-4 bg-muted animate-pulse rounded" />
        </div>
      </CardFooter>
    </Card>
  );
}
