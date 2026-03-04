import type { Variants } from 'framer-motion';

/**
 * Animation and visual effect configuration
 *
 * Centralized configuration for animations, particle effects, video player settings,
 * and shared Framer Motion variants.
 */

// ─── Shared Framer Motion Variants ──────────────────────────────────────────

/** Container variant that staggers children with fade-in */
export const staggerContainer = (
  staggerChildren = 0.1,
  delayChildren = 0
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren, delayChildren },
  },
});

/** Fade up from below — the most common item animation */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

/** Fade up with spring physics (for hero-style elements) */
export const fadeInUpSpring: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 100, damping: 10 },
  },
};

/** Slide in from the left */
export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5 },
  },
};

/** Section-level fade up (larger y offset for more dramatic entrance) */
export const sectionFadeIn: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, staggerChildren: 0.1 },
  },
};

/** Standard card hover — lift up slightly */
export const cardHover = { y: -5 };

/** Standard list item hover — nudge right */
export const listItemHover = { x: 5 };

// ─── Display Limits ─────────────────────────────────────────────────────────

/** Maximum number of tags/technologies shown on cards before "+X more" */
export const DISPLAY_LIMITS = {
  blogCardTags: 3,
  featuredPostTags: 4,
  projectCardTechnologies: {
    grid: 3,
    list: 5,
  },
  projectResultsPreview: 2,
} as const;

// ─── Particle & Video Configuration ─────────────────────────────────────────

/**
 * Particle field configuration for the background effect
 */
export const PARTICLE_CONFIG = {
  /** Number of particles on mobile devices (< 768px) */
  MOBILE_COUNT: 20,
  /** Number of particles on desktop devices */
  DESKTOP_COUNT: 40,
  /** Mobile breakpoint in pixels */
  MOBILE_BREAKPOINT: 768,
  /** Minimum particle size in pixels */
  SIZE_MIN: 1,
  /** Maximum additional size in pixels (total max = SIZE_MIN + SIZE_RANGE) */
  SIZE_RANGE: 4,
  /** Minimum animation duration in seconds */
  DURATION_MIN: 20,
  /** Maximum additional duration in seconds */
  DURATION_RANGE: 20,
  /** Maximum delay before particle animation starts */
  MAX_DELAY: 5,
  /** Minimum particle opacity */
  OPACITY_MIN: 0.2,
  /** Maximum additional opacity */
  OPACITY_RANGE: 0.5,
  /** Debounce delay for resize handler in milliseconds */
  RESIZE_DEBOUNCE_MS: 250,
  /** Distance threshold for mouse glow effect */
  GLOW_DISTANCE_THRESHOLD: 30,
  /** Distance threshold for particle connection lines */
  CONNECTION_DISTANCE_THRESHOLD: 15,
} as const;

/**
 * Video player configuration
 */
export const VIDEO_PLAYER_CONFIG = {
  /** Root margin for intersection observer (preload before visible) */
  INTERSECTION_ROOT_MARGIN: '100px',
  /** Intersection threshold for triggering visibility */
  INTERSECTION_THRESHOLD: 0.1,
  /** Double-tap interval for fullscreen toggle in milliseconds */
  DOUBLE_TAP_INTERVAL_MS: 300,
  /** Seek time in seconds for forward/backward skip */
  SEEK_SECONDS: 10,
} as const;
