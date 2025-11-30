/**
 * Zod validation schemas for project-related data
 */

import { z } from 'zod';

/**
 * Project categories enum schema
 */
export const projectCategorySchema = z.enum([
  'Web App',
  'Mobile App',
  'E-Commerce',
  'SaaS',
  'Dashboard',
  'Landing Page',
  'API',
  'Open Source',
]);

export type ProjectCategory = z.infer<typeof projectCategorySchema>;

/**
 * Project video schema
 */
export const projectVideoSchema = z.object({
  url: z.string().url('Invalid video URL'),
  thumbnail: z.string().url('Invalid thumbnail URL'),
  title: z.string().min(1, 'Video title is required'),
  duration: z.string().optional(),
});

export type ProjectVideo = z.infer<typeof projectVideoSchema>;

/**
 * Project result/metric schema
 */
export const projectResultSchema = z.object({
  metric: z.string().min(1, 'Metric name is required'),
  value: z.string().min(1, 'Metric value is required'),
  description: z.string().optional(),
});

export type ProjectResult = z.infer<typeof projectResultSchema>;

/**
 * Project testimonial schema
 */
export const projectTestimonialSchema = z.object({
  text: z.string().min(10, 'Testimonial must be at least 10 characters'),
  author: z.string().min(1, 'Author name is required'),
  role: z.string().min(1, 'Author role is required'),
  company: z.string().optional(),
  avatar: z.string().url('Invalid avatar URL').optional(),
});

export type ProjectTestimonial = z.infer<typeof projectTestimonialSchema>;

/**
 * Project metadata schema (for listings)
 */
export const projectMetaSchema = z.object({
  id: z.string().min(1, 'Project ID is required'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(500, 'Description too long'),
  category: projectCategorySchema,
  technologies: z
    .array(z.string().min(1))
    .min(1, 'At least one technology required'),
  image: z.string().min(1, 'Image path is required'),
  featured: z.boolean().optional(),
  year: z
    .number()
    .int()
    .min(2000, 'Year must be 2000 or later')
    .max(new Date().getFullYear() + 1, 'Year cannot be in the future'),
});

export type ProjectMeta = z.infer<typeof projectMetaSchema>;

/**
 * Full project schema with all details
 */
export const projectFullSchema = projectMetaSchema.extend({
  longDescription: z.string().optional(),
  images: z.array(z.string()).optional(),
  video: projectVideoSchema.optional(),
  duration: z.string().optional(),
  role: z.string().optional(),
  team: z.string().optional(),
  client: z.string().optional(),
  challenges: z.array(z.string()).optional(),
  solutions: z.array(z.string()).optional(),
  results: z.array(projectResultSchema).optional(),
  testimonial: projectTestimonialSchema.optional(),
  liveUrl: z.string().url('Invalid live URL').optional(),
  githubUrl: z.string().url('Invalid GitHub URL').optional(),
  demoUrl: z.string().url('Invalid demo URL').optional(),
});

export type ProjectFull = z.infer<typeof projectFullSchema>;

/**
 * Project filter options schema
 */
export const projectFilterOptionsSchema = z.object({
  category: projectCategorySchema.optional(),
  technology: z.string().optional(),
  featured: z.boolean().optional(),
  year: z.number().int().optional(),
});

export type ProjectFilterOptions = z.infer<typeof projectFilterOptionsSchema>;

/**
 * Project sort field schema
 */
export const projectSortFieldSchema = z.enum(['year', 'title', 'category']);

export type ProjectSortField = z.infer<typeof projectSortFieldSchema>;

/**
 * Testimonial with project reference schema
 */
export const testimonialWithProjectSchema = projectTestimonialSchema.extend({
  projectId: z.string().min(1, 'Project ID is required'),
  projectTitle: z.string().min(1, 'Project title is required'),
});

export type TestimonialWithProject = z.infer<
  typeof testimonialWithProjectSchema
>;

/**
 * Validate project data
 * @throws ZodError if validation fails
 */
export function validateProject(data: unknown): ProjectFull {
  return projectFullSchema.parse(data);
}

/**
 * Safely validate project data
 * @returns Result object with success status and data/error
 */
export function safeParseProject(data: unknown) {
  return projectFullSchema.safeParse(data);
}

/**
 * Validate project metadata
 */
export function validateProjectMeta(data: unknown): ProjectMeta {
  return projectMetaSchema.parse(data);
}

/**
 * Validate an array of projects
 */
export function validateProjects(data: unknown[]): ProjectMeta[] {
  return z.array(projectMetaSchema).parse(data);
}
