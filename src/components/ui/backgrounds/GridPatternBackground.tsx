'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface GridPatternBackgroundProps {
  /** Grid cell size in pixels */
  gridSize?: number;
  /** Dot or line style */
  variant?: 'dots' | 'lines' | 'dashed';
  /** Enable mouse interaction glow */
  interactive?: boolean;
  /** Glow color */
  glowColor?: string;
  /** Base pattern color */
  patternColor?: string;
}

export function GridPatternBackground({
  gridSize = 40,
  variant = 'dots',
  interactive = true,
  glowColor = 'rgba(164, 120, 100, 0.4)',
  patternColor = 'rgba(128, 128, 128, 0.15)',
}: GridPatternBackgroundProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const patternId = React.useId();

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* SVG Pattern */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          {variant === 'dots' && (
            <pattern
              id={patternId}
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx={gridSize / 2}
                cy={gridSize / 2}
                r={1.5}
                fill={patternColor}
              />
            </pattern>
          )}
          {variant === 'lines' && (
            <pattern
              id={patternId}
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke={patternColor}
                strokeWidth="1"
              />
            </pattern>
          )}
          {variant === 'dashed' && (
            <pattern
              id={patternId}
              width={gridSize}
              height={gridSize}
              patternUnits="userSpaceOnUse"
            >
              <path
                d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                fill="none"
                stroke={patternColor}
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            </pattern>
          )}
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>

      {/* Interactive Glow */}
      {interactive && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            x: smoothX,
            y: smoothY,
            width: 400,
            height: 400,
            marginLeft: -200,
            marginTop: -200,
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          }}
        />
      )}
    </div>
  );
}
