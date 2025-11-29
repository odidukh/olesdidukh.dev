/**
 * Animation Constants and Presets
 *
 * Centralized animation configuration for consistent motion design.
 * Based on design system principles and accessibility considerations.
 */

// =============================================================================
// TIMING CONSTANTS
// =============================================================================

/**
 * Standard animation durations (in seconds)
 */
export const DURATION = {
  /** Micro interactions (hover, focus) */
  micro: 0.15,
  /** Standard transitions */
  standard: 0.3,
  /** Complex animations */
  complex: 0.5,
  /** Page transitions */
  page: 0.6,
  /** Slow, deliberate animations */
  slow: 0.8,
} as const;

/**
 * Stagger delays for sequential animations (in seconds)
 */
export const STAGGER = {
  fast: 0.05,
  standard: 0.1,
  slow: 0.15,
} as const;

// =============================================================================
// EASING FUNCTIONS
// =============================================================================

/**
 * Standard easing curves (CSS cubic-bezier format)
 */
export const EASING = {
  /** Default ease for most animations */
  default: [0.4, 0.0, 0.2, 1] as const,
  /** For elements entering the screen */
  easeOut: [0.0, 0.0, 0.2, 1] as const,
  /** For elements leaving the screen */
  easeIn: [0.4, 0.0, 1, 1] as const,
  /** For emphasized animations */
  emphasized: [0.2, 0.0, 0, 1] as const,
} as const;

/**
 * Spring configurations
 */
export const SPRING = {
  /** Standard spring */
  standard: { type: 'spring' as const, stiffness: 300, damping: 30 },
  /** Gentle spring for larger elements */
  gentle: { type: 'spring' as const, stiffness: 200, damping: 25 },
  /** Bouncy spring */
  bouncy: { type: 'spring' as const, stiffness: 400, damping: 20 },
} as const;

// =============================================================================
// TRANSITION PRESETS
// =============================================================================

/**
 * Pre-configured transition objects for framer-motion
 */
export const transition = {
  /** Fast micro-interaction */
  micro: {
    duration: DURATION.micro,
    ease: EASING.default,
  },
  /** Standard transition for most use cases */
  standard: {
    duration: DURATION.standard,
    ease: EASING.default,
  },
  /** Smooth entrance animation */
  enter: {
    duration: DURATION.standard,
    ease: EASING.easeOut,
  },
  /** Smooth exit animation */
  exit: {
    duration: DURATION.standard,
    ease: EASING.easeIn,
  },
  /** Complex multi-step animation */
  complex: {
    duration: DURATION.complex,
    ease: EASING.emphasized,
  },
  /** Page transition */
  page: {
    duration: DURATION.page,
    ease: EASING.emphasized,
  },
} as const;

// =============================================================================
// ANIMATION VARIANTS (for framer-motion)
// =============================================================================

/**
 * Fade in/out
 */
export const fadeVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
} as const;

/**
 * Slide up (for cards, list items)
 */
export const slideUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
} as const;

/**
 * Slide down
 */
export const slideDownVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
} as const;

/**
 * Slide from left
 */
export const slideLeftVariants = {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
} as const;

/**
 * Slide from right
 */
export const slideRightVariants = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 50 },
} as const;

/**
 * Scale (for modals, popups)
 */
export const scaleVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
} as const;

/**
 * Pop (for buttons, badges)
 */
export const popVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
} as const;

/**
 * Stagger container
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: STAGGER.standard,
      delayChildren: 0.1,
    },
  },
} as const;

/**
 * Stagger item (use with staggerContainer)
 */
export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
} as const;

/**
 * Collapse/expand (for accordions, dropdowns)
 */
export const collapseVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { opacity: 1, height: 'auto' },
  exit: { opacity: 0, height: 0 },
} as const;

// =============================================================================
// HOVER & TAP ANIMATIONS
// =============================================================================

/**
 * Standard hover scale effect
 */
export const hoverScale = {
  scale: 1.02,
  transition: { duration: DURATION.micro },
} as const;

/**
 * Tap/press scale effect
 */
export const tapScale = {
  scale: 0.98,
} as const;

/**
 * Lift effect (for cards)
 */
export const hoverLift = {
  y: -4,
  transition: { duration: DURATION.micro },
} as const;

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Create stagger children configuration
 */
export function createStagger(delay: number = STAGGER.standard) {
  return {
    staggerChildren: delay,
  };
}

/**
 * Check if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Get animation props respecting reduced motion preference
 * Returns simplified animation for users who prefer reduced motion
 */
export function getReducedMotionProps<T extends object>(
  normalProps: T,
  reducedProps?: Partial<T>
): T {
  if (prefersReducedMotion()) {
    return {
      ...normalProps,
      ...reducedProps,
      transition: { duration: 0 },
    } as T;
  }
  return normalProps;
}

// =============================================================================
// CSS TRANSITION CLASSES
// =============================================================================

/**
 * Tailwind CSS transition class presets
 */
export const cssTransition = {
  /** Fast color/opacity changes */
  colors: 'transition-colors duration-150',
  /** Standard all-property transition */
  all: 'transition-all duration-300',
  /** Transform transitions (scale, translate) */
  transform: 'transition-transform duration-300',
  /** Opacity transitions */
  opacity: 'transition-opacity duration-300',
  /** Shadow transitions */
  shadow: 'transition-shadow duration-300',
} as const;
