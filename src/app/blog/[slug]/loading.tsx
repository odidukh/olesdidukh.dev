import { Container } from '@/components/ui/Container';

export default function BlogPostLoading() {
  return (
    <main className="pt-20">
      {/* Hero Section Skeleton */}
      <section className="py-12 bg-gradient-to-br from-cream-50 to-cream-100 dark:from-gray-900 dark:to-gray-800">
        <Container>
          <div className="max-w-4xl mx-auto animate-pulse">
            {/* Breadcrumb skeleton */}
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-muted h-4 w-12 rounded" />
              <div className="bg-muted h-4 w-4 rounded" />
              <div className="bg-muted h-4 w-16 rounded" />
              <div className="bg-muted h-4 w-4 rounded" />
              <div className="bg-muted h-4 w-32 rounded" />
            </div>

            {/* Category and date */}
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-muted h-6 w-24 rounded-full" />
              <div className="bg-muted h-4 w-28 rounded" />
              <div className="bg-muted h-4 w-20 rounded" />
            </div>

            {/* Title skeleton */}
            <div className="space-y-3 mb-8">
              <div className="bg-muted h-10 w-full rounded" />
              <div className="bg-muted h-10 w-4/5 rounded" />
            </div>

            {/* Excerpt skeleton */}
            <div className="space-y-2 mb-8">
              <div className="bg-muted h-5 w-full rounded" />
              <div className="bg-muted h-5 w-5/6 rounded" />
            </div>

            {/* Author info skeleton */}
            <div className="flex items-center gap-4">
              <div className="bg-muted h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <div className="bg-muted h-4 w-32 rounded" />
                <div className="bg-muted h-3 w-40 rounded" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Cover Image Skeleton */}
      <div className="max-w-5xl mx-auto px-4 -mt-8">
        <div className="bg-muted h-64 md:h-96 w-full rounded-xl animate-pulse" />
      </div>

      {/* Content Skeleton */}
      <section className="py-12">
        <Container>
          <div className="max-w-3xl mx-auto animate-pulse space-y-8">
            {/* Paragraphs */}
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="bg-muted h-4 w-full rounded" />
                <div className="bg-muted h-4 w-full rounded" />
                <div className="bg-muted h-4 w-11/12 rounded" />
                <div className="bg-muted h-4 w-4/5 rounded" />
              </div>
            ))}

            {/* Code block skeleton */}
            <div className="bg-muted h-48 w-full rounded-lg" />

            {/* More paragraphs */}
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={`p2-${i}`} className="space-y-3">
                <div className="bg-muted h-4 w-full rounded" />
                <div className="bg-muted h-4 w-full rounded" />
                <div className="bg-muted h-4 w-3/4 rounded" />
              </div>
            ))}

            {/* Heading skeleton */}
            <div className="bg-muted h-8 w-2/3 rounded" />

            {/* More content */}
            <div className="space-y-3">
              <div className="bg-muted h-4 w-full rounded" />
              <div className="bg-muted h-4 w-full rounded" />
              <div className="bg-muted h-4 w-5/6 rounded" />
            </div>
          </div>
        </Container>
      </section>

      {/* Tags skeleton */}
      <section className="py-8 border-t">
        <Container>
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-wrap gap-2 animate-pulse">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="bg-muted h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Related posts skeleton */}
      <section className="py-12 bg-muted/30">
        <Container>
          <div className="mb-8 animate-pulse">
            <div className="bg-muted h-8 w-48 mx-auto rounded" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card overflow-hidden animate-pulse"
              >
                <div className="bg-muted h-40 w-full" />
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-muted h-5 w-20 rounded-full" />
                    <div className="bg-muted h-4 w-24 rounded" />
                  </div>
                  <div className="bg-muted h-6 w-full rounded" />
                  <div className="space-y-2">
                    <div className="bg-muted h-4 w-full rounded" />
                    <div className="bg-muted h-4 w-4/5 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </main>
  );
}
