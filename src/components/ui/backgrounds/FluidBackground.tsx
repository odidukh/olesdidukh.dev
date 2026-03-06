'use client';

import { useEffect, useRef } from 'react';

interface FluidBackgroundProps {
  /** Hex color strings for the fluid dye palette */
  readonly colorPalette?: readonly string[];
  /** GPU simulation grid resolution (lower = faster) */
  readonly simResolution?: number;
  /** Dye texture resolution (lower = faster) */
  readonly dyeResolution?: number;
  /** Enable bloom post-processing */
  readonly bloom?: boolean;
  /** Respond to mouse/touch hover */
  readonly hover?: boolean;
  /** Additional CSS classes */
  readonly className?: string;
}

// Bright mocha-inspired palette optimized for fluid sim visibility
const DEFAULT_PALETTE = [
  '#e8d5c0', // warm cream (brighter than mocha-300)
  '#d4a574', // golden mocha
  '#c4876e', // warm terracotta
  '#dcc0a8', // soft sand
  '#4a7fa8', // muted navy accent
] as const;

export function FluidBackground({
  colorPalette = DEFAULT_PALETTE,
  simResolution = 128,
  dyeResolution = 1024,
  bloom = true,
  hover = true,
  className,
}: FluidBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let fluid: import('webgl-fluid-enhanced').default | null = null;

    // Dynamic import avoids SSR issues with WebGL
    import('webgl-fluid-enhanced').then(({ default: WebGLFluidEnhanced }) => {
      if (!containerRef.current) return;

      fluid = new WebGLFluidEnhanced(container);
      fluid.setConfig({
        colorPalette: [...colorPalette],
        transparent: false,
        backgroundColor: '#000000',
        simResolution,
        dyeResolution,
        bloom,
        hover,
        brightness: 2.0,
        densityDissipation: 0.3,
        velocityDissipation: 0.1,
        curl: 30,
        pressure: 0.8,
        splatRadius: 0.7,
        splatForce: 10000,
        shading: true,
      });
      fluid.start();

      // Inject initial splats so the canvas isn't blank on load
      requestAnimationFrame(() => {
        fluid?.multipleSplats(Math.floor(Math.random() * 5) + 5);
      });
    });

    return () => {
      fluid?.stop();
    };
  }, [colorPalette, simResolution, dyeResolution, bloom, hover]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
