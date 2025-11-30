/**
 * Contact form configuration options
 *
 * Centralized configuration for contact form dropdown options.
 * Modify these arrays to update the available choices in the contact form.
 */

/** Available project types for the contact form */
export const PROJECT_TYPES = [
  'Web Application',
  'E-Commerce Site',
  'SaaS Platform',
  'Mobile App',
  'UI/UX Design',
  'Consulting',
  'Other',
] as const;

/** Budget range options */
export const BUDGET_RANGES = [
  'Under $5k',
  '$5k - $10k',
  '$10k - $25k',
  '$25k - $50k',
  '$50k+',
  'Not Sure',
] as const;

/** Project timeline options */
export const TIMELINES = [
  'ASAP',
  '1-2 weeks',
  '1 month',
  '2-3 months',
  '3-6 months',
  'Flexible',
] as const;

/** Type for project types */
export type ProjectType = (typeof PROJECT_TYPES)[number];

/** Type for budget ranges */
export type BudgetRange = (typeof BUDGET_RANGES)[number];

/** Type for timelines */
export type Timeline = (typeof TIMELINES)[number];
