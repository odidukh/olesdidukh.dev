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
        'fixed bottom-24 right-6 z-50 h-11 w-11 rounded-full',
        'bg-primary text-primary-foreground shadow-lg shadow-primary/25',
        'flex items-center justify-center',
        'hover:bg-primary/90 hover:shadow-xl transition-all duration-200',
        'sm:bottom-8'
      )}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Back to top"
      title="Back to top"
    >
      <ArrowUp className="h-4 w-4" />
    </motion.button>
  );
}
