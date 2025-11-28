/**
 * Blog-related types
 */

/**
 * Blog post category
 */
export type BlogCategory =
  | 'React'
  | 'TypeScript'
  | 'Next.js'
  | 'Performance'
  | 'CSS'
  | 'Testing'
  | 'Career'
  | 'Architecture';

/**
 * Blog post metadata (for listings)
 */
export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  author: string;
  readingTime: number;
  featured?: boolean;
  image?: string;
}

/**
 * Full blog post with content
 */
export interface BlogPostFull extends BlogPostMeta {
  content: string;
}

/**
 * Blog post filter options
 */
export interface BlogFilterOptions {
  category?: BlogCategory;
  tag?: string;
  search?: string;
  featured?: boolean;
}

/**
 * Blog post sort options
 */
export type BlogSortField = 'publishedAt' | 'title' | 'readingTime';
