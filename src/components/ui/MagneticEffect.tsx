'use client';

import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { useMagneticHover } from '@/hooks/useMagneticHover';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MagneticEffectProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}

export function MagneticEffect({
  children,
  className,
  strength = 15,
}: MagneticEffectProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y, handleMouseMove, handleMouseLeave } = useMagneticHover(
    ref,
    strength
  );
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={cn('relative inline-flex z-10', className)}
    >
      {children}
    </motion.div>
  );
}
