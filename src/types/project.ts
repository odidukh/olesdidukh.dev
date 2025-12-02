/**
 * Project-related types
 */

/**
 * Project category
 */
export type ProjectCategory =
  | 'Web App'
  | 'Mobile App'
  | 'E-Commerce'
  | 'SaaS'
  | 'Dashboard'
  | 'Landing Page'
  | 'API';

/**
 * Project video configuration
 */
export interface ProjectVideo {
  url: string;
  thumbnail: string;
  title: string;
  duration?: string;
}

/**
 * Project result/metric
 */
export interface ProjectResult {
  metric: string;
  value: string;
  description?: string;
}

/**
 * Project testimonial
 */
export interface ProjectTestimonial {
  text: string;
  author: string;
  role: string;
  company?: string;
  avatar?: string;
}

/**
 * Project metadata (for listings)
 */
export interface ProjectMeta {
  id: string;
  slug: string;
  title: string;
  description: string;
  category: ProjectCategory;
  technologies: string[];
  image: string;
  featured?: boolean;
  year: number;
}

/**
 * Full project with all details
 */
export interface ProjectFull extends ProjectMeta {
  longDescription?: string;
  images?: string[];
  video?: ProjectVideo;
  duration?: string;
  role?: string;
  team?: string;
  client?: string;
  challenges?: string[];
  solutions?: string[];
  results?: ProjectResult[];
  testimonial?: ProjectTestimonial;
  liveUrl?: string;
  githubUrl?: string;
  demoUrl?: string;
}

/**
 * Project filter options
 */
export interface ProjectFilterOptions {
  category?: ProjectCategory;
  technology?: string;
  featured?: boolean;
  year?: number;
}

/**
 * Project sort options
 */
export type ProjectSortField = 'year' | 'title' | 'category';

/**
 * Testimonial with project reference
 */
export interface TestimonialWithProject extends ProjectTestimonial {
  projectId: string;
  projectTitle: string;
}
