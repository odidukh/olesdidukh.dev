'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

export interface FlashcardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  flipped: boolean;
  onFlip: () => void;
  className?: string;
}

const FACE =
  'block w-full rounded-xl border border-border bg-card p-8 text-left';

export function Flashcard({
  front,
  back,
  flipped,
  onFlip,
  className,
}: FlashcardProps) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        className={cn(FACE, 'min-h-[12rem]', className)}
      >
        {flipped ? back : front}
      </button>
    );
  }

  return (
    <div className={cn('[perspective:1200px]', className)}>
      <motion.button
        type="button"
        onClick={onFlip}
        aria-pressed={flipped}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        className="relative block min-h-[12rem] w-full [transform-style:preserve-3d]"
      >
        <span className={cn(FACE, '[backface-visibility:hidden]')}>
          {front}
        </span>
        <span
          className={cn(
            FACE,
            'absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]'
          )}
        >
          {back}
        </span>
      </motion.button>
    </div>
  );
}
