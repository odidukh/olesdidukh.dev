import { z } from 'zod';

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required').max(200),
  position: z.string().min(1, 'Position is required').max(200),
  location: z.string().min(1, 'Location is required').max(200),
  duration: z.string().min(1, 'Duration is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().nullable(),
  type: z.enum(['Full-time', 'Contract', 'Part-time']),
  company_url: z.string().url('Must be a valid URL').nullable(),
  description: z.string().min(1, 'Description is required'),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
  team_size: z.string().nullable(),
  highlights: z.array(z.unknown()),
  sort_order: z.number().int().min(0),
});
