'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function ParticleField() {
  const [particles, setParticles] = React.useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });

  // Generate random particles
  React.useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      const particleCount = window.innerWidth < 768 ? 20 : 40; // Fewer particles on mobile

      for (let i = 0; i < particleCount; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          duration: Math.random() * 20 + 20,
          delay: Math.random() * 5,
          opacity: Math.random() * 0.5 + 0.2,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();

    // Regenerate particles on resize
    const handleResize = () => {
      generateParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track mouse position for interactive effect
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(particle => {
        // Calculate distance from mouse
        const distance = Math.sqrt(
          Math.pow(
            (mousePosition.x / window.innerWidth) * 100 - particle.x,
            2
          ) +
            Math.pow(
              (mousePosition.y / window.innerHeight) * 100 - particle.y,
              2
            )
        );

        // Particles glow brighter when mouse is near
        const glowIntensity = Math.max(0, 1 - distance / 30);

        return (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
            }}
            initial={{
              opacity: 0,
              scale: 0,
            }}
            animate={{
              opacity: particle.opacity + glowIntensity * 0.5,
              scale: 1 + glowIntensity * 0.5,
              x: [0, 30, 0, -30, 0],
              y: [0, -30, 0, 30, 0],
            }}
            transition={{
              opacity: { duration: 1 },
              scale: { duration: 1 },
              x: {
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'linear',
              },
              y: {
                duration: particle.duration,
                repeat: Infinity,
                delay: particle.delay,
                ease: 'linear',
              },
            }}
          >
            <div
              className={`w-full h-full rounded-full ${
                glowIntensity > 0.3
                  ? 'bg-mocha-400 shadow-[0_0_10px_rgba(164,120,100,0.5)]'
                  : 'bg-gray-400 dark:bg-gray-600'
              }`}
              style={{
                opacity: 0.6 + glowIntensity * 0.4,
                filter: `blur(${glowIntensity > 0.3 ? 0 : 1}px)`,
              }}
            />
          </motion.div>
        );
      })}

      {/* Connection Lines Between Nearby Particles */}
      <svg className="absolute inset-0 w-full h-full">
        {particles.map((particle1, i) => {
          return particles.slice(i + 1).map(particle2 => {
            const distance = Math.sqrt(
              Math.pow(particle1.x - particle2.x, 2) +
                Math.pow(particle1.y - particle2.y, 2)
            );

            // Only draw lines between nearby particles
            if (distance < 15) {
              return (
                <motion.line
                  key={`${particle1.id}-${particle2.id}`}
                  x1={`${particle1.x}%`}
                  y1={`${particle1.y}%`}
                  x2={`${particle2.x}%`}
                  y2={`${particle2.y}%`}
                  stroke="currentColor"
                  strokeWidth="0.5"
                  className="text-gray-300 dark:text-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: (15 - distance) / 30,
                  }}
                  transition={{
                    duration: 0.5,
                  }}
                />
              );
            }
            return null;
          });
        })}
      </svg>
    </div>
  );
}
