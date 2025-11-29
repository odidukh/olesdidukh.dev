import { Container } from '@/components/ui/Container';
import { ProjectCardSkeleton } from '@/components/ui/Skeleton';

export default function ProjectsLoading() {
  return (
    <main className="py-16 md:py-24">
      <Container>
        {/* Header skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="bg-muted h-10 w-64 mx-auto rounded mb-4" />
          <div className="bg-muted h-6 w-96 mx-auto rounded" />
        </div>

        {/* Filter skeleton */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted h-9 w-20 rounded-full animate-pulse"
            />
          ))}
        </div>

        {/* Projects grid skeleton */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </main>
  );
}
