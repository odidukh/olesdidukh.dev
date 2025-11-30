'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface SpotlightBackgroundProps {
  /** Visual style */
  variant?: 'single' | 'dual' | 'grid' | 'sweep';
  /** Spotlight color */
  spotlightColor?: string;
  /** Follow mouse cursor */
  followMouse?: boolean;
  /** Grid cell size (for grid variant) */
  gridSize?: number;
}

export function SpotlightBackground({
  variant = 'single',
  spotlightColor = 'rgba(164, 120, 100, 0.15)',
  followMouse = true,
  gridSize = 80,
}: SpotlightBackgroundProps) {
  const mouseX = useMotionValue(
    typeof window !== 'undefined' ? window.innerWidth / 2 : 0
  );
  const mouseY = useMotionValue(
    typeof window !== 'undefined' ? window.innerHeight / 2 : 0
  );

  const springConfig = { damping: 30, stiffness: 200 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  React.useEffect(() => {
    if (!followMouse) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [followMouse, mouseX, mouseY]);

  if (variant === 'grid') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(rgba(128, 128, 128, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(128, 128, 128, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: `${gridSize}px ${gridSize}px`,
          }}
        />

        {/* Mouse-following spotlight */}
        {followMouse && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              x: smoothX,
              y: smoothY,
              width: 600,
              height: 600,
              marginLeft: -300,
              marginTop: -300,
              background: `radial-gradient(circle, ${spotlightColor} 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Grid highlight effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at var(--mouse-x, 50%) var(--mouse-y, 50%), ${spotlightColor} 0%, transparent 25%)`,
          }}
        />
      </div>
    );
  }

  if (variant === 'dual') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* First spotlight */}
        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl"
          style={{
            background: spotlightColor,
            left: '20%',
            top: '30%',
          }}
          animate={{
            x: [0, 100, 50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Second spotlight */}
        <motion.div
          className="absolute w-80 h-80 rounded-full blur-3xl"
          style={{
            background: spotlightColor.replace('0.15', '0.1'),
            right: '20%',
            bottom: '30%',
          }}
          animate={{
            x: [0, -80, -40, 0],
            y: [0, 60, -30, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />

        {/* Mouse-following highlight */}
        {followMouse && (
          <motion.div
            className="absolute pointer-events-none mix-blend-overlay"
            style={{
              x: smoothX,
              y: smoothY,
              width: 400,
              height: 400,
              marginLeft: -200,
              marginTop: -200,
              background: `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 60%)`,
            }}
          />
        )}
      </div>
    );
  }

  if (variant === 'sweep') {
    return (
      <div className="absolute inset-0 overflow-hidden">
        {/* Sweeping spotlight beams */}
        <motion.div
          className="absolute w-full h-full origin-bottom-left"
          style={{
            background: `conic-gradient(from 0deg at 0% 100%, transparent 0deg, ${spotlightColor} 15deg, transparent 30deg, transparent 360deg)`,
          }}
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        <motion.div
          className="absolute w-full h-full origin-bottom-right"
          style={{
            background: `conic-gradient(from 180deg at 100% 100%, transparent 0deg, ${spotlightColor.replace('0.15', '0.1')} 10deg, transparent 20deg, transparent 360deg)`,
          }}
          animate={{
            rotate: [0, -360],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* Mouse interaction */}
        {followMouse && (
          <motion.div
            className="absolute pointer-events-none"
            style={{
              x: smoothX,
              y: smoothY,
              width: 300,
              height: 300,
              marginLeft: -150,
              marginTop: -150,
              background: `radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)`,
            }}
          />
        )}
      </div>
    );
  }

  // Default: single spotlight
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Central ambient glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${spotlightColor} 0%, transparent 60%)`,
        }}
      />

      {/* Mouse-following spotlight */}
      {followMouse && (
        <motion.div
          className="absolute pointer-events-none"
          style={{
            x: smoothX,
            y: smoothY,
            width: 500,
            height: 500,
            marginLeft: -250,
            marginTop: -250,
            background: `radial-gradient(circle, ${spotlightColor.replace('0.15', '0.25')} 0%, transparent 60%)`,
          }}
        />
      )}

      {/* Subtle animated pulse */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full"
        style={{
          background: `radial-gradient(circle, ${spotlightColor.replace('0.15', '0.08')} 0%, transparent 70%)`,
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
}
