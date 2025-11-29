import { Container } from '@/components/ui/Container';
import { TimelineSkeleton } from '@/components/ui/Skeleton';

export default function ExperienceLoading() {
  return (
    <main className="py-16 md:py-24">
      <Container size="md">
        {/* Header skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="bg-muted h-10 w-56 mx-auto rounded mb-4" />
          <div className="bg-muted h-6 w-96 mx-auto rounded" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="text-center p-4 rounded-xl border bg-card animate-pulse"
            >
              <div className="bg-muted h-8 w-16 mx-auto rounded mb-2" />
              <div className="bg-muted h-4 w-24 mx-auto rounded" />
            </div>
          ))}
        </div>

        {/* Timeline skeleton */}
        <TimelineSkeleton />
      </Container>
    </main>
  );
}
