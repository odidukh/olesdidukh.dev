import { Container } from '@/components/ui/Container';
import { ContactFormSkeleton } from '@/components/ui/Skeleton';

export default function ContactLoading() {
  return (
    <main className="py-16 md:py-24">
      <Container size="md">
        {/* Header skeleton */}
        <div className="text-center mb-12 animate-pulse">
          <div className="bg-muted h-10 w-48 mx-auto rounded mb-4" />
          <div className="bg-muted h-6 w-96 mx-auto rounded" />
        </div>

        {/* Contact info skeleton */}
        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-xl border bg-card animate-pulse"
            >
              <div className="bg-muted h-10 w-10 mx-auto rounded-lg mb-3" />
              <div className="bg-muted h-5 w-24 mx-auto rounded mb-2" />
              <div className="bg-muted h-4 w-32 mx-auto rounded" />
            </div>
          ))}
        </div>

        {/* Form skeleton */}
        <ContactFormSkeleton />
      </Container>
    </main>
  );
}
