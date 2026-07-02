import { z } from 'zod';
import { difficultySchema, tipSchema } from '@/lib/interview-prep/schemas';

export const questionAdminSchema = z.object({
  question: z.string().min(1, 'Question is required').max(1000),
  model_answer: z.string().max(5000).nullable(),
  category_id: z.string().uuid('Invalid category').nullable(),
  story_id: z.string().uuid('Invalid story').nullable(),
  difficulty: difficultySchema,
  time_estimate_sec: z.number().int().min(0).nullable(),
  tags: z.array(z.string().max(50)),
  tips: z.array(tipSchema),
  is_custom: z.boolean(),
  source: z.string().max(100).nullable(),
});
