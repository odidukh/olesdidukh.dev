'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Rocket, Briefcase, Award, School, ArrowRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const journeyMilestones = [
  {
    year: '2017',
    title: 'Started Journey',
    icon: School,
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    year: '2018',
    title: 'First Dev Role',
    icon: Briefcase,
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    year: '2021',
    title: 'Senior Level',
    icon: Award,
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    year: '2024',
    title: 'Innovation Era',
    icon: Rocket,
    color: 'from-orange-500/20 to-red-500/20',
  },
];

export const JourneySection = React.memo(function JourneySection() {
  return (
    <section className="py-20 bg-muted/30">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Rocket className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Career Journey
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            From <span className="text-primary">Physics</span> to{' '}
            <span className="text-primary">Pixels</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A journey of continuous growth, learning, and innovation
          </p>
        </motion.div>

        {/* Journey Timeline Preview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
          {journeyMilestones.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.color} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity`}
              />
              <div className="relative bg-card border border-border rounded-xl p-6 text-center">
                <div
                  className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${item.color} mb-3`}
                >
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="text-2xl font-bold mb-1">{item.year}</div>
                <div className="text-sm text-muted-foreground">
                  {item.title}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Journey CTA */}
        <div className="text-center">
          <Button size="lg" variant="outline" asChild>
            <Link href="/about/journey">
              Explore Full Journey
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
});

JourneySection.displayName = 'JourneySection';
