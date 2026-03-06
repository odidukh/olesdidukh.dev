'use client';

import * as React from 'react';
import { PARTICLE_CONFIG } from '@/config/animations';
import { createSeededRandom } from '@/lib/random';

interface Particle {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const SEED = 42;
const DEFAULT_COLOR = 'rgba(156, 163, 175, 0.6)';
const GLOW_COLOR = 'rgba(164, 120, 100, 0.8)';
const CONNECTION_COLOR_BASE = 'rgba(156, 163, 175,';
const FIGURE_8_AMPLITUDE = 30;

function generateParticles(count: number): Particle[] {
  const random = createSeededRandom(SEED);
  const particles: Particle[] = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: random() * 100,
      y: random() * 100,
      size: random() * PARTICLE_CONFIG.SIZE_RANGE + PARTICLE_CONFIG.SIZE_MIN,
      duration:
        random() * PARTICLE_CONFIG.DURATION_RANGE +
        PARTICLE_CONFIG.DURATION_MIN,
      delay: random() * PARTICLE_CONFIG.MAX_DELAY,
      opacity:
        random() * PARTICLE_CONFIG.OPACITY_RANGE + PARTICLE_CONFIG.OPACITY_MIN,
    });
  }

  return particles;
}

function getParticleCount(): number {
  if (typeof window === 'undefined') {
    return PARTICLE_CONFIG.DESKTOP_COUNT;
  }
  return window.innerWidth < PARTICLE_CONFIG.MOBILE_BREAKPOINT
    ? PARTICLE_CONFIG.MOBILE_COUNT
    : PARTICLE_CONFIG.DESKTOP_COUNT;
}

/**
 * Compute figure-8 progress for a particle at a given elapsed time.
 * Returns normalized offsets in the range [-1, 1] for both x and y.
 *
 * The figure-8 path is parameterized as:
 *   x(t) = sin(t)
 *   y(t) = sin(2t) -- gives a lemniscate-like figure-8
 *
 * We map elapsed time to a 0..2PI cycle based on particle duration.
 */
function getFigure8Offset(
  elapsedSeconds: number,
  duration: number,
  delay: number
): { dx: number; dy: number } {
  const effectiveTime = Math.max(0, elapsedSeconds - delay);
  const t = ((effectiveTime % duration) / duration) * Math.PI * 2;

  // Keyframe approximation matching original [0, 30, 0, -30, 0] pattern:
  // sin goes 0 -> 1 -> 0 -> -1 -> 0 over one cycle
  const dx = Math.sin(t) * FIGURE_8_AMPLITUDE;
  // y uses double frequency for figure-8: 0 -> -1 -> 0 -> 1 -> 0
  const dy = -Math.sin(2 * t) * FIGURE_8_AMPLITUDE;

  return { dx, dy };
}

export function ParticleField() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationFrameRef = React.useRef<number>(0);
  const particlesRef = React.useRef<Particle[]>(
    generateParticles(getParticleCount())
  );
  const mouseRef = React.useRef({ x: -9999, y: -9999 });
  const startTimeRef = React.useRef<number>(0);
  const canvasSizeRef = React.useRef({ width: 0, height: 0 });
  const reducedMotionRef = React.useRef(false);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Check reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotionRef.current = mediaQuery.matches;

    // Handle mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize handling with debounce
    let resizeTimeout: ReturnType<typeof setTimeout> | null = null;

    const updateCanvasSize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = Math.floor(rect.width);
      const height = Math.floor(rect.height);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      canvasSizeRef.current = { width, height };
    };

    const handleResize = () => {
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
      resizeTimeout = setTimeout(() => {
        const newCount = getParticleCount();
        if (newCount !== particlesRef.current.length) {
          particlesRef.current = generateParticles(newCount);
        }
        updateCanvasSize();
      }, PARTICLE_CONFIG.RESIZE_DEBOUNCE_MS);
    };

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });

    const parent = canvas.parentElement;
    if (parent) {
      resizeObserver.observe(parent);
    }

    // Initial size
    updateCanvasSize();

    // Drawing function
    const drawFrame = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = (timestamp - startTimeRef.current) / 1000;
      const { width, height } = canvasSizeRef.current;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mouseX = mouseRef.current.x;
      const mouseY = mouseRef.current.y;

      // Compute current positions
      const positions: Array<{ px: number; py: number }> = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        let px: number;
        let py: number;

        if (reducedMotionRef.current) {
          // Static positions for reduced motion
          px = (p.x / 100) * width;
          py = (p.y / 100) * height;
        } else {
          const { dx, dy } = getFigure8Offset(elapsed, p.duration, p.delay);
          px = (p.x / 100) * width + dx;
          py = (p.y / 100) * height + dy;
        }

        positions.push({ px, py });
      }

      // Draw connection lines between nearby particles
      for (let i = 0; i < particles.length; i++) {
        const pos1 = positions[i]!;

        for (let j = i + 1; j < particles.length; j++) {
          const pos2 = positions[j]!;
          const dx = pos1.px - pos2.px;
          const dy = pos1.py - pos2.py;
          // Use percentage-based distance for consistency with config thresholds
          const distPctX = (dx / width) * 100;
          const distPctY = (dy / height) * 100;
          const distPct = Math.sqrt(distPctX * distPctX + distPctY * distPctY);

          if (distPct < PARTICLE_CONFIG.CONNECTION_DISTANCE_THRESHOLD) {
            const opacity =
              ((PARTICLE_CONFIG.CONNECTION_DISTANCE_THRESHOLD - distPct) /
                PARTICLE_CONFIG.GLOW_DISTANCE_THRESHOLD) *
              0.3;

            ctx.beginPath();
            ctx.moveTo(pos1.px, pos1.py);
            ctx.lineTo(pos2.px, pos2.py);
            ctx.strokeStyle = `${CONNECTION_COLOR_BASE} ${Math.min(0.3, opacity)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        const { px, py } = positions[i]!;

        // Calculate mouse distance in percentage space
        const mousePctX = (mouseX / width) * 100;
        const mousePctY = (mouseY / height) * 100;
        const particlePctX = (px / width) * 100;
        const particlePctY = (py / height) * 100;
        const mouseDistance = Math.sqrt(
          (mousePctX - particlePctX) ** 2 + (mousePctY - particlePctY) ** 2
        );

        const glowIntensity = Math.max(
          0,
          1 - mouseDistance / PARTICLE_CONFIG.GLOW_DISTANCE_THRESHOLD
        );

        const isGlowing = glowIntensity > 0.3;
        const size = p.size * (1 + glowIntensity * 0.5);
        const alpha = p.opacity + glowIntensity * 0.5;

        ctx.beginPath();
        ctx.arc(px, py, size / 2, 0, Math.PI * 2);
        ctx.fillStyle = isGlowing ? GLOW_COLOR : DEFAULT_COLOR;
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (!reducedMotionRef.current) {
        animationFrameRef.current = requestAnimationFrame(drawFrame);
      }
    };

    if (reducedMotionRef.current) {
      // Draw a single static frame
      requestAnimationFrame(ts => {
        drawFrame(ts);
      });
    } else {
      animationFrameRef.current = requestAnimationFrame(drawFrame);
    }

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      resizeObserver.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      if (resizeTimeout) {
        clearTimeout(resizeTimeout);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none"
      />
    </div>
  );
}
