'use client';

import * as React from 'react';

interface GridPatternBackgroundProps {
  /** Grid cell size in pixels */
  gridSize?: number;
  /** Dot or line style */
  variant?: 'dots' | 'lines' | 'dashed';
  /** Enable mouse interaction glow */
  interactive?: boolean;
  /** Glow color */
  glowColor?: string;
  /** Base pattern color */
  patternColor?: string;
}

const GLOW_RADIUS = 200;
const LERP_FACTOR = 0.08;

export function GridPatternBackground({
  gridSize = 40,
  variant = 'dots',
  interactive = true,
  glowColor = 'rgba(164, 120, 100, 0.4)',
  patternColor = 'rgba(128, 128, 128, 0.15)',
}: GridPatternBackgroundProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const mouseRef = React.useRef({ x: 0, y: 0 });
  const smoothRef = React.useRef({ x: 0, y: 0 });
  const hasMouseMovedRef = React.useRef(false);
  const animationFrameRef = React.useRef<number>(0);
  const reducedMotionRef = React.useRef(false);

  const drawPattern = React.useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.fillStyle = patternColor;
      ctx.strokeStyle = patternColor;
      ctx.lineWidth = 1;

      if (variant === 'dots') {
        const dotRadius = 1.5;
        for (let x = gridSize / 2; x < width; x += gridSize) {
          for (let y = gridSize / 2; y < height; y += gridSize) {
            ctx.beginPath();
            ctx.arc(x, y, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      } else if (variant === 'lines') {
        ctx.setLineDash([]);
        for (let x = 0; x <= width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y <= height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
      } else if (variant === 'dashed') {
        ctx.setLineDash([4, 4]);
        for (let x = 0; x <= width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, height);
          ctx.stroke();
        }
        for (let y = 0; y <= height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }
        ctx.setLineDash([]);
      }
    },
    [gridSize, variant, patternColor]
  );

  const drawGlow = React.useCallback(
    (ctx: CanvasRenderingContext2D, x: number, y: number) => {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, GLOW_RADIUS);
      gradient.addColorStop(0, glowColor);
      gradient.addColorStop(0.7, 'transparent');

      ctx.save();
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = gradient;
      ctx.fillRect(
        x - GLOW_RADIUS,
        y - GLOW_RADIUS,
        GLOW_RADIUS * 2,
        GLOW_RADIUS * 2
      );
      ctx.restore();
    },
    [glowColor]
  );

  const draw = React.useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number) => {
      ctx.clearRect(0, 0, width, height);
      drawPattern(ctx, width, height);

      if (interactive && hasMouseMovedRef.current) {
        drawGlow(ctx, smoothRef.current.x, smoothRef.current.y);
      }
    },
    [drawPattern, drawGlow, interactive]
  );

  // Animation loop for smooth glow following
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    reducedMotionRef.current = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const animate = () => {
      const width = canvas.width;
      const height = canvas.height;

      if (
        interactive &&
        hasMouseMovedRef.current &&
        !reducedMotionRef.current
      ) {
        // Lerp toward target mouse position
        smoothRef.current = {
          x:
            smoothRef.current.x +
            (mouseRef.current.x - smoothRef.current.x) * LERP_FACTOR,
          y:
            smoothRef.current.y +
            (mouseRef.current.y - smoothRef.current.y) * LERP_FACTOR,
        };
      }

      draw(ctx, width, height);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [draw, interactive]);

  // Resize observer to keep canvas dimensions in sync
  React.useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    const updateSize = () => {
      const { width, height } = wrapper.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(wrapper);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      if (!interactive) return;

      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouseRef.current = { x, y };

      if (!hasMouseMovedRef.current) {
        // Snap smooth position on first move to avoid lerp from origin
        smoothRef.current = { x, y };
        hasMouseMovedRef.current = true;
      }

      // If reduced motion, snap instantly
      if (reducedMotionRef.current) {
        smoothRef.current = { x, y };
      }
    },
    [interactive]
  );

  return (
    <div
      ref={wrapperRef}
      className="absolute inset-0 overflow-hidden"
      onMouseMove={interactive ? handleMouseMove : undefined}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}
