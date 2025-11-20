'use client';

import * as React from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Timeline } from '@/components/sections/Timeline';
import { SkillsGrid } from '@/components/sections/SkillsGrid';
import { InterestsSection } from '@/components/sections/InterestsSection';
import {
  User,
  MapPin,
  Mail,
  Calendar,
  Award,
  BookOpen,
  Coffee,
  Rocket,
  Target,
  Sparkles,
  Download,
  ArrowRight,
} from 'lucide-react';

import Link from 'next/link';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export function AboutSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  const personalInfo = {
    name: 'Oles Didukh',
    role: 'Senior Front-End Engineer',
    location: 'Vinnytsia, Ukraine',
    experience: '7+ years',
    email: 'oles.didukh@gmail.com',
    languages: [
      'Ukrainian (Native)',
      'English (Professional)',
      'Polish (Basic)',
    ],
  };

  const achievements = [
    { icon: Award, label: '50+ Projects Delivered', color: 'text-success-600' },
    { icon: User, label: '30+ Happy Clients', color: 'text-mocha-600' },
    {
      icon: Rocket,
      label: '25% Avg Performance Boost',
      color: 'text-info-600',
    },
    { icon: Target, label: '99% On-Time Delivery', color: 'text-warning-600' },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      id="about"
    >
      {/* Background Elements */}
      <motion.div
        style={{ y: parallaxY, opacity }}
        className="absolute inset-0 -z-10"
      >
        <div className="absolute top-20 left-10 w-72 h-72 bg-mocha-200/20 dark:bg-mocha-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-navy-200/20 dark:bg-navy-800/20 rounded-full blur-3xl" />
      </motion.div>

      <Container size="lg" padding="lg">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-16"
        >
          {/* Section Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <Badge variant="outline" className="mb-4">
              <User className="mr-2 h-3 w-3" />
              About Me
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Turning Ideas Into{' '}
              <span className="bg-gradient-to-r from-mocha-500 to-accent-green bg-clip-text text-transparent">
                Digital Reality
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A passionate front-end engineer with a unique journey from physics
              to programming, dedicated to creating exceptional web experiences
              that make a difference.
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Personal Info */}
            <motion.div variants={itemVariants} className="space-y-6">
              {/* Profile Card */}
              <Card className="overflow-hidden">
                <div className="relative h-48 bg-gradient-to-br from-mocha-400 to-navy-600">
                  <div className="absolute inset-0 bg-black/20" />
                  <motion.div
                    className="absolute bottom-4 left-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="w-24 h-24 rounded-full bg-white dark:bg-gray-800 p-1">
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-mocha-400 to-navy-600 flex items-center justify-center text-white text-3xl font-bold">
                        OD
                      </div>
                    </div>
                  </motion.div>
                </div>
                <CardContent className="pt-8 space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold">{personalInfo.name}</h3>
                    <p className="text-muted-foreground">{personalInfo.role}</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{personalInfo.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{personalInfo.experience} of experience</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <a
                        href={`mailto:${personalInfo.email}`}
                        className="hover:text-primary transition-colors"
                      >
                        {personalInfo.email}
                      </a>
                    </div>
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button className="w-full" asChild>
                      <a href="/resume.pdf" download>
                        <Download className="mr-2 h-4 w-4" />
                        Download Resume
                      </a>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/contact">
                        <Mail className="mr-2 h-4 w-4" />
                        Contact Me
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Languages */}
              <Card>
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Languages
                  </h4>
                  <div className="space-y-2">
                    {personalInfo.languages.map(lang => (
                      <div key={lang} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-mocha-500" />
                        <span className="text-sm">{lang}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Middle Column - Story */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              {/* Personal Story */}
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <h3 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-mocha-500" />
                    My Journey
                  </h3>

                  <div className="prose prose-gray dark:prose-invert max-w-none space-y-4">
                    <p className="text-muted-foreground">
                      My journey into tech began with a{' '}
                      <span className="text-foreground font-semibold">
                        Master&apos;s degree in Physics
                      </span>{' '}
                      from Taras Shevchenko University, where I developed a
                      strong analytical foundation and problem-solving mindset.
                      The transition from quantum mechanics to code felt natural
                      – both require precision, logic, and creativity.
                    </p>

                    <p className="text-muted-foreground">
                      In 2017, I was selected from{' '}
                      <span className="text-foreground font-semibold">
                        13,000+ applicants
                      </span>{' '}
                      to join UNIT Factory, Ukraine&apos;s only École 42
                      programming school. This intensive, peer-to-peer learning
                      environment transformed me into a self-directed developer
                      who thrives on challenges.
                    </p>

                    <p className="text-muted-foreground">
                      Over the past{' '}
                      <span className="text-foreground font-semibold">
                        7+ years
                      </span>
                      , I&apos;ve specialized in building scalable React
                      applications, from migrating legacy jQuery systems to
                      architecting modern TypeScript solutions. I&apos;ve led
                      teams, mentored developers, and consistently delivered
                      projects that exceed expectations.
                    </p>

                    <p className="text-muted-foreground">
                      Today, I combine my physics background with cutting-edge
                      web technologies to create{' '}
                      <span className="text-foreground font-semibold">
                        performant, accessible, and beautiful
                      </span>{' '}
                      digital experiences. Whether it&apos;s optimizing Core Web
                      Vitals or implementing complex UI interactions, I approach
                      each challenge with scientific rigor and creative
                      innovation.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4">
                    <Badge variant="outline">Problem Solver</Badge>
                    <Badge variant="outline">Team Leader</Badge>
                    <Badge variant="outline">Continuous Learner</Badge>
                    <Badge variant="outline">Innovation Driver</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Achievements Grid */}
              <div className="grid grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-3">
                          <achievement.icon
                            className={`h-8 w-8 ${achievement.color}`}
                          />
                          <div>
                            <p className="font-semibold text-sm">
                              {achievement.label}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Philosophy */}
              <Card className="bg-gradient-to-br from-mocha-50 to-navy-50 dark:from-mocha-900/20 dark:to-navy-900/20 border-mocha-200 dark:border-mocha-800">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    My Philosophy
                  </h4>
                  <blockquote className="border-l-4 border-mocha-500 pl-4 italic text-muted-foreground">
                    &quot;Great code isn&apos;t just about making things work –
                    it&apos;s about creating solutions that are elegant,
                    maintainable, and delightful to use. Every line of code is
                    an opportunity to make someone&apos;s life easier.&quot;
                  </blockquote>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Timeline Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-center mb-8">
              Professional Journey
            </h3>
            <Timeline />
          </motion.div>

          {/* Skills Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-center mb-8">
              Technical Expertise
            </h3>
            <SkillsGrid />
          </motion.div>

          {/* Interests Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-center mb-8">
              Beyond Coding
            </h3>
            <InterestsSection />
          </motion.div>

          {/* CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4 pt-8"
          >
            <p className="text-lg text-muted-foreground">
              Ready to bring your ideas to life?
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/projects">
                  View My Work
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Let&apos;s Talk</Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
