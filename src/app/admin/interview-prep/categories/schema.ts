import { z } from 'zod';

export const categoryAdminSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  weight: z.number().min(0, 'Weight must be at least 0'),
  sort_order: z.number().int('Sort order must be a whole number'),
});
