import { z } from 'zod';

export const blogPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500),
  content: z.string().min(1, 'Content is required'),
  cover_image: z
    .string()
    .max(500)
    .refine(
      val => val === '' || val.startsWith('/') || val.startsWith('https://'),
      'Cover image must be a relative path or HTTPS URL'
    )
    .optional()
    .default(''),
  category: z.enum([
    'React',
    'TypeScript',
    'Web Development',
    'Performance',
    'Career',
    'Tutorial',
    'Best Practices',
    'Tools',
    'Open Source',
  ]),
  tags: z.array(z.string().max(50)).max(20),
  reading_time: z.number().int().min(1).max(999),
  featured: z.boolean(),
  published: z.boolean(),
  published_at: z.string().nullable(),
  series_name: z.string().max(200).nullable(),
  series_part: z.number().int().min(1).nullable(),
  series_total: z.number().int().min(1).nullable(),
});
