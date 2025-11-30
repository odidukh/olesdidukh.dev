'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface NoiseTextureBackgroundProps {
  /** Noise opacity (0-1) */
  noiseOpacity?: number;
  /** Base gradient colors */
  gradientFrom?: string;
  gradientTo?: string;
  /** Animate the gradient */
  animated?: boolean;
  /** Grain intensity */
  grainIntensity?: 'light' | 'medium' | 'heavy';
}

export function NoiseTextureBackground({
  noiseOpacity = 0.15,
  gradientFrom = 'rgb(164, 120, 100)',
  gradientTo = 'rgb(30, 58, 95)',
  animated = true,
  grainIntensity = 'medium',
}: NoiseTextureBackgroundProps) {
  const noiseId = React.useId();

  const baseFrequency = {
    light: 0.9,
    medium: 0.7,
    heavy: 0.5,
  }[grainIntensity];

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* SVG Noise Filter Definition */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id={noiseId}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency={baseFrequency}
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>

      {/* Animated Gradient Background */}
      {animated ? (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}20)`,
          }}
          animate={{
            background: [
              `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}20)`,
              `linear-gradient(180deg, ${gradientTo}20, ${gradientFrom}20)`,
              `linear-gradient(225deg, ${gradientFrom}20, ${gradientTo}20)`,
              `linear-gradient(270deg, ${gradientTo}20, ${gradientFrom}20)`,
              `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}20)`,
            ],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}20, ${gradientTo}20)`,
          }}
        />
      )}

      {/* Noise Overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          filter: `url(#${noiseId})`,
          opacity: noiseOpacity,
        }}
      />

      {/* Additional grain texture using CSS */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: noiseOpacity * 0.5,
        }}
      />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 100%)',
        }}
      />
    </div>
  );
}
