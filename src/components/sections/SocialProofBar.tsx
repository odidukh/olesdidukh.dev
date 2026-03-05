'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Briefcase, Users, Building2, Code2 } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { Container } from '@/components/ui/Container';

function useCounter(end: number, duration: number, start: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, start]);

  return count;
}

const stats = [
  {
    icon: Briefcase,
    value: new Date().getFullYear() - 2018,
    suffix: '+',
    label: 'Years Experience',
  },
  { icon: Users, value: 60, suffix: 'K+', label: 'Users Impacted' },
  { icon: Building2, value: 4, suffix: '', label: 'Companies' },
  { icon: Code2, value: 25, suffix: '+', label: 'Technologies' },
] as const;

function StatItem({
  icon: Icon,
  value,
  suffix,
  label,
  index,
  inView,
  reducedMotion,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
  index: number;
  inView: boolean;
  reducedMotion: boolean;
}) {
  const count = useCounter(value, 2, inView && !reducedMotion);
  const displayValue = reducedMotion ? value : count;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex flex-col items-center text-center gap-2"
    >
      <Icon className="w-5 h-5 text-primary/60" />
      <div className="text-3xl md:text-4xl font-bold text-foreground">
        {displayValue}
        {suffix}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{label}</div>
    </motion.div>
  );
}

export function SocialProofBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      className="py-12 border-y border-border/50 bg-muted/20 dark:bg-muted/5"
    >
      <Container size="lg">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              {...stat}
              index={index}
              inView={isInView}
              reducedMotion={prefersReducedMotion}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
