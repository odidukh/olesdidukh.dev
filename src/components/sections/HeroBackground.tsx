'use client';

import * as React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { SunsetCodeRainBackground } from '@/components/ui/backgrounds';
import { Canvas } from '@react-three/fiber';
import { FloatingGeometry } from '@/components/three/FloatingGeometry';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useIsDark } from '@/stores';

interface HeroBackgroundProps {
  heroY: MotionValue<number>;
  mousePosition: { x: number; y: number };
}

export const HeroBackground = React.memo(function HeroBackground({
  heroY,
  mousePosition,
}: HeroBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isLargeScreen = useMediaQuery('(min-width: 1280px)');
  const isDark = useIsDark();
  const shapeTier = isMobile ? 'small' : isLargeScreen ? 'large' : 'medium';

  return (
    <motion.div
      style={{ y: heroY }}
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      {!prefersReducedMotion && (
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
            <React.Suspense fallback={null}>
              <FloatingGeometry
                mousePosition={mousePosition}
                shapeCount={shapeTier}
                isDark={isDark}
              />
            </React.Suspense>
          </Canvas>
        </div>
      )}
      <div className="absolute inset-0 opacity-30 dark:opacity-40">
        <SunsetCodeRainBackground columns={16} rainOpacity={0.3} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
    </motion.div>
  );
});

HeroBackground.displayName = 'HeroBackground';
