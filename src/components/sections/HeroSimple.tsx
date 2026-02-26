'use client';

import * as React from 'react';
import { motion, Variants } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { ResumeDownloadButton } from '@/components/ui/ResumeDownloadButton';
import { SocialIconButton } from '@/components/ui/SocialIconButton';
import {
  /* ArrowRight, */ Github,
  Linkedin,
  Mail,
  Sparkles,
} from 'lucide-react';
// import { TrackedLink } from '@/components/analytics';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const texts = [
  'exceptional web apps',
  'scalable solutions',
  'beautiful interfaces',
  'digital experiences',
];

export function HeroSimple() {
  const [text, setText] = React.useState('exceptional web apps');

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % texts.length;
      setText(texts[index] || '');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center">
      {/* Simple Gradient Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-mocha-50 via-background to-navy-50 dark:from-navy-950 dark:via-background dark:to-mocha-950" />

        {/* Simple animated blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mocha-200/30 dark:bg-mocha-800/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-navy-200/30 dark:bg-navy-800/30 rounded-full blur-3xl animate-pulse" />
      </div>

      <Container size="wide" padding="lg">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="flex justify-center">
            <Badge
              variant="outline"
              className="px-4 py-2 border-mocha-500/50 bg-mocha-50/50 dark:bg-mocha-900/20"
            >
              <Sparkles className="mr-2 h-3 w-3 text-mocha-600" />
              Available for new opportunities
            </Badge>
          </motion.div>

          {/* Main Heading */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold">
              Hi, I&apos;m{' '}
              <span className="bg-gradient-to-r from-mocha-500 to-accent-green bg-clip-text text-transparent inline-block">
                Oles Didukh
              </span>
            </h1>

            {/* Animated Text with Simple Fade */}
            <div className="text-2xl md:text-3xl lg:text-4xl text-muted-foreground font-medium">
              I build{' '}
              <motion.span
                key={text}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-foreground inline-block"
              >
                {text}
              </motion.span>
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto"
          >
            Senior Front-End Engineer with{' '}
            <span className="text-mocha-600 dark:text-mocha-400 font-semibold">
              7+ years of experience
            </span>{' '}
            crafting high-performance web applications using{' '}
            <span className="text-navy-600 dark:text-navy-400 font-semibold">
              React, TypeScript, Next.js,
            </span>{' '}
            and modern web technologies. Passionate about creating{' '}
            <span className="text-accent-green font-semibold">
              exceptional user experiences
            </span>{' '}
            that make a difference.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto py-8"
          >
            {[
              { label: 'Years Experience', value: '7+' },
              { label: 'Projects Completed', value: '15+' },
              { label: 'Happy Clients', value: '10+' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-mocha-600 dark:text-mocha-400">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap gap-4 justify-center"
          >
            {/* <Button size="lg" className="group" asChild>
              <TrackedLink href="/projects" ctaName="hero_view_work">
                View My Work
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </TrackedLink>
            </Button> */}
            <ResumeDownloadButton size="lg" variant="outline" />
          </motion.div>

          {/* Social Links */}
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4"
          >
            <span className="text-sm text-muted-foreground">
              Connect with me:
            </span>
            <div className="flex gap-2">
              <SocialIconButton
                icon={Github}
                href="https://github.com/odidukh"
                aria-label="GitHub"
                variant="subtle"
                size="lg"
              />
              <SocialIconButton
                icon={Linkedin}
                href="https://linkedin.com/in/oles-didukh"
                aria-label="LinkedIn"
                variant="subtle"
                size="lg"
              />
              <SocialIconButton
                icon={Mail}
                aria-label="Email"
                variant="subtle"
                size="lg"
                obfuscateEmail
              />
            </div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div variants={itemVariants} className="pt-12">
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="flex flex-col items-center gap-2 text-muted-foreground"
            >
              <span className="text-xs uppercase tracking-wider">
                Scroll to explore
              </span>
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
