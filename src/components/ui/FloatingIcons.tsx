'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import {
  Code2,
  Database,
  Globe,
  Server,
  Smartphone,
  Cloud,
  GitBranch,
  Terminal,
  Cpu,
  Layers,
  Package,
  Zap,
  type LucideIcon,
} from 'lucide-react';

interface FloatingIconData {
  id: number;
  Icon: LucideIcon;
  x: number;
  y: number;
  duration: number;
  delay: number;
  scale: number;
}

export function FloatingIcons() {
  const icons = [
    Code2,
    Database,
    Globe,
    Server,
    Smartphone,
    Cloud,
    GitBranch,
    Terminal,
    Cpu,
    Layers,
    Package,
    Zap,
  ];

  const [floatingIcons] = React.useState<FloatingIconData[]>(() => {
    const iconCount = 12;
    return Array.from({ length: iconCount }, (_, i) => ({
      id: i,
      Icon: icons[i % icons.length]!,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: 15 + Math.random() * 15,
      delay: Math.random() * 10,
      scale: 0.6 + Math.random() * 0.4,
    }));
  });

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {floatingIcons.map(item => {
        const { id, Icon, x, y, duration, delay, scale } = item;

        return (
          <motion.div
            key={id}
            className="absolute"
            style={{
              left: `${x}%`,
              top: `${y}%`,
            }}
            initial={{
              opacity: 0,
              scale: 0,
              rotate: 0,
            }}
            animate={{
              opacity: [0, 0.15, 0.15, 0],
              scale: [0, scale, scale, 0],
              rotate: [0, 360],
              x: [0, 50, -50, 0],
              y: [0, -100, -100, 0],
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <div className="relative">
              <Icon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
              <motion.div
                className="absolute inset-0"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Icon className="h-8 w-8 text-mocha-400/20 blur-md" />
              </motion.div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
