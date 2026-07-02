import { z } from 'zod';

export const difficultySchema = z.enum(['easy', 'medium', 'hard']);
export const sessionStatusSchema = z.enum(['upcoming', 'done', 'archived']);
export const progressStatusSchema = z.enum(['new', 'learning', 'known']);

export const tipSchema = z.object({
  point: z.string().min(1),
  detail: z.string().nullable(),
});

export const interviewerSchema = z.object({
  name: z.string().min(1),
  role: z.string(),
  focus: z.string(),
});

export const likelyTopicSchema = z.object({
  topic: z.string().min(1),
  whereToDrill: z.string(),
});

export const yourNumberSchema = z.object({
  label: z.string().min(1),
  value: z.string(),
});

export const stackMapEntrySchema = z.object({
  theirTech: z.string().min(1),
  yourStanding: z.string(),
});

export type Difficulty = z.infer<typeof difficultySchema>;
export type SessionStatus = z.infer<typeof sessionStatusSchema>;
export type ProgressStatus = z.infer<typeof progressStatusSchema>;
export type Tip = z.infer<typeof tipSchema>;
export type Interviewer = z.infer<typeof interviewerSchema>;
export type LikelyTopic = z.infer<typeof likelyTopicSchema>;
export type YourNumber = z.infer<typeof yourNumberSchema>;
export type StackMapEntry = z.infer<typeof stackMapEntrySchema>;
