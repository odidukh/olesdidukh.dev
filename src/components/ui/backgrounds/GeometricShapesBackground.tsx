'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { seededRandom } from '@/lib/random';

interface GeometricShapesBackgroundProps {
  /** Shape type */
  shapeType?: 'mixed' | 'triangles' | 'hexagons' | 'circles' | 'code';
  /** Number of shapes */
  count?: number;
  /** Enable glassmorphism effect */
  glassmorphism?: boolean;
  /** Primary color */
  color?: string;
}

const shapes = {
  triangle: (size: number, color: string) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon
        points="50,10 90,90 10,90"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  ),
  hexagon: (size: number, color: string) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <polygon
        points="50,5 90,25 90,75 50,95 10,75 10,25"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  ),
  circle: (size: number, color: string) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
  ),
  bracket: (size: number, color: string) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d="M30,20 L20,20 L20,80 L30,80 M70,20 L80,20 L80,80 L70,80"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  tag: (size: number, color: string) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d="M20,50 L40,30 M40,30 L60,30 M60,70 L40,70 M40,70 L20,50 M80,50 L60,30 M60,70 L80,50"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
  slash: (size: number, color: string) => (
    <svg width={size} height={size} viewBox="0 0 100 100">
      <path
        d="M60,20 L40,80"
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  ),
};

type ShapeKey = keyof typeof shapes;

export function GeometricShapesBackground({
  shapeType = 'mixed',
  count = 15,
  glassmorphism = true,
  color = 'rgba(164, 120, 100, 0.3)',
}: GeometricShapesBackgroundProps) {
  const getShapeKeys = (): ShapeKey[] => {
    switch (shapeType) {
      case 'triangles':
        return ['triangle'];
      case 'hexagons':
        return ['hexagon'];
      case 'circles':
        return ['circle'];
      case 'code':
        return ['bracket', 'tag', 'slash'];
      default:
        return ['triangle', 'hexagon', 'circle'];
    }
  };

  const shapeKeys = getShapeKeys();

  const floatingShapes = React.useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      // Use index-based seeds for deterministic values
      const seed = i * 100 + 777;
      return {
        id: i,
        shapeKey: shapeKeys[i % shapeKeys.length] as ShapeKey,
        x: seededRandom(seed + 1) * 100,
        y: seededRandom(seed + 2) * 100,
        size: 40 + seededRandom(seed + 3) * 60,
        duration: 15 + seededRandom(seed + 4) * 20,
        delay: seededRandom(seed + 5) * 5,
        rotation: seededRandom(seed + 6) * 360,
      };
    });
  }, [count, shapeKeys]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingShapes.map(shape => (
        <motion.div
          key={shape.id}
          className="absolute"
          style={{
            left: `${shape.x}%`,
            top: `${shape.y}%`,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            rotate: shape.rotation,
          }}
          animate={{
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 1, 0.5],
            rotate: [shape.rotation, shape.rotation + 180],
            x: [0, 30, -20, 0],
            y: [0, -50, -100, -150],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <div
            className={
              glassmorphism ? 'backdrop-blur-sm bg-white/5 rounded-lg p-2' : ''
            }
          >
            {shapes[shape.shapeKey](shape.size, color)}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
