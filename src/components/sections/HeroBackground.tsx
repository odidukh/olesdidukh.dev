'use client';

import * as React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { SunsetCodeRainBackground } from '@/components/ui/backgrounds';

interface HeroBackgroundProps {
  heroY: MotionValue<number>;
  mousePosition: { x: number; y: number };
}

export const HeroBackground = React.memo(function HeroBackground({
  heroY,
}: HeroBackgroundProps) {
  return (
    <motion.div style={{ y: heroY }} className="absolute inset-0 -z-10">
      <SunsetCodeRainBackground columns={16} rainOpacity={0.4} />
    </motion.div>
  );
});

HeroBackground.displayName = 'HeroBackground';
