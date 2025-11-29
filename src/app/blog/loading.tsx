import { Container } from '@/components/ui/Container';
import { BlogCardSkeleton } from '@/components/ui/Skeleton';

export default function BlogLoading() {
  return (
    <main className="py-16 md:py-24">
      <Container>
        {/* Header skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="bg-muted h-10 w-48 mx-auto rounded mb-4" />
          <div className="bg-muted h-6 w-80 mx-auto rounded" />
        </div>

        {/* Search and filter skeleton */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="bg-muted h-10 flex-1 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted h-9 w-24 rounded-full animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Featured post skeleton */}
        <div className="mb-12 rounded-xl border bg-card overflow-hidden animate-pulse">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted h-64 md:h-full" />
            <div className="p-6 space-y-4">
              <div className="flex gap-2">
                <div className="bg-muted h-6 w-20 rounded-full" />
                <div className="bg-muted h-6 w-24 rounded" />
              </div>
              <div className="bg-muted h-8 w-full rounded" />
              <div className="space-y-2">
                <div className="bg-muted h-4 w-full rounded" />
                <div className="bg-muted h-4 w-5/6 rounded" />
                <div className="bg-muted h-4 w-4/5 rounded" />
              </div>
              <div className="bg-muted h-10 w-32 rounded" />
            </div>
          </div>
        </div>

        {/* Blog grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </main>
  );
}
