// eslint-disable-next-line no-restricted-imports
import { posts } from '../../.velite';
import { ALL_FILTER } from '@/constants';

// eslint-disable-next-line no-restricted-imports
export type { Post as BlogPost } from '../../.velite';
// eslint-disable-next-line no-restricted-imports
export type { Post as BlogPostMeta } from '../../.velite';

export const blogPosts = posts.sort(
  (a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

export const blogCategories = [
  ALL_FILTER,
  ...new Set(posts.map(post => post.category)),
];

export const DEFAULT_AUTHOR = {
  name: 'Oles Didukh',
  avatar: '/images/avatar.png',
  role: 'Senior Front-End Engineer',
};

export function getPostsByCategory(category: string) {
  if (category === ALL_FILTER) return blogPosts;
  return blogPosts.filter(post => post.category === category);
}

export function searchPosts(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return blogPosts.filter(
    post =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
      post.category.toLowerCase().includes(lowercaseQuery)
  );
}

export function getPostBySlug(slug: string) {
  return posts.find(post => post.slug === slug) || null;
}

export function getFeaturedPosts() {
  return blogPosts.filter(post => post.featured);
}

export function getRelatedPosts(slug: string, limit = 3) {
  const currentPost = getPostBySlug(slug);
  if (!currentPost) return [];

  return blogPosts
    .filter(post => post.slug !== slug)
    .filter(
      post =>
        post.category === currentPost.category ||
        post.tags.some(tag => currentPost.tags.includes(tag))
    )
    .slice(0, limit);
}
