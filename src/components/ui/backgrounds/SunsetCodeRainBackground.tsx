'use client';

import * as React from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

interface SunsetCodeRainBackgroundProps {
  /** Animation speed for gradient */
  gradientSpeed?: number;
  /** Animation speed for code rain */
  rainSpeed?: number;
  /** Number of rain columns */
  columns?: number;
  /** Code rain opacity */
  rainOpacity?: number;
}

const sunsetColors = [
  'rgba(255, 120, 100, 0.3)',
  'rgba(255, 180, 100, 0.25)',
  'rgba(255, 80, 120, 0.3)',
  'rgba(200, 100, 150, 0.25)',
];

const codeKeywords = [
  'const',
  'let',
  'var',
  'function',
  'return',
  'if',
  'else',
  'for',
  'while',
  '=>',
  '{}',
  '[]',
  '()',
  ';',
  ':',
  '=',
  '+',
  '-',
  '*',
  '/',
  '<',
  '>',
  '===',
  '!==',
  '&&',
  '||',
  'async',
  'await',
  'import',
  'export',
  'default',
  'class',
  'extends',
  'new',
  'this',
  'true',
  'false',
  'null',
  'undefined',
  'try',
  'catch',
  'throw',
  'React',
  'useState',
  'useEffect',
  'props',
  'state',
  '<div>',
  '</div>',
  '</>',
  'map',
  'filter',
  'reduce',
];

// Seeded random number generator for consistent SSR/client values
function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

export function SunsetCodeRainBackground({
  gradientSpeed = 1,
  rainSpeed = 1,
  columns = 18,
  rainOpacity = 0.5,
}: SunsetCodeRainBackgroundProps) {
  // Mouse tracking for gradient glow
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Use seeded random for consistent SSR/client rendering
  const rainColumns = React.useMemo(() => {
    return Array.from({ length: columns }, (_, i) => {
      const seed = i * 1000;
      return {
        id: i,
        x: (i / columns) * 100 + (seededRandom(seed + 1) - 0.5) * 5,
        duration: (12 + seededRandom(seed + 2) * 8) / rainSpeed,
        delay: seededRandom(seed + 3) * 10,
        chars: Array.from({ length: 12 }, (_, j) => {
          const charIndex = Math.floor(
            seededRandom(seed + 100 + j) * codeKeywords.length
          );
          return codeKeywords[charIndex] || '';
        }),
      };
    });
  }, [columns, rainSpeed]);

  const blobs = React.useMemo(() => {
    return sunsetColors.map((color, i) => {
      const seed = i * 500 + 7777;
      return {
        id: i,
        color,
        size: 350 + seededRandom(seed + 1) * 200,
        initialX: 20 + seededRandom(seed + 2) * 60,
        initialY: 20 + seededRandom(seed + 3) * 60,
        duration: (18 + seededRandom(seed + 4) * 10) / gradientSpeed,
      };
    });
  }, [gradientSpeed]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Layer 1: Base dark gradient for contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background" />

      {/* Layer 2: Animated Sunset Gradient Blobs */}
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
            x: [0, 80, -40, 60, 0],
            y: [0, -60, 40, -30, 0],
            scale: [1, 1.15, 0.95, 1.1, 1],
          }}
          transition={{
            duration: blob.duration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Layer 3: Mouse-following glow */}
      <motion.div
        className="absolute rounded-full blur-3xl pointer-events-none"
        style={{
          x: smoothX,
          y: smoothY,
          width: 500,
          height: 500,
          marginLeft: -250,
          marginTop: -250,
          background:
            'radial-gradient(circle, rgba(255, 140, 100, 0.35) 0%, rgba(255, 100, 80, 0.15) 40%, transparent 70%)',
        }}
      />

      {/* Layer 4: Subtle overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/40" />

      {/* Layer 4: Code Rain - falling from top to bottom */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Top fade */}
        <div
          className="absolute inset-x-0 top-0 h-32 z-10"
          style={{
            background:
              'linear-gradient(to bottom, var(--background) 0%, transparent 100%)',
          }}
        />

        {/* Rain columns - each column falls independently */}
        {rainColumns.map(column => (
          <motion.div
            key={column.id}
            className="absolute font-mono text-sm flex flex-col items-center"
            style={{
              left: `${column.x}%`,
              top: 0,
            }}
            animate={{
              y: [-300, 1400],
            }}
            transition={{
              duration: column.duration,
              delay: column.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {column.chars.map((char, i) => (
              <span
                key={i}
                className="block whitespace-nowrap"
                style={{
                  color: `rgba(255, 140, 100, ${rainOpacity * (1 - i * 0.05)})`,
                  textShadow:
                    i === 0
                      ? '0 0 20px rgba(255, 120, 100, 0.9), 0 0 40px rgba(255, 120, 100, 0.5)'
                      : '0 0 10px rgba(255, 120, 100, 0.3)',
                  marginBottom: '2px',
                  fontWeight: i === 0 ? 700 : 400,
                  fontSize: i === 0 ? '1rem' : '0.875rem',
                }}
              >
                {char}
              </span>
            ))}
          </motion.div>
        ))}

        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 z-10"
          style={{
            background:
              'linear-gradient(to top, var(--background) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* Layer 5: Warm glow accent at top */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(255, 150, 100, 0.1) 0%, transparent 50%)',
        }}
      />
    </div>
  );
}
