'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Brain,
  Zap,
  Heart,
  Code2,
  BookOpen,
  Users,
  Rocket,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const principles = [
  {
    title: 'Performance First',
    icon: Zap,
    description: 'Every millisecond matters',
  },
  {
    title: 'User-Centric',
    icon: Heart,
    description: 'Intuitive experiences',
  },
  {
    title: 'Clean Code',
    icon: Code2,
    description: 'Maintainable solutions',
  },
  {
    title: 'Continuous Learning',
    icon: BookOpen,
    description: 'Always evolving',
  },
  {
    title: 'Team Excellence',
    icon: Users,
    description: 'Collaborative success',
  },
  {
    title: 'Innovation',
    icon: Rocket,
    description: 'Pragmatic creativity',
  },
];

export const PhilosophySection = React.memo(function PhilosophySection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Brain className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Development Philosophy
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Guided by <span className="text-primary">Principles</span>
          </h2>

          {/* Philosophy Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
            {principles.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-card border border-border rounded-xl p-4"
              >
                <principle.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-1">{principle.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {principle.description}
                </p>
              </motion.div>
            ))}
          </div>

          <Button variant="outline" asChild>
            <Link href="/about/philosophy">
              Explore My Philosophy
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </Container>
    </section>
  );
});

PhilosophySection.displayName = 'PhilosophySection';
