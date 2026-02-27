import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { BlogErrorFallback } from '@/components/ui/SectionErrorFallback';
import { BlogSectionClient } from './BlogSectionClient';
import { blogPosts } from '@/data/blog';
import { getFallbackImageBlur } from '@/lib/images';

/**
 * Client component wrapper for BlogSection with ErrorBoundary.
 * This wrapper is needed because ErrorBoundary's fallbackRender prop
 * is a function, which cannot be passed from Server to Client Components.
 */
export async function BlogSection() {
  const postsWithBlur = await Promise.all(
    blogPosts.map(async post => {
      const blurDataURL = await getFallbackImageBlur(post.coverImage);
      return { ...post, blurDataURL };
    })
  );

  return (
    <ErrorBoundary sectionName="Blog" fallbackRender={BlogErrorFallback}>
      <BlogSectionClient initialPosts={postsWithBlur} />
    </ErrorBoundary>
  );
}
