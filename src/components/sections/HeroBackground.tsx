'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { motion, MotionValue } from 'framer-motion';
import { ANIMATION } from '@/constants';

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

interface HeroBackgroundProps {
  heroY: MotionValue<number>;
  mousePosition: { x: number; y: number };
}

export const HeroBackground = React.memo(function HeroBackground({
  heroY,
  mousePosition,
}: HeroBackgroundProps) {
  // Generate particles on client side to avoid hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from(
      { length: ANIMATION.PARTICLE_COUNT },
      (_, i) => ({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 5 + 5,
        delay: Math.random() * 5,
      })
    );
    setParticles(newParticles);
  }, []);

  return (
    <motion.div style={{ y: heroY }} className="absolute inset-0 -z-10">
      {/* Gradient Mesh */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />

      {/* Animated Orbs */}
      <motion.div
        animate={{
          x: mousePosition.x * 0.02,
          y: mousePosition.y * 0.02,
        }}
        transition={{ type: 'spring', stiffness: 50 }}
        className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: mousePosition.x * -0.02,
          y: mousePosition.y * -0.02,
        }}
        transition={{ type: 'spring', stiffness: 50 }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
      />

      {/* Grid Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--primary), 0.1) 0%, transparent 50%)`,
        }}
      />

      {/* Floating Particles */}
      <div className="absolute inset-0">
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
});

HeroBackground.displayName = 'HeroBackground';
