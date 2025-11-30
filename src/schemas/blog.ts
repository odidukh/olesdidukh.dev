/**
 * Zod validation schemas for blog-related data
 */

import { z } from 'zod';

/**
 * Blog categories enum schema
 */
export const blogCategorySchema = z.enum([
  'React',
  'TypeScript',
  'Next.js',
  'Performance',
  'CSS',
  'Testing',
  'Career',
  'Architecture',
]);

export type BlogCategory = z.infer<typeof blogCategorySchema>;

/**
 * Blog post metadata schema (for listings)
 */
export const blogPostMetaSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  excerpt: z
    .string()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(500, 'Excerpt too long'),
  category: blogCategorySchema,
  tags: z.array(z.string().min(1)).min(1, 'At least one tag required'),
  publishedAt: z.string().datetime({ message: 'Invalid date format' }),
  updatedAt: z.string().datetime({ message: 'Invalid date format' }).optional(),
  author: z.string().min(1, 'Author is required'),
  readingTime: z.number().int().positive('Reading time must be positive'),
  featured: z.boolean().optional(),
  image: z.string().url('Invalid image URL').optional(),
});

export type BlogPostMeta = z.infer<typeof blogPostMetaSchema>;

/**
 * Full blog post schema with content
 */
export const blogPostFullSchema = blogPostMetaSchema.extend({
  content: z.string().min(1, 'Content is required'),
});

export type BlogPostFull = z.infer<typeof blogPostFullSchema>;

/**
 * Blog filter options schema
 */
export const blogFilterOptionsSchema = z.object({
  category: blogCategorySchema.optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  featured: z.boolean().optional(),
});

export type BlogFilterOptions = z.infer<typeof blogFilterOptionsSchema>;

/**
 * Blog sort field schema
 */
export const blogSortFieldSchema = z.enum([
  'publishedAt',
  'title',
  'readingTime',
]);

export type BlogSortField = z.infer<typeof blogSortFieldSchema>;

/**
 * Validate blog post data
 * @throws ZodError if validation fails
 */
export function validateBlogPost(data: unknown): BlogPostFull {
  return blogPostFullSchema.parse(data);
}

/**
 * Safely validate blog post data
 * @returns Result object with success status and data/error
 */
export function safeParseBlogPost(data: unknown) {
  return blogPostFullSchema.safeParse(data);
}

/**
 * Validate blog post metadata
 */
export function validateBlogPostMeta(data: unknown): BlogPostMeta {
  return blogPostMetaSchema.parse(data);
}

/**
 * Validate an array of blog posts
 */
export function validateBlogPosts(data: unknown[]): BlogPostMeta[] {
  return z.array(blogPostMetaSchema).parse(data);
}
