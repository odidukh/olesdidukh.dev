'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

export interface ReadinessRingProps {
  value: number; // 0..1 fraction
  size?: number;
  strokeWidth?: number;
  label?: string;
  className?: string;
}

export function ReadinessRing({
  value,
  size = 120,
  strokeWidth = 10,
  label,
  className,
}: ReadinessRingProps) {
  const reduced = useReducedMotion();
  const safeValue = Number.isFinite(value) ? value : 0;
  const clamped = Math.max(0, Math.min(1, safeValue));
  const pct = Math.round(clamped * 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped);
  const center = size / 2;

  return (
    <div
      role="img"
      aria-label={`${label ?? 'Readiness'}: ${pct} percent`}
      className={cn(
        'relative inline-flex items-center justify-center',
        className
      )}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-muted"
        />
        {reduced ? (
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="stroke-primary"
          />
        ) : (
          <motion.circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="stroke-primary"
          />
        )}
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className="text-2xl font-bold tabular-nums">{pct}%</span>
        {label && (
          <span className="mt-1 text-xs text-muted-foreground">{label}</span>
        )}
      </div>
    </div>
  );
}
