'use client';

import * as React from 'react';
import { seededRandom } from '@/lib/random';

interface GeometricShapesBackgroundProps {
  /** Shape type */
  shapeType?: 'mixed' | 'triangles' | 'hexagons' | 'circles' | 'code';
  /** Number of shapes */
  count?: number;
  /** Enable glassmorphism effect */
  glassmorphism?: boolean;
  /** Primary color */
  color?: string;
}

type ShapeKey = 'triangle' | 'hexagon' | 'circle' | 'bracket' | 'tag' | 'slash';

interface ShapeData {
  readonly shapeKey: ShapeKey;
  readonly x: number;
  readonly y: number;
  readonly size: number;
  readonly duration: number;
  readonly delay: number;
  readonly rotation: number;
}

function getShapeKeys(
  shapeType: GeometricShapesBackgroundProps['shapeType']
): readonly ShapeKey[] {
  switch (shapeType) {
    case 'triangles':
      return ['triangle'];
    case 'hexagons':
      return ['hexagon'];
    case 'circles':
      return ['circle'];
    case 'code':
      return ['bracket', 'tag', 'slash'];
    default:
      return ['triangle', 'hexagon', 'circle'];
  }
}

function generateShapes(
  count: number,
  shapeKeys: readonly ShapeKey[]
): readonly ShapeData[] {
  return Array.from({ length: count }, (_, i) => {
    const seed = i * 100 + 777;
    return {
      shapeKey: shapeKeys[i % shapeKeys.length] as ShapeKey,
      x: seededRandom(seed + 1) * 100,
      y: seededRandom(seed + 2) * 100,
      size: 40 + seededRandom(seed + 3) * 60,
      duration: 15 + seededRandom(seed + 4) * 20,
      delay: seededRandom(seed + 5) * 5,
      rotation: seededRandom(seed + 6) * 360,
    };
  });
}

// --- Canvas shape drawers ---
// All shapes are drawn centered at (0, 0) within a coordinate space of [-50, 50]

function drawTriangle(ctx: CanvasRenderingContext2D, size: number): void {
  const s = size / 100;
  ctx.beginPath();
  ctx.moveTo(50 * s - size / 2, 10 * s - size / 2);
  ctx.lineTo(90 * s - size / 2, 90 * s - size / 2);
  ctx.lineTo(10 * s - size / 2, 90 * s - size / 2);
  ctx.closePath();
  ctx.stroke();
}

function drawHexagon(ctx: CanvasRenderingContext2D, size: number): void {
  const s = size / 100;
  const points = [
    [50, 5],
    [90, 25],
    [90, 75],
    [50, 95],
    [10, 75],
    [10, 25],
  ] as const;
  ctx.beginPath();
  points.forEach(([px, py], idx) => {
    const x = px * s - size / 2;
    const y = py * s - size / 2;
    if (idx === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.stroke();
}

function drawCircle(ctx: CanvasRenderingContext2D, size: number): void {
  const r = (40 / 100) * size;
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.stroke();
}

function drawBracket(ctx: CanvasRenderingContext2D, size: number): void {
  const s = size / 100;
  ctx.lineCap = 'round';
  ctx.beginPath();
  // Left bracket
  ctx.moveTo(30 * s - size / 2, 20 * s - size / 2);
  ctx.lineTo(20 * s - size / 2, 20 * s - size / 2);
  ctx.lineTo(20 * s - size / 2, 80 * s - size / 2);
  ctx.lineTo(30 * s - size / 2, 80 * s - size / 2);
  // Right bracket
  ctx.moveTo(70 * s - size / 2, 20 * s - size / 2);
  ctx.lineTo(80 * s - size / 2, 20 * s - size / 2);
  ctx.lineTo(80 * s - size / 2, 80 * s - size / 2);
  ctx.lineTo(70 * s - size / 2, 80 * s - size / 2);
  ctx.stroke();
}

function drawTag(ctx: CanvasRenderingContext2D, size: number): void {
  const s = size / 100;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(20 * s - size / 2, 50 * s - size / 2);
  ctx.lineTo(40 * s - size / 2, 30 * s - size / 2);
  ctx.moveTo(40 * s - size / 2, 30 * s - size / 2);
  ctx.lineTo(60 * s - size / 2, 30 * s - size / 2);
  ctx.moveTo(60 * s - size / 2, 70 * s - size / 2);
  ctx.lineTo(40 * s - size / 2, 70 * s - size / 2);
  ctx.moveTo(40 * s - size / 2, 70 * s - size / 2);
  ctx.lineTo(20 * s - size / 2, 50 * s - size / 2);
  ctx.moveTo(80 * s - size / 2, 50 * s - size / 2);
  ctx.lineTo(60 * s - size / 2, 30 * s - size / 2);
  ctx.moveTo(60 * s - size / 2, 70 * s - size / 2);
  ctx.lineTo(80 * s - size / 2, 50 * s - size / 2);
  ctx.stroke();
}

function drawSlash(ctx: CanvasRenderingContext2D, size: number): void {
  const s = size / 100;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(60 * s - size / 2, 20 * s - size / 2);
  ctx.lineTo(40 * s - size / 2, 80 * s - size / 2);
  ctx.stroke();
}

const shapeDrawers: Record<
  ShapeKey,
  (ctx: CanvasRenderingContext2D, size: number) => void
> = {
  triangle: drawTriangle,
  hexagon: drawHexagon,
  circle: drawCircle,
  bracket: drawBracket,
  tag: drawTag,
  slash: drawSlash,
};

/**
 * Compute the lifecycle progress of a shape.
 * Returns an object with opacity (0-0.6) and scale (0.5-1).
 *
 * The lifecycle mirrors the original Framer Motion keyframes:
 *   opacity: [0, 0.6, 0.6, 0]
 *   scale:   [0.5, 1,   1,   0.5]
 *
 * Phases (each 1/3 of duration):
 *   0-33%   fade in  + scale up
 *   33-66%  hold
 *   66-100% fade out + scale down
 */
function computeLifecycle(progress: number): {
  readonly opacity: number;
  readonly scale: number;
} {
  if (progress < 1 / 3) {
    const t = progress * 3;
    return { opacity: t * 0.6, scale: 0.5 + t * 0.5 };
  }
  if (progress < 2 / 3) {
    return { opacity: 0.6, scale: 1 };
  }
  const t = (progress - 2 / 3) * 3;
  return { opacity: 0.6 * (1 - t), scale: 1 - t * 0.5 };
}

/**
 * Compute position offsets matching original Framer Motion animation:
 *   x: [0, 30, -20, 0]
 *   y: [0, -50, -100, -150]
 */
function computePosition(progress: number): {
  readonly dx: number;
  readonly dy: number;
} {
  if (progress < 1 / 3) {
    const t = progress * 3;
    return { dx: t * 30, dy: t * -50 };
  }
  if (progress < 2 / 3) {
    const t = (progress - 1 / 3) * 3;
    return { dx: 30 + t * (-20 - 30), dy: -50 + t * (-100 - -50) };
  }
  const t = (progress - 2 / 3) * 3;
  return { dx: -20 + t * (0 - -20), dy: -100 + t * (-150 - -100) };
}

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: ShapeData,
  canvasWidth: number,
  canvasHeight: number,
  time: number,
  glassmorphism: boolean,
  color: string
): void {
  const elapsed = time - shape.delay;
  if (elapsed < 0) return;

  const progress = (elapsed % shape.duration) / shape.duration;
  const { opacity, scale } = computeLifecycle(progress);
  if (opacity <= 0) return;

  const { dx, dy } = computePosition(progress);
  const rotation =
    shape.rotation + ((elapsed % shape.duration) / shape.duration) * 180;

  const cx = (shape.x / 100) * canvasWidth + dx;
  const cy = (shape.y / 100) * canvasHeight + dy;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.scale(scale, scale);
  ctx.globalAlpha = opacity;

  // Glassmorphism: draw a subtle rounded rect behind the shape
  if (glassmorphism) {
    const pad = shape.size / 2 + 8;
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    if (ctx.roundRect) {
      ctx.beginPath();
      ctx.roundRect(-pad, -pad, pad * 2, pad * 2, 8);
      ctx.fill();
    } else {
      ctx.fillRect(-pad, -pad, pad * 2, pad * 2);
    }
  }

  ctx.strokeStyle = color;
  ctx.lineWidth =
    shape.shapeKey === 'triangle' ||
    shape.shapeKey === 'hexagon' ||
    shape.shapeKey === 'circle'
      ? 2
      : 3;

  const drawer = shapeDrawers[shape.shapeKey];
  drawer(ctx, shape.size);

  ctx.restore();
}

function drawStaticShapes(
  ctx: CanvasRenderingContext2D,
  shapes: readonly ShapeData[],
  canvasWidth: number,
  canvasHeight: number,
  glassmorphism: boolean,
  color: string
): void {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  for (const shape of shapes) {
    const cx = (shape.x / 100) * canvasWidth;
    const cy = (shape.y / 100) * canvasHeight;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((shape.rotation * Math.PI) / 180);
    ctx.globalAlpha = 0.6;

    if (glassmorphism) {
      const pad = shape.size / 2 + 8;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(-pad, -pad, pad * 2, pad * 2, 8);
        ctx.fill();
      } else {
        ctx.fillRect(-pad, -pad, pad * 2, pad * 2);
      }
    }

    ctx.strokeStyle = color;
    ctx.lineWidth =
      shape.shapeKey === 'triangle' ||
      shape.shapeKey === 'hexagon' ||
      shape.shapeKey === 'circle'
        ? 2
        : 3;

    const drawer = shapeDrawers[shape.shapeKey];
    drawer(ctx, shape.size);

    ctx.restore();
  }
}

export function GeometricShapesBackground({
  shapeType = 'mixed',
  count = 15,
  glassmorphism = true,
  color = 'rgba(164, 120, 100, 0.3)',
}: GeometricShapesBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const animationRef = React.useRef<number>(0);
  const startTimeRef = React.useRef<number>(0);

  const shapeKeys = React.useMemo(() => getShapeKeys(shapeType), [shapeType]);
  const shapes = React.useMemo(
    () => generateShapes(count, shapeKeys),
    [count, shapeKeys]
  );

  // Detect prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = React.useState(false);

  React.useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  // Handle canvas sizing via ResizeObserver
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const updateSize = () => {
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(parent);
    updateSize();

    return () => observer.disconnect();
  }, []);

  // Animation loop or static render
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    if (reducedMotion) {
      // Render shapes statically at their initial positions
      const canvasWidth = canvas.width / dpr;
      const canvasHeight = canvas.height / dpr;
      drawStaticShapes(
        ctx,
        shapes,
        canvasWidth,
        canvasHeight,
        glassmorphism,
        color
      );
      return;
    }

    startTimeRef.current = performance.now() / 1000;

    const animate = () => {
      const currentDpr = window.devicePixelRatio || 1;
      const canvasWidth = canvas.width / currentDpr;
      const canvasHeight = canvas.height / currentDpr;
      const time = performance.now() / 1000 - startTimeRef.current;

      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      for (const shape of shapes) {
        drawShape(
          ctx,
          shape,
          canvasWidth,
          canvasHeight,
          time,
          glassmorphism,
          color
        );
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [shapes, reducedMotion, glassmorphism, color]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
}
