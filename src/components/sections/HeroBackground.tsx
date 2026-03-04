'use client';

import * as React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { SunsetCodeRainBackground } from '@/components/ui/backgrounds';
import { Canvas } from '@react-three/fiber';
import { ParticleGalaxy } from '@/components/three/ParticleGalaxy';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { GalaxyConfig } from '@/lib/galaxyData';

interface HeroBackgroundProps {
  heroY: MotionValue<number>;
  mousePosition: { x: number; y: number };
}

// Responsive galaxy configurations per design doc
const DESKTOP_CONFIG: GalaxyConfig = { core: 200, mid: 500, dust: 800 };
const TABLET_CONFIG: GalaxyConfig = { core: 100, mid: 300, dust: 400 };
const MOBILE_CONFIG: GalaxyConfig = { core: 50, mid: 200, dust: 250 };

export const HeroBackground = React.memo(function HeroBackground({
  heroY,
  mousePosition,
}: HeroBackgroundProps) {
  const prefersReducedMotion = useReducedMotion();
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isMobile = useMediaQuery('(max-width: 768px)');

  const galaxyConfig = isMobile
    ? MOBILE_CONFIG
    : isTablet
      ? TABLET_CONFIG
      : DESKTOP_CONFIG;

  const showConnections = !isMobile;
  const maxConnections = isTablet ? 150 : 300;

  return (
    <motion.div
      style={{ y: heroY }}
      className="absolute inset-0 -z-10 overflow-hidden"
    >
      {!prefersReducedMotion && (
        <div className="absolute inset-0 opacity-50 dark:opacity-40">
          <Canvas camera={{ position: [0, 0, 6], fov: 60 }} dpr={[1, 2]}>
            <React.Suspense fallback={null}>
              <ParticleGalaxy
                mousePosition={mousePosition}
                config={galaxyConfig}
                showConnections={showConnections}
                maxConnections={maxConnections}
              />
            </React.Suspense>
          </Canvas>
        </div>
      )}
      <div className="absolute inset-0 opacity-40">
        <SunsetCodeRainBackground columns={16} rainOpacity={0.3} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
    </motion.div>
  );
});

HeroBackground.displayName = 'HeroBackground';
