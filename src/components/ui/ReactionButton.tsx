'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

interface ReactionButtonProps {
  slug: string;
}

export function ReactionButton({ slug }: ReactionButtonProps) {
  const [reactions, setReactions] = useState<number | null>(null);
  const [localBatch, setLocalBatch] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch initial reactions
  useEffect(() => {
    const fetchReactions = async () => {
      try {
        const response = await fetch(`/api/reactions/${slug}`);
        if (response.ok) {
          const data = await response.json();
          setReactions(data.reactions);
        }
      } catch (error) {
        console.error('Failed to fetch reactions:', error);
      }
    };

    fetchReactions();
  }, [slug]);

  // Handle claps
  const handleReact = () => {
    if (localBatch >= 50) return; // Max 50 claps per session/batch

    setLocalBatch(prev => prev + 1);
    setReactions(prev => (prev !== null ? prev + 1 : 1));

    // Debounce the API call
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(async () => {
      if (localBatch > 0) {
        try {
          const countToSubmit = localBatch + 1; // +1 for the current click because state update is async
          setLocalBatch(0); // Reset early for next batch

          const response = await fetch(`/api/reactions/${slug}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ count: countToSubmit }),
          });

          if (response.ok) {
            const data = await response.json();
            // Sync with server authoritative count
            setReactions(data.reactions);
          }
        } catch (error) {
          console.error('Failed to submit reactions:', error);
        }
      }
    }, 1000);
  };

  if (reactions === null) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Heart className="w-5 h-5" />
        </div>
        <div className="w-8 h-4 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <motion.button
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={handleReact}
          whileTap={{ scale: 0.9 }}
          className={`w-12 h-12 rounded-full flex items-center justify-center border transition-colors ${
            localBatch > 0 || isHovered
              ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
              : 'bg-card border-border text-muted-foreground hover:bg-muted'
          }`}
          aria-label="Clap for this post"
        >
          <Heart
            className={`w-5 h-5 ${localBatch > 0 ? 'fill-rose-500' : ''}`}
          />
        </motion.button>

        {/* Floating number animation */}
        <AnimatePresence>
          {localBatch > 0 && (
            <motion.div
              key={localBatch}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -40, scale: 1 }}
              exit={{ opacity: 0, y: -60, transition: { duration: 0.5 } }}
              className="absolute top-0 left-1/2 -translate-x-1/2 font-bold text-rose-500 select-none pointer-events-none"
            >
              +{localBatch}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <span className="text-sm font-medium text-muted-foreground min-w-[3ch]">
        {reactions.toLocaleString()}
      </span>
    </div>
  );
}
