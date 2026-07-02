import { z } from 'zod';

export const customQuestionSchema = z.object({
  question: z.string().min(1, 'Question is required').max(1000),
  model_answer: z.string().max(5000).nullable(),
  category_id: z.string().min(1, 'Category is required').nullable(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
});

export type CustomQuestionInput = z.infer<typeof customQuestionSchema>;
