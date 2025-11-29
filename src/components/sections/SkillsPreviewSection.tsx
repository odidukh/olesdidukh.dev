'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Code2,
  Monitor,
  Server,
  Smartphone,
  Cloud,
  ArrowRight,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

const skillCategories = [
  { name: 'Frontend', count: '15+', icon: Monitor },
  { name: 'Backend', count: '8+', icon: Server },
  { name: 'Mobile', count: '5+', icon: Smartphone },
  { name: 'DevOps', count: '10+', icon: Cloud },
];

const skillCloud = [
  'React',
  'TypeScript',
  'Next.js',
  'Node.js',
  'GraphQL',
  'Docker',
  'AWS',
  'Tailwind',
  'PostgreSQL',
];

export const SkillsPreviewSection = React.memo(function SkillsPreviewSection() {
  return (
    <section className="py-20">
      <Container size="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
        >
          {/* Left: Content */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Technical Expertise
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Modern Tech Stack for
              <span className="text-primary"> Modern Solutions</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Proficient in cutting-edge technologies and frameworks, constantly
              expanding my toolkit to deliver the best solutions.
            </p>

            {/* Skill Categories Preview */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {skillCategories.map(category => (
                <div key={category.name} className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <category.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{category.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {category.count} tools
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button asChild>
                <Link href="/skills">
                  View All Skills
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/experience">Work Experience</Link>
              </Button>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Skill Cloud Visualization */}
              <div className="grid grid-cols-3 gap-3">
                {skillCloud.map((skill, index) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="bg-card border border-border rounded-lg p-3 text-center"
                  >
                    <span className="text-sm font-medium">{skill}</span>
                  </motion.div>
                ))}
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 20,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -top-4 -right-4 w-24 h-24 border-2 border-primary/20 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 30,
                  repeat: Infinity,
                  ease: 'linear',
                }}
                className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-primary/10 rounded-full"
              />
            </motion.div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
});

SkillsPreviewSection.displayName = 'SkillsPreviewSection';
