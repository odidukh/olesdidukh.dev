/**
 * Project filter configuration
 *
 * Centralized configuration for project filtering options.
 * Modify these arrays to update the available filter choices.
 */

import { ALL_FILTER } from '@/constants';

/** Available project categories for filtering — must match MDX frontmatter */
export const PROJECT_CATEGORIES = [
  ALL_FILTER,
  'Web Application',
  'FinTech',
  'Design System',
  'Enterprise',
  'Mobile',
  'Data Visualization',
  'Personal Project',
] as const;

/** Available technologies for filtering — aligned with MDX projects */
export const PROJECT_TECHNOLOGIES = [
  'React',
  'TypeScript',
  'Next.js',
  'Redux',
  'JavaScript',
  'React Native',
  'D3.js',
  'Zustand',
  'Material-UI',
  'Storybook',
  'SASS',
  'Webpack',
  'Tailwind CSS',
  'Framer Motion',
  'REST APIs',
  'WebSocket',
] as const;

/** Type for project categories */
export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

/** Type for project technologies */
export type ProjectTechnology = (typeof PROJECT_TECHNOLOGIES)[number];
