'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface GradientMeshBackgroundProps {
  /** Color scheme preset */
  colorScheme?: 'mocha' | 'navy' | 'sunset' | 'aurora';
  /** Animation speed multiplier */
  speed?: number;
  /** Number of gradient blobs */
  blobCount?: number;
}

const colorSchemes = {
  mocha: [
    'rgba(164, 120, 100, 0.4)',
    'rgba(139, 90, 70, 0.3)',
    'rgba(180, 140, 120, 0.35)',
    'rgba(120, 80, 60, 0.25)',
  ],
  navy: [
    'rgba(30, 58, 95, 0.4)',
    'rgba(45, 80, 130, 0.3)',
    'rgba(60, 100, 150, 0.35)',
    'rgba(20, 40, 70, 0.25)',
  ],
  sunset: [
    'rgba(255, 120, 100, 0.3)',
    'rgba(255, 180, 100, 0.25)',
    'rgba(255, 80, 120, 0.3)',
    'rgba(200, 100, 150, 0.25)',
  ],
  aurora: [
    'rgba(100, 200, 150, 0.3)',
    'rgba(80, 150, 200, 0.25)',
    'rgba(150, 100, 200, 0.3)',
    'rgba(100, 180, 180, 0.25)',
  ],
};

export function GradientMeshBackground({
  colorScheme = 'mocha',
  speed = 1,
  blobCount = 4,
}: GradientMeshBackgroundProps) {
  const colors = colorSchemes[colorScheme];

  const blobs = React.useMemo(() => {
    return Array.from({ length: Math.min(blobCount, 4) }, (_, i) => ({
      id: i,
      color: colors[i % colors.length],
      size: 300 + Math.random() * 200,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      duration: (20 + Math.random() * 10) / speed,
    }));
  }, [blobCount, colors, speed]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />

      {/* Animated blobs */}
      {blobs.map(blob => (
        <motion.div
          key={blob.id}
          className="absolute rounded-full blur-3xl"
          style={{
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 70%)`,
            left: `${blob.initialX}%`,
            top: `${blob.initialY}%`,
            marginLeft: -blob.size / 2,
            marginTop: -blob.size / 2,
          }}
          animate={{
            x: [0, 100, -50, 80, 0],
            y: [0, -80, 60, -40, 0],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/50 via-transparent to-background/30" />
    </div>
  );
}
