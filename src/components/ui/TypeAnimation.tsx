'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { JSX } from 'react';

interface TypeAnimationProps {
  sequence: (string | number)[];
  wrapper?: keyof JSX.IntrinsicElements;
  speed?: number;
  deletionSpeed?: number;
  repeat?: number | boolean;
  className?: string;
  cursor?: boolean;
  cursorClassName?: string;
}

export function TypeAnimation({
  sequence,
  wrapper = 'span',
  speed = 50,
  deletionSpeed = 30,

  className = '',
  cursor = true,
  cursorClassName = '',
}: TypeAnimationProps) {
  // Using 'any' for dynamic component is standard pattern for polymorphic components
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Wrapper: any = wrapper;
  const [displayText, setDisplayText] = React.useState('');
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  React.useEffect(() => {
    if (isPaused) return undefined;

    const currentItem = sequence[currentIndex];

    // If current item is a number, it's a pause duration
    if (typeof currentItem === 'number') {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        setCurrentIndex(prev => {
          const next = (prev + 1) % sequence.length;
          // Skip to next string
          if (typeof sequence[next] === 'string') {
            setIsDeleting(true);
          }
          return next;
        });
      }, currentItem);

      setIsPaused(true);
      return () => clearTimeout(timeout);
    }

    // If we're at a string, type or delete it
    if (typeof currentItem === 'string') {
      if (!isDeleting) {
        // Typing
        if (displayText.length < currentItem.length) {
          const timeout = setTimeout(() => {
            setDisplayText(currentItem.slice(0, displayText.length + 1));
          }, speed);
          return () => clearTimeout(timeout);
        } else {
          // Finished typing, move to next item (should be a pause)
          setCurrentIndex(prev => (prev + 1) % sequence.length);
        }
      } else {
        // Deleting
        if (displayText.length > 0) {
          const timeout = setTimeout(() => {
            setDisplayText(displayText.slice(0, -1));
          }, deletionSpeed);
          return () => clearTimeout(timeout);
        } else {
          // Finished deleting, move to next string
          setIsDeleting(false);
          let nextIndex = (currentIndex + 1) % sequence.length;
          // Find next string in sequence
          while (
            typeof sequence[nextIndex] !== 'string' &&
            nextIndex !== currentIndex
          ) {
            nextIndex = (nextIndex + 1) % sequence.length;
          }
          setCurrentIndex(nextIndex);
        }
      }
    }
    return undefined;
  }, [
    displayText,
    currentIndex,
    sequence,
    speed,
    deletionSpeed,
    isDeleting,
    isPaused,
  ]);

  return (
    <Wrapper
      className={className}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span>{displayText}</span>
      {cursor && (
        <motion.span
          aria-hidden="true"
          className={`inline-block w-0.5 h-[1.1em] bg-current ml-1 ${cursorClassName}`}
          animate={{
            opacity: [1, 1, 0, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            times: [0, 0.5, 0.5, 1],
            ease: 'linear',
          }}
        />
      )}
    </Wrapper>
  );
}
