'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BackToTop() {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [300, 400], [0, 1]);
  const scale = useTransform(scrollY, [300, 400], [0.8, 1]);
  const pointerEvents = useTransform(scrollY, value =>
    value > 350 ? 'auto' : 'none'
  );

  const handleClick = () => {
    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    });
  };

  return (
    <motion.button
      style={{ opacity, scale, pointerEvents }}
      onClick={handleClick}
      className={cn(
        'fixed bottom-20 right-6 z-50 h-10 w-10 rounded-full',
        'bg-primary text-primary-foreground shadow-lg shadow-primary/20',
        'flex items-center justify-center',
        'hover:bg-primary/90 transition-colors',
        'sm:bottom-6' // On mobile push up above any bottom nav affordance
      )}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp className="h-4 w-4" />
    </motion.button>
  );
}
