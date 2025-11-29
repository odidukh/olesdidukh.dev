import { Container } from '@/components/ui/Container';
import { SkillsSkeleton } from '@/components/ui/Skeleton';

export default function SkillsLoading() {
  return (
    <main className="py-16 md:py-24">
      <Container>
        {/* Header skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="bg-muted h-10 w-48 mx-auto rounded mb-4" />
          <div className="bg-muted h-6 w-80 mx-auto rounded" />
        </div>

        {/* Category tabs skeleton */}
        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted h-9 w-24 rounded-full animate-pulse"
            />
          ))}
        </div>

        {/* Skills grid skeleton */}
        <SkillsSkeleton />
      </Container>
    </main>
  );
}
