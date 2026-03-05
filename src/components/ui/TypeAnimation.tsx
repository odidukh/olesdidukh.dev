'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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

type Phase = 'typing' | 'pausing' | 'deleting';

export function TypeAnimation({
  sequence,
  wrapper = 'span',
  speed = 50,
  deletionSpeed = 30,
  repeat = false,
  className = '',
  cursor = true,
  cursorClassName = '',
}: TypeAnimationProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Wrapper: any = wrapper;
  const [displayText, setDisplayText] = useState('');

  // All mutable animation state lives in a single ref to avoid
  // cascading re-renders from multiple interdependent useState calls.
  const state = useRef({
    seqIndex: 0, // position in the sequence array
    charIndex: 0, // characters revealed so far
    phase: 'typing' as Phase,
    cycles: 0, // how many full loops completed
    activeText: '', // phrase currently being typed or deleted
  });
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const tick = useCallback(() => {
    const s = state.current;
    const item = sequence[s.seqIndex];

    if (item === undefined) return;

    // ── Number → pause, then move to next item ──
    if (typeof item === 'number') {
      s.phase = 'pausing';
      timerRef.current = setTimeout(() => {
        s.seqIndex = (s.seqIndex + 1) % sequence.length;

        // After a pause the next item is a string to type.
        // But first we need to delete the current text.
        if (s.charIndex > 0) {
          s.phase = 'deleting';
        } else {
          s.phase = 'typing';
        }
        tick();
      }, item);
      return;
    }

    // ── String → type or delete character by character ──
    if (s.phase === 'typing') {
      s.activeText = item; // remember what we're typing
      if (s.charIndex < item.length) {
        s.charIndex++;
        setDisplayText(item.slice(0, s.charIndex));
        timerRef.current = setTimeout(tick, speed);
      } else {
        // Finished typing this phrase → advance to next item (a pause)
        s.seqIndex = (s.seqIndex + 1) % sequence.length;
        tick();
      }
      return;
    }

    if (s.phase === 'deleting') {
      // Always delete from activeText — seqIndex may have already
      // advanced past the phrase we displayed.
      if (s.charIndex > 0) {
        s.charIndex--;
        setDisplayText(s.activeText.slice(0, s.charIndex));
        timerRef.current = setTimeout(tick, deletionSpeed);
      } else {
        // Finished deleting → check if we should repeat
        s.cycles++;
        const maxCycles =
          typeof repeat === 'number' ? repeat : repeat ? Infinity : 1;

        if (s.cycles >= maxCycles) return; // done

        // seqIndex already points at the next phrase (set by the pause handler).
        // If it landed on a number, skip forward to the next string.
        while (typeof sequence[s.seqIndex] === 'number') {
          s.seqIndex = (s.seqIndex + 1) % sequence.length;
        }
        s.phase = 'typing';
        tick();
      }
    }
  }, [sequence, speed, deletionSpeed, repeat]);

  useEffect(() => {
    // Reset and start
    state.current = {
      seqIndex: 0,
      charIndex: 0,
      phase: 'typing',
      cycles: 0,
      activeText: '',
    };
    setDisplayText('');
    tick();

    return () => clearTimeout(timerRef.current);
  }, [tick]);

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
          animate={{ opacity: [1, 1, 0, 0] }}
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
