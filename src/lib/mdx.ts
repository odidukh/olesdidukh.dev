// eslint-disable-next-line no-restricted-imports
import { posts } from '../../.velite';
import { ALL_FILTER } from '@/constants';

// eslint-disable-next-line no-restricted-imports
export type { Post as BlogPostMeta } from '../../.velite';
// eslint-disable-next-line no-restricted-imports
export type { Post as BlogPost } from '../../.velite';

/**
 * Get all blog post slugs
 */
export function getAllPostSlugs(): string[] {
  return posts.map(post => post.slug);
}

/**
 * Get a single blog post by slug
 */
export function getPostBySlug(slug: string) {
  return posts.find(post => post.slug === slug) || null;
}

/**
 * Get all blog posts with metadata
 */
export function getAllPosts() {
  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get featured posts
 */
export function getFeaturedPosts() {
  return getAllPosts().filter(post => post.featured);
}

/**
 * Get posts by category
 */
export function getPostsByCategory(category: string) {
  if (category === ALL_FILTER) return getAllPosts();
  return getAllPosts().filter(post => post.category === category);
}

/**
 * Search posts by query
 */
export function searchPosts(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return getAllPosts().filter(
    post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      post.category.toLowerCase().includes(lowercaseQuery)
  );
}

/**
 * Get related posts based on category and tags
 */
export function getRelatedPosts(
  currentSlug: string,
  limit: number = 3
) {
  const currentPost = getPostBySlug(currentSlug);
  if (!currentPost) return [];

  const allPosts = getAllPosts();

  return allPosts
    .filter(post => post.slug !== currentSlug)
    .map(post => {
      const commonTags = post.tags.filter(tag =>
        currentPost.tags.includes(tag)
      ).length;
      const sameCategory = post.category === currentPost.category ? 2 : 0;
      return {
        post,
        score: commonTags + sameCategory,
      };
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * Get all unique categories from posts
 */
export function getAllCategories(): string[] {
  const categories = new Set(posts.map(post => post.category));
  return [ALL_FILTER, ...Array.from(categories)];
}

/**
 * Get all unique tags from posts
 */
export function getAllTags(): string[] {
  const tags = new Set(posts.flatMap(post => post.tags));
  return Array.from(tags);
}

