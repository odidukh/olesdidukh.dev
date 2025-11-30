/**
 * Project filter configuration
 *
 * Centralized configuration for project filtering options.
 * Modify these arrays to update the available filter choices.
 */

import { ALL_FILTER } from '@/constants';

/** Available project categories for filtering */
export const PROJECT_CATEGORIES = [
  ALL_FILTER,
  'Web Application',
  'E-Commerce',
  'SaaS',
  'Mobile App',
  'Open Source',
  'UI/UX Design',
] as const;

/** Available technologies for filtering */
export const PROJECT_TECHNOLOGIES = [
  'React',
  'TypeScript',
  'Next.js',
  'Node.js',
  'GraphQL',
  'PostgreSQL',
  'MongoDB',
  'Redux',
  'Tailwind CSS',
  'AWS',
  'Docker',
  'React Native',
] as const;

/** Type for project categories */
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** Type for project technologies */
export type ProjectTechnology = (typeof PROJECT_TECHNOLOGIES)[number];
