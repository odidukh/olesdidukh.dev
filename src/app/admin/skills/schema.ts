import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(1, 'Skill name is required').max(100),
  category_id: z.string().min(1, 'Category is required'),
  level: z.enum(['Expert', 'Advanced', 'Intermediate', 'Learning']),
  years_of_experience: z.number().int().min(0).max(30),
  description: z.string().nullable(),
  last_used: z.string().nullable(),
  projects_count: z.number().int().min(0),
  sort_order: z.number().int().min(0),
});

export const skillCategorySchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  slug: z.string().min(1, 'Slug is required').max(100),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().min(1),
  color: z.string().min(1),
  sort_order: z.number().int().min(0),
});
