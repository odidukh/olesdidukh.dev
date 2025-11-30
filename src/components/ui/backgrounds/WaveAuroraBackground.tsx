'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface WaveAuroraBackgroundProps {
  /** Visual style */
  variant?: 'waves' | 'aurora' | 'ribbons';
  /** Color scheme */
  colorScheme?: 'mocha' | 'ocean' | 'northern' | 'sunset';
  /** Animation speed */
  speed?: number;
  /** Position of the effect */
  position?: 'bottom' | 'top' | 'full';
}

const colorSchemes = {
  mocha: ['#a47864', '#8b5a46', '#b48c78', '#785040'],
  ocean: ['#0077b6', '#00b4d8', '#90e0ef', '#023e8a'],
  northern: ['#70d6ff', '#ff70a6', '#ff9770', '#e9ff70'],
  sunset: ['#ff6b6b', '#feca57', '#ff9ff3', '#54a0ff'],
};

export function WaveAuroraBackground({
  variant = 'waves',
  colorScheme = 'mocha',
  speed = 1,
  position = 'bottom',
}: WaveAuroraBackgroundProps) {
  const colors = colorSchemes[colorScheme];

  const positionStyles = {
    bottom: 'bottom-0 h-1/2',
    top: 'top-0 h-1/2 rotate-180',
    full: 'inset-0',
  };

  if (variant === 'aurora') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {colors.map((color, i) => (
          <motion.div
            key={i}
            className="absolute w-full h-full"
            style={{
              background: `radial-gradient(ellipse 80% 50% at ${50 + i * 10}% ${30 + i * 15}%, ${color}30, transparent)`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.1, 1],
              x: [0, 50, -50, 0],
            }}
            transition={{
              duration: (8 + i * 2) / speed,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.5,
            }}
          />
        ))}
      </div>
    );
  }

  if (variant === 'ribbons') {
    return (
      <div className={`absolute overflow-hidden ${positionStyles[position]}`}>
        {colors.map((color, i) => (
          <motion.div
            key={i}
            className="absolute w-[200%] h-24"
            style={{
              background: `linear-gradient(90deg, transparent, ${color}40, transparent)`,
              top: `${20 + i * 20}%`,
              left: '-50%',
              filter: 'blur(20px)',
            }}
            animate={{
              x: ['-50%', '0%', '-50%'],
              scaleY: [1, 1.5, 1],
            }}
            transition={{
              duration: (10 + i * 3) / speed,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.8,
            }}
          />
        ))}
      </div>
    );
  }

  // Default: waves
  return (
    <div className={`absolute overflow-hidden ${positionStyles[position]}`}>
      <svg
        className="absolute w-full h-full"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        {colors.map((color, i) => (
          <motion.path
            key={i}
            fill={`${color}30`}
            animate={{
              d: [
                `M0,${160 + i * 20} C360,${100 + i * 10} 720,${200 + i * 15} 1080,${140 + i * 20} C1260,${120 + i * 10} 1440,${180 + i * 15} 1440,${180 + i * 15} L1440,320 L0,320 Z`,
                `M0,${140 + i * 20} C360,${180 + i * 10} 720,${120 + i * 15} 1080,${160 + i * 20} C1260,${180 + i * 10} 1440,${140 + i * 15} 1440,${140 + i * 15} L1440,320 L0,320 Z`,
                `M0,${160 + i * 20} C360,${100 + i * 10} 720,${200 + i * 15} 1080,${140 + i * 20} C1260,${120 + i * 10} 1440,${180 + i * 15} 1440,${180 + i * 15} L1440,320 L0,320 Z`,
              ],
            }}
            transition={{
              duration: (6 + i * 2) / speed,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.3,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
