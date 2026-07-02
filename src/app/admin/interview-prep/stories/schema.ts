import { z } from 'zod';

export const storyAdminSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  company: z.string().max(200).nullable(),
  situation: z.string().min(1, 'Situation is required'),
  task: z.string().min(1, 'Task is required'),
  action: z.string().min(1, 'Action is required'),
  result: z.string().min(1, 'Result is required'),
  metrics: z.string().nullable(),
  tags: z.array(z.string().max(50)),
  sort_order: z.number().int('Sort order must be a whole number'),
});
