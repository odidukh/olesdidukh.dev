'use client';

import * as React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { SunsetCodeRainBackground } from '@/components/ui/backgrounds';
import { Canvas } from '@react-three/fiber';
import { ParticleSystem } from '@/components/three/ParticleSystem';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface HeroBackgroundProps {
  heroY: MotionValue<number>;
  mousePosition: { x: number; y: number };
}

export const HeroBackground = React.memo(function HeroBackground({
  heroY,
  mousePosition,
}: HeroBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      style={{ y: heroY }}
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-50 dark:opacity-40">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
            <React.Suspense fallback={null}>
              <ParticleSystem mousePosition={mousePosition} count={2000} />
            </React.Suspense>
          </Canvas>
        </div>
      )}
      <div className="absolute inset-0 opacity-60">
        <SunsetCodeRainBackground columns={16} rainOpacity={0.3} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
    </motion.div>
  );
});

HeroBackground.displayName = 'HeroBackground';
