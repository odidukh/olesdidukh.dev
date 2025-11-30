'use client';

import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResumeDownloadButton } from '@/components/ui/ResumeDownloadButton';
import { TypeAnimation } from '@/components/ui/TypeAnimation';
import { SunsetCodeRainBackground } from '@/components/ui/backgrounds';
import {
  ArrowRight,
  Github,
  Linkedin,
  Mail,
  Sparkles,
  Code2,
  Zap,
} from 'lucide-react';
import { TrackedLink } from '@/components/analytics';

const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 10,
    },
  },
};

export function HeroSection() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, 50]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  const stats = [
    { label: 'Years Experience', value: '7+' },
    { label: 'Projects Completed', value: '50+' },
    { label: 'Happy Clients', value: '30+' },
  ];

  const skills = ['React', 'TypeScript', 'Next.js', 'Node.js', 'AWS'];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background - Sunset Gradient + Code Rain */}
      <motion.div className="absolute inset-0 -z-10" style={{ opacity }}>
        <SunsetCodeRainBackground columns={16} rainOpacity={0.4} />
      </motion.div>

      <Container size="wide" padding="lg">
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              {/* Greeting Badge */}
              <motion.div variants={itemVariants}>
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
                  <span className="bg-gradient-to-r from-mocha-500 to-accent-green bg-clip-text text-transparent">
                    Oles
                  </span>
                </h1>
                <div className="text-3xl md:text-4xl lg:text-5xl font-semibold text-muted-foreground">
                  I build{' '}
                  <TypeAnimation
                    sequence={[
                      'exceptional web apps',
                      2000,
                      'scalable solutions',
                      2000,
                      'beautiful interfaces',
                      2000,
                      'digital experiences',
                      2000,
                    ]}
                    wrapper="span"
                    className="text-foreground"
                  />
                </div>
              </motion.div>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-lg md:text-xl text-muted-foreground max-w-xl"
              >
                Senior Front-End Engineer with{' '}
                <span className="text-mocha-600 dark:text-mocha-400 font-semibold">
                  7+ years
                </span>{' '}
                of experience crafting high-performance web applications using{' '}
                <span className="text-navy-600 dark:text-navy-400 font-semibold">
                  React, TypeScript,
                </span>{' '}
                and{' '}
                <span className="text-accent-green font-semibold">
                  modern web technologies
                </span>
                .
              </motion.p>

              {/* CTA Buttons */}
              <motion.div
                variants={itemVariants}
                className="flex flex-wrap gap-4"
              >
                <Button size="lg" className="group" asChild>
                  <TrackedLink href="/projects" ctaName="hero_view_work">
                    View My Work
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </TrackedLink>
                </Button>
                <ResumeDownloadButton size="lg" variant="outline" />
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={itemVariants}
                className="flex items-center gap-4"
              >
                <span className="text-sm text-muted-foreground">Connect:</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-mocha-600 dark:hover:text-mocha-400"
                    asChild
                  >
                    <a
                      href="https://github.com/odidukh"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="GitHub"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-mocha-600 dark:hover:text-mocha-400"
                    asChild
                  >
                    <a
                      href="https://linkedin.com/in/oles-didukh"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-mocha-600 dark:hover:text-mocha-400"
                    asChild
                  >
                    <a href="mailto:oles.didukh@gmail.com" aria-label="Email">
                      <Mail className="h-5 w-5" />
                    </a>
                  </Button>
                </div>
              </motion.div>

              {/* Stats */}
              <motion.div variants={itemVariants} className="flex gap-8 pt-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <motion.div
                      className="text-3xl font-bold text-mocha-600 dark:text-mocha-400"
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        delay: 1 + index * 0.1,
                        type: 'spring',
                        stiffness: 100,
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Content - 3D/Visual Element */}
            <motion.div
              variants={itemVariants}
              className="relative hidden lg:block"
              style={{ y: y1 }}
            >
              {/* Animated Code Block */}
              <motion.div
                className="relative"
                animate={{
                  rotateY: [0, 5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="relative bg-gradient-to-br from-navy-900 to-navy-800 dark:from-navy-950 dark:to-navy-900 rounded-2xl p-6 shadow-2xl">
                  {/* Terminal Header */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="ml-4 text-sm text-gray-400 font-mono">
                      portfolio.tsx
                    </span>
                  </div>

                  {/* Animated Code */}
                  <div className="font-mono text-sm space-y-2">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.5 }}
                      className="text-purple-400"
                    >
                      <span className="text-blue-400">const</span>{' '}
                      <span className="text-green-400">developer</span> = {'{'}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.7 }}
                      className="ml-4"
                    >
                      <span className="text-cyan-400">name:</span>{' '}
                      <span className="text-amber-400">
                        &quot;Oles Didukh&quot;
                      </span>
                      ,
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.9 }}
                      className="ml-4"
                    >
                      <span className="text-cyan-400">role:</span>{' '}
                      <span className="text-amber-400">
                        &quot;Senior Front-End Engineer&quot;
                      </span>
                      ,
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.1 }}
                      className="ml-4"
                    >
                      <span className="text-cyan-400">skills:</span> [
                    </motion.div>
                    {skills.map((skill, index) => (
                      <motion.div
                        key={skill}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 2.3 + index * 0.1 }}
                        className="ml-8"
                      >
                        <span className="text-amber-400">
                          &quot;{skill}&quot;
                        </span>
                        {index < skills.length - 1 ? ',' : ''}
                      </motion.div>
                    ))}
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 2.8 }}
                      className="ml-4"
                    >
                      ],
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 3 }}
                      className="ml-4"
                    >
                      <span className="text-cyan-400">available:</span>{' '}
                      <span className="text-green-400">true</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 3.2 }}
                    >
                      {'}'};
                    </motion.div>
                  </div>

                  {/* Animated Cursor */}
                  <motion.div
                    className="inline-block w-2 h-5 bg-green-400 ml-1"
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
                </div>

                {/* Floating Elements Around Code Block */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-success-500/20 backdrop-blur-sm rounded-lg p-3"
                  animate={{
                    y: [-5, 5, -5],
                    rotate: [-5, 5, -5],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Code2 className="h-6 w-6 text-success-600" />
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-mocha-500/20 backdrop-blur-sm rounded-lg p-3"
                  animate={{
                    y: [5, -5, 5],
                    rotate: [5, -5, 5],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Zap className="h-6 w-6 text-mocha-600" />
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
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
              <span className="text-xs uppercase tracking-wider">Scroll</span>
              <div className="w-5 h-8 border-2 border-muted-foreground/30 rounded-full flex justify-center">
                <motion.div
                  className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full mt-1.5"
                  animate={{
                    y: [0, 12, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
