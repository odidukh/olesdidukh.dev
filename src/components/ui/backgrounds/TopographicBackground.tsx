'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface TopographicBackgroundProps {
  /** Number of contour layers */
  layers?: number;
  /** Line color */
  lineColor?: string;
  /** Line opacity */
  lineOpacity?: number;
  /** Animate the contours */
  animated?: boolean;
  /** Animation speed */
  speed?: number;
}

export function TopographicBackground({
  layers = 8,
  lineColor = 'currentColor',
  lineOpacity = 0.15,
  animated = true,
  speed = 1,
}: TopographicBackgroundProps) {
  // Generate contour paths
  const contours = React.useMemo(() => {
    return Array.from({ length: layers }, (_, i) => {
      const scale = 0.3 + (i / layers) * 0.7;
      const offsetX = 50 + Math.sin(i * 0.8) * 20;
      const offsetY = 50 + Math.cos(i * 0.8) * 15;

      // Create organic-looking contour paths
      const points = Array.from({ length: 8 }, (_, j) => {
        const angle = (j / 8) * Math.PI * 2;
        const radius =
          30 + Math.sin(angle * 3 + i) * 10 + Math.cos(angle * 2) * 5;
        const x = offsetX + Math.cos(angle) * radius * scale;
        const y = offsetY + Math.sin(angle) * radius * scale;
        return { x, y };
      });

      // Create smooth path
      const pathData = points.reduce((acc, point, j) => {
        if (j === 0) {
          return `M ${point.x} ${point.y}`;
        }
        const prev = points[j - 1]!;
        const cpX = (prev.x + point.x) / 2;
        const cpY = (prev.y + point.y) / 2;
        return `${acc} Q ${prev.x} ${prev.y} ${cpX} ${cpY}`;
      }, '');

      // Close the path
      const firstPoint = points[0]!;
      const lastPoint = points[points.length - 1]!;
      const closePath = ` Q ${lastPoint.x} ${lastPoint.y} ${(lastPoint.x + firstPoint.x) / 2} ${(lastPoint.y + firstPoint.y) / 2} Z`;

      return {
        id: i,
        path: pathData + closePath,
        delay: i * 0.2,
        duration: (10 + i * 2) / speed,
      };
    });
  }, [layers, speed]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {contours.map(contour => (
          <motion.path
            key={contour.id}
            d={contour.path}
            fill="none"
            stroke={lineColor}
            strokeWidth="0.3"
            strokeOpacity={lineOpacity}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              animated
                ? {
                    pathLength: [0, 1],
                    opacity: [0, lineOpacity, lineOpacity],
                    scale: [0.95, 1, 1.05, 1],
                  }
                : { pathLength: 1, opacity: lineOpacity }
            }
            transition={{
              pathLength: {
                duration: contour.duration,
                repeat: Infinity,
                ease: 'linear',
              },
              opacity: {
                duration: 2,
                delay: contour.delay,
              },
              scale: {
                duration: contour.duration * 2,
                repeat: Infinity,
                ease: 'easeInOut',
              },
            }}
          />
        ))}

        {/* Add some elevation markers */}
        {contours
          .filter((_, i) => i % 3 === 0)
          .map((contour, i) => (
            <motion.circle
              key={`marker-${contour.id}`}
              cx={50 + Math.sin(i) * 15}
              cy={50 + Math.cos(i) * 10}
              r="0.5"
              fill={lineColor}
              fillOpacity={lineOpacity * 2}
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1, 0] }}
              transition={{
                duration: 4 / speed,
                delay: contour.delay + 1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
      </svg>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, transparent 0%, var(--background) 70%)`,
          opacity: 0.5,
        }}
      />
    </div>
  );
}
