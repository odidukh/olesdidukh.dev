export default function ProjectDetailLoading() {
  return (
    <main className="pt-20">
      {/* Hero Section Skeleton */}
      <section className="relative overflow-hidden bg-gradient-to-br from-cream-50 to-cream-100 py-16 dark:from-gray-900 dark:to-gray-800 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link skeleton */}
          <div className="mb-8 animate-pulse">
            <div className="bg-muted h-4 w-32 rounded" />
          </div>

          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            {/* Project Info Skeleton */}
            <div className="animate-pulse">
              {/* Category badge */}
              <div className="bg-muted h-6 w-24 rounded-full mb-4" />

              {/* Title */}
              <div className="space-y-3 mb-4">
                <div className="bg-muted h-10 w-full rounded" />
                <div className="bg-muted h-10 w-3/4 rounded" />
              </div>

              {/* Description */}
              <div className="space-y-2 mb-6">
                <div className="bg-muted h-5 w-full rounded" />
                <div className="bg-muted h-5 w-full rounded" />
                <div className="bg-muted h-5 w-4/5 rounded" />
              </div>

              {/* Meta info */}
              <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="bg-muted h-4 w-4 rounded" />
                    <div className="bg-muted h-4 w-16 rounded" />
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-muted h-10 w-32 rounded-lg" />
                <div className="bg-muted h-10 w-28 rounded-lg" />
              </div>
            </div>

            {/* Project Image Skeleton */}
            <div className="bg-muted aspect-video rounded-2xl animate-pulse" />
          </div>
        </div>
      </section>

      {/* Tech Stack Skeleton */}
      <section className="border-b border-gray-200 bg-white py-12 dark:border-gray-700 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-muted h-4 w-40 mx-auto mb-6 rounded" />
            <div className="flex flex-wrap justify-center gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-muted h-8 w-20 rounded-full" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Challenges & Solutions Skeleton */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 animate-pulse">
            {/* Challenges */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-muted h-10 w-10 rounded-lg" />
                <div className="bg-muted h-7 w-28 rounded" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="bg-muted h-6 w-6 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="bg-muted h-4 w-full rounded" />
                      <div className="bg-muted h-4 w-4/5 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Solutions */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="bg-muted h-10 w-10 rounded-lg" />
                <div className="bg-muted h-7 w-24 rounded" />
              </div>
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="bg-muted h-5 w-5 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="bg-muted h-4 w-full rounded" />
                      <div className="bg-muted h-4 w-3/4 rounded" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Skeleton */}
      <section className="bg-gradient-to-br from-mocha-50 to-cream-100 py-16 dark:from-mocha-900/20 dark:to-gray-800 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-muted h-8 w-48 mx-auto mb-12 rounded" />
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-6 dark:bg-gray-800"
                >
                  <div className="bg-muted h-4 w-24 mb-2 rounded" />
                  <div className="bg-muted h-8 w-20 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* My Role Skeleton */}
      <section className="border-t border-gray-200 bg-white py-16 dark:border-gray-700 dark:bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center animate-pulse">
            <div className="bg-muted h-7 w-24 mx-auto mb-4 rounded" />
            <div className="bg-muted h-5 w-64 mx-auto rounded" />
          </div>
        </div>
      </section>

      {/* Related Projects Skeleton */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="bg-muted h-8 w-48 mx-auto mb-12 rounded" />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-2xl bg-white shadow-lg dark:bg-gray-800"
                >
                  <div className="bg-muted aspect-video" />
                  <div className="p-6 space-y-3">
                    <div className="bg-muted h-6 w-20 rounded-full" />
                    <div className="bg-muted h-5 w-3/4 rounded" />
                    <div className="space-y-2">
                      <div className="bg-muted h-4 w-full rounded" />
                      <div className="bg-muted h-4 w-5/6 rounded" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Navigation Skeleton */}
      <section className="border-t border-gray-200 bg-gray-50 py-12 dark:border-gray-700 dark:bg-gray-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="bg-muted h-5 w-5 rounded" />
              <div className="space-y-1">
                <div className="bg-muted h-3 w-16 rounded" />
                <div className="bg-muted h-4 w-32 rounded" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="space-y-1 text-right">
                <div className="bg-muted h-3 w-12 rounded ml-auto" />
                <div className="bg-muted h-4 w-28 rounded" />
              </div>
              <div className="bg-muted h-5 w-5 rounded" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
