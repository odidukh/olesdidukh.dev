'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { seededRandom } from '@/lib/random';

interface CodeRainBackgroundProps {
  /** Character set to use */
  charset?: 'binary' | 'hex' | 'symbols' | 'code';
  /** Number of columns */
  columns?: number;
  /** Animation speed */
  speed?: number;
  /** Character color */
  color?: string;
  /** Fade effect intensity */
  fadeIntensity?: number;
}

const charsets = {
  binary: '01',
  hex: '0123456789ABCDEF',
  symbols: '{}[]()<>/*-+=;:.,|&^%$#@!~`',
  code: 'const let var function return if else for while => {} [] () ; : = + - * / < > === !== && ||',
};

export function CodeRainBackground({
  charset = 'code',
  columns = 20,
  speed = 1,
  color = 'rgba(164, 120, 100, 0.6)',
  fadeIntensity = 0.8,
}: CodeRainBackgroundProps) {
  const chars = charsets[charset];

  const rainColumns = React.useMemo(() => {
    return Array.from({ length: columns }, (_, colIndex) => {
      // Use column-based seed for deterministic values
      const colSeed = colIndex * 1000 + 333;

      // Generate characters with seeded random
      const columnChars = Array.from({ length: 15 }, (_, charIndex) => {
        const charSeed = colSeed + 100 + charIndex;
        if (charset === 'code') {
          const tokens = chars.split(' ');
          const tokenIndex = Math.floor(seededRandom(charSeed) * tokens.length);
          return tokens[tokenIndex] || '';
        }
        const charIndexInSet = Math.floor(
          seededRandom(charSeed) * chars.length
        );
        return chars[charIndexInSet] || '';
      });

      return {
        id: colIndex,
        x: (colIndex / columns) * 100 + seededRandom(colSeed + 1) * 5,
        duration: (3 + seededRandom(colSeed + 2) * 4) / speed,
        delay: seededRandom(colSeed + 3) * 5,
        chars: columnChars,
      };
    });
  }, [columns, charset, speed, chars]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Fade overlay at top */}
      <div
        className="absolute inset-x-0 top-0 h-32 z-10"
        style={{
          background: `linear-gradient(to bottom, var(--background) 0%, transparent 100%)`,
          opacity: fadeIntensity,
        }}
      />

      {/* Rain columns */}
      {rainColumns.map(column => (
        <motion.div
          key={column.id}
          className="absolute font-mono text-xs leading-relaxed whitespace-nowrap"
          style={{
            left: `${column.x}%`,
            color,
            writingMode: 'vertical-rl',
            textOrientation: 'mixed',
          }}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{
            y: ['0%', '120%'],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: column.duration,
            delay: column.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {column.chars.map((char, i) => (
            <motion.span
              key={i}
              style={{
                opacity: 1 - i * 0.06,
                display: 'block',
                marginBottom: '4px',
              }}
              animate={{
                opacity: [1 - i * 0.06, 0.3, 1 - i * 0.06],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      ))}

      {/* Fade overlay at bottom */}
      <div
        className="absolute inset-x-0 bottom-0 h-32 z-10"
        style={{
          background: `linear-gradient(to top, var(--background) 0%, transparent 100%)`,
          opacity: fadeIntensity,
        }}
      />

      {/* Glow effect for highlighted characters */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, ${color.replace('0.6', '0.1')} 0%, transparent 50%)`,
        }}
      />
    </div>
  );
}
