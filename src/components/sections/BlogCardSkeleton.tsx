import { Card, CardContent, CardFooter } from '@/components/ui/Card';

export function BlogCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <Card className="h-full flex flex-col overflow-hidden">
      {/* Cover image placeholder */}
      <div className={`bg-muted animate-pulse ${featured ? 'h-72' : 'h-48'}`} />

      <CardContent className="flex-1 pt-4 space-y-3">
        {/* Title */}
        <div className="space-y-2">
          <div className="h-5 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-5 w-2/3 bg-muted animate-pulse rounded" />
        </div>

        {/* Excerpt */}
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
        </div>

        {/* Tags */}
        <div className="flex gap-1">
          <div className="h-5 w-14 bg-muted animate-pulse rounded-full" />
          <div className="h-5 w-16 bg-muted animate-pulse rounded-full" />
          <div className="h-5 w-12 bg-muted animate-pulse rounded-full" />
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="w-full flex items-center justify-between">
          <div className="h-4 w-20 bg-muted animate-pulse rounded" />
          <div className="flex items-center gap-2">
            <div className="h-4 w-16 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
