/**
 * Common shared types used across the application
 */

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  offset?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/**
 * Sort direction
 */
export type SortDirection = 'asc' | 'desc';

/**
 * Sort parameters
 */
export interface SortParams<T = string> {
  field: T;
  direction: SortDirection;
}

/**
 * Filter operator
 */
export type FilterOperator =
  | 'eq'
  | 'neq'
  | 'gt'
  | 'gte'
  | 'lt'
  | 'lte'
  | 'like'
  | 'in';

/**
 * Filter parameter
 */
export interface FilterParam<T = unknown> {
  field: string;
  operator: FilterOperator;
  value: T;
}

/**
 * Image with dimensions
 */
export interface ImageWithDimensions {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

/**
 * Link with label
 */
export interface LabeledLink {
  label: string;
  href: string;
  external?: boolean;
}

/**
 * SEO metadata
 */
export interface SeoMetadata {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  canonicalUrl?: string;
}

/**
 * Breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

/**
 * Navigation item
 */
export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
}

/**
 * Social link
 */
export interface SocialLink {
  platform: 'github' | 'linkedin' | 'twitter' | 'email' | 'website';
  url: string;
  label: string;
}
