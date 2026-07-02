import { z } from 'zod';
import {
  sessionStatusSchema,
  interviewerSchema,
  likelyTopicSchema,
  yourNumberSchema,
  stackMapEntrySchema,
} from '@/lib/interview-prep/schemas';

export const sessionAdminSchema = z.object({
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'Slug must be URL-friendly'),
  company: z.string().min(1, 'Company is required').max(200),
  role: z.string().min(1, 'Role is required').max(200),
  round: z.string().min(1, 'Round is required').max(200),
  scheduled_at: z.string().nullable(),
  status: sessionStatusSchema,
  product: z.string().nullable(),
  interviewers: z.array(interviewerSchema),
  likely_topics: z.array(likelyTopicSchema),
  your_numbers: z.array(yourNumberSchema),
  bottom_line: z.string().nullable(),
  stack_map: z.array(stackMapEntrySchema),
  focus_category_ids: z.array(z.string().uuid()),
});
