'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';

import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MagneticEffect } from '@/components/ui/MagneticEffect';
import { TypeAnimation } from '@/components/ui/TypeAnimation';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { useReducedMotion } from '@/hooks/useReducedMotion';

// Featured Skills for Hero
const featuredSkills = [
  'React',
  'TypeScript',
  'Next.js',
  'Node.js',
  'GraphQL',
  'Tailwind CSS',
  'AWS',
  'Docker',
  'PostgreSQL',
  'React Native',
];

// Rotating hero phrases (string, pause ms, string, pause ms, …)
const heroSequence: (string | number)[] = [
  'Building Digital Excellence',
  2000,
  'Crafting Scalable UIs',
  2000,
  'Shipping Pixel-Perfect Code',
  2000,
  'Engineering for Performance',
  2000,
];

export function HeroSectionClient() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const prefersReducedMotion = useReducedMotion();

  // Parallax transforms — zero-out when reduced motion preferred
  const heroY = useTransform(
    scrollY,
    [0, 500],
    prefersReducedMotion ? [0, 0] : [0, 150]
  );
  const heroOpacity = useTransform(
    scrollY,
    [0, 300],
    prefersReducedMotion ? [1, 1] : [1, 0]
  );
  const heroScale = useTransform(
    scrollY,
    [0, 300],
    prefersReducedMotion ? [1, 1] : [1, 0.95]
  );

  // Mouse tracking for hero effects — skip if reduced motion preferred
  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  return (
    <section
      ref={heroRef}
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Dynamic Background */}
      <HeroBackground heroY={heroY} mousePosition={mousePosition} />

      <Container size="lg" className="relative z-10">
        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="text-center"
        >
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-success-500/15 border border-success-500/30 rounded-full mb-8 shadow-sm shadow-success-500/10"
          >
            <div className="relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-success-500 rounded-full" />
              <div className="absolute w-2.5 h-2.5 bg-success-500 rounded-full animate-ping" />
            </div>
            <span className="text-sm font-semibold text-success-500">
              Open to Work
            </span>
          </motion.div>

          {/* Main Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
              <span className="block text-foreground/70 text-2xl md:text-3xl lg:text-4xl font-medium mb-4">
                Hi, I&apos;m
              </span>
              <span className="block bg-clip-text text-transparent bg-gradient-to-r from-primary via-mocha-400 to-primary mb-2">
                Oles Didukh
              </span>
              <span className="block text-foreground">
                Senior Front-End Engineer
              </span>
            </h1>

            <div className="text-xl md:text-2xl text-muted-foreground mb-2">
              {prefersReducedMotion ? (
                <span className="font-mono text-primary">
                  Building Digital Excellence
                </span>
              ) : (
                <TypeAnimation
                  sequence={heroSequence}
                  speed={80}
                  deletionSpeed={40}
                  repeat={true}
                  cursor={true}
                  className="font-mono text-primary"
                />
              )}
            </div>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Crafting exceptional web experiences with modern technologies. 7+
              years transforming ideas into scalable, performant applications
              that delight users and drive business results.
            </p>
          </motion.div>

          {/* Tech Stack Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-2 justify-center mb-12"
          >
            {featuredSkills.map((skill, index) => (
              <motion.div
                key={skill}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.05 }}
                whileHover={{ scale: 1.1, y: -2 }}
                className={index >= 5 ? 'hidden sm:block' : undefined}
              >
                <Badge variant="outline" className="px-3 py-1">
                  {skill}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <MagneticEffect strength={10}>
              <Button size="lg" variant="gradient" asChild>
                <Link href="#projects">
                  View My Work
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </MagneticEffect>
            <MagneticEffect strength={10}>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">
                  Get In Touch
                  <Mail className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </MagneticEffect>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
