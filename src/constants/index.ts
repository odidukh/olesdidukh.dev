/**
 * Application-wide constants
 * Centralizes magic numbers and configuration values for maintainability
 */

/**
 * Animation timing constants
 * Used for consistent motion across the application
 */
export const ANIMATION = {
  /** Particle count for background effects */
  PARTICLE_COUNT: 50,

  /** Standard transition durations in seconds */
  DURATION: {
    FAST: 0.3,
    NORMAL: 0.5,
    SLOW: 0.6,
    EXTRA_SLOW: 1,
  },

  /** Stagger delays for sequential animations */
  STAGGER: {
    FAST: 0.05,
    NORMAL: 0.1,
    SLOW: 0.2,
  },

  /** Initial delays for entrance animations */
  DELAY: {
    NONE: 0,
    SHORT: 0.1,
    MEDIUM: 0.2,
    LONG: 0.5,
  },
} as const;

/**
 * Tailwind breakpoint values in pixels
 * Mirrors Tailwind's default breakpoints for JS usage
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Layout and spacing constants
 */
export const LAYOUT = {
  /** Container max widths */
  MAX_WIDTH: {
    PROSE: 65, // ch units for readable content
    CONTAINER: 1280,
  },

  /** Navigation heights */
  NAV_HEIGHT: 80,

  /** Section padding */
  SECTION_PADDING: {
    SM: 48,
    MD: 64,
    LG: 96,
  },
} as const;

/**
 * Form validation constants
 */
export const VALIDATION = {
  /** Character limits */
  MAX_LENGTH: {
    NAME: 100,
    EMAIL: 254,
    SUBJECT: 200,
    MESSAGE: 5000,
    COMPANY: 200,
  },

  /** Minimum lengths */
  MIN_LENGTH: {
    NAME: 2,
    MESSAGE: 10,
  },
} as const;

/**
 * Rate limiting constants
 */
export const RATE_LIMIT = {
  /** Contact form submissions per window */
  CONTACT_FORM: {
    MAX_REQUESTS: 5,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
  },

  /** Newsletter subscriptions per window */
  NEWSLETTER: {
    MAX_REQUESTS: 3,
    WINDOW_MS: 60 * 60 * 1000, // 1 hour
  },
} as const;

/**
 * SEO and metadata constants
 */
export const SEO = {
  /** Site base URL */
  SITE_URL: 'https://olesdidukh.dev',

  /** Default meta description length limit */
  DESCRIPTION_MAX_LENGTH: 160,

  /** Social image dimensions */
  OG_IMAGE: {
    WIDTH: 1200,
    HEIGHT: 630,
  },
} as const;
