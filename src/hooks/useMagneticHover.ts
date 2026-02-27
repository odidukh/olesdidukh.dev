'use client';

import { useMotionValue, useSpring } from 'framer-motion';
import { MouseEvent, useCallback, useEffect, RefObject } from 'react';

export function useMagneticHover(
  ref: RefObject<HTMLElement | null>,
  strength = 15
) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth springs for natural decay and motion
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      if (!ref.current) return;
      const { clientX, clientY } = e;
      const { height, width, left, top } = ref.current.getBoundingClientRect();
      const middleX = clientX - (left + width / 2);
      const middleY = clientY - (top + height / 2);

      x.set(middleX * (strength / 100));
      y.set(middleY * (strength / 100));
    },
    [ref, x, y, strength]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  // Clean up if unmounted
  useEffect(() => {
    return () => {
      x.set(0);
      y.set(0);
    };
  }, [x, y]);

  return { x: springX, y: springY, handleMouseMove, handleMouseLeave };
}
