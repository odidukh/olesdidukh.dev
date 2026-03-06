import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  description: z.string().min(1, 'Description is required').max(500),
  long_description: z.string().min(1, 'Long description is required'),
  category: z.enum([
    'SaaS',
    'E-Commerce',
    'FinTech',
    'Healthcare',
    'Enterprise',
    'Mobile',
    'Other',
  ]),
  technologies: z.array(z.string().max(50)),
  image: z.string().min(1, 'Main image is required'),
  images: z.array(z.string()),
  demo_url: z.string().url('Must be a valid URL').nullable(),
  github_url: z.string().url('Must be a valid URL').nullable(),
  live_url: z.string().url('Must be a valid URL').nullable(),
  featured: z.boolean(),
  year: z.number().int().min(2000).max(2030),
  duration: z.string().min(1, 'Duration is required'),
  role: z.string().min(1, 'Role is required'),
  team: z.string().nullable(),
  client: z.string().nullable(),
  challenges: z.array(z.string()),
  solutions: z.array(z.string()),
  results: z.array(z.unknown()),
  published: z.boolean(),
});
