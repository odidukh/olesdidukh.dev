'use client';

import { useState, useRef } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useScroll,
  useTransform,
} from 'framer-motion';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import {
  ArrowRight,
  Code2,
  User,
  Users,
  Calendar,
  MapPin,
  GraduationCap,
  Briefcase,
  BookOpen,
  Zap,
  Heart,
  Rocket,
  CheckCircle,
  Star,
  GitBranch,
  Database,
  Cloud,
  Smartphone,
  Monitor,
  ChevronRight,
  Quote,
  type LucideIcon,
} from 'lucide-react';
import { StatusIndicator } from '@/components/ui/StatusIndicator';
import { GridPatternBackground } from '@/components/ui/backgrounds/GridPatternBackground';

interface Stat {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

interface Value {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface SkillCategory {
  name: string;
  skills: string[];
  icon: LucideIcon;
  color: string;
}

interface Timeline {
  year: string;
  title: string;
  description: string;
  type: 'work' | 'education' | 'milestone';
}

const stats: Stat[] = [
  {
    label: 'Years Experience',
    value: `${new Date().getFullYear() - 2018}+`,
    icon: Calendar,
    color: 'text-navy-500',
  },
  {
    label: 'Users Impacted',
    value: '60K+',
    icon: Users,
    color: 'text-success-500',
  },
  {
    label: 'Companies',
    value: '4',
    icon: Briefcase,
    color: 'text-mocha-500',
  },
  {
    label: 'Technologies',
    value: '25+',
    icon: Code2,
    color: 'text-warning-500',
  },
];

const values: Value[] = [
  {
    title: 'Performance Obsessed',
    description:
      'Every millisecond counts. I optimize for speed and efficiency.',
    icon: Zap,
  },
  {
    title: 'User-Centric',
    description:
      'Beautiful interfaces that solve real problems for real people.',
    icon: Heart,
  },
  {
    title: 'Clean Code',
    description: 'Maintainable, scalable code that teams love to work with.',
    icon: Code2,
  },
  {
    title: 'Continuous Learning',
    description: 'Always exploring new technologies and best practices.',
    icon: BookOpen,
  },
];

const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
    icon: Monitor,
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    name: 'Backend',
    skills: ['Node.js', 'GraphQL', 'PostgreSQL', 'Redis'],
    icon: Database,
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    name: 'Mobile',
    skills: ['React Native', 'Expo', 'PWA'],
    icon: Smartphone,
    color: 'from-purple-500/20 to-pink-500/20',
  },
  {
    name: 'Tools',
    skills: ['Git', 'Docker', 'AWS', 'Figma'],
    icon: Cloud,
    color: 'from-orange-500/20 to-red-500/20',
  },
];

const timeline: Timeline[] = [
  {
    year: '2017',
    title: 'UNIT Factory',
    description: 'Peer-to-peer programming education',
    type: 'education',
  },
  {
    year: '2018',
    title: 'First Developer Role',
    description: 'Junior Front-End at Helios Technologies',
    type: 'work',
  },
  {
    year: '2019',
    title: 'Inango Systems',
    description: 'Middle Front-End Developer',
    type: 'work',
  },
  {
    year: '2021',
    title: 'Senior at Emerline',
    description: 'Leading enterprise front-end architecture',
    type: 'work',
  },
  {
    year: '2024',
    title: 'Safebooks AI',
    description: 'Senior Front-End Engineer, Remote',
    type: 'work',
  },
];

export function AboutSection() {
  const [activeTab, setActiveTab] = useState<'story' | 'skills' | 'values'>(
    'story'
  );
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [100, -100]);

  return (
    <motion.section
      ref={sectionRef}
      className="relative pt-8 pb-24 md:pt-12 md:pb-32 overflow-hidden bg-muted/30 dark:bg-muted/10"
      id="about"
      style={
        {
          '--about-y': y,
        } as React.CSSProperties & import('framer-motion').MotionStyle
      }
    >
      <div className="absolute inset-0 opacity-30 dark:opacity-15 pointer-events-none">
        <GridPatternBackground
          variant="dots"
          gridSize={50}
          interactive={false}
        />
      </div>

      {/* Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-primary/5 to-background" />
        <motion.div style={{ y }} className="absolute inset-0">
          {/* Floating Orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        </motion.div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <Container size="lg" className="relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">About Me</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Turning Ideas Into{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-mocha-400">
              Digital Reality
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Senior Front-End Engineer with {new Date().getFullYear() - 2018}+
            years of experience crafting exceptional web experiences that
            delight users and drive business results
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-card border border-border rounded-2xl p-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center mb-12"
        >
          <div
            className="inline-flex p-1 bg-muted rounded-lg"
            role="tablist"
            aria-label="About sections"
          >
            {(['story', 'skills', 'values'] as const).map(tab => (
              <button
                key={tab}
                role="tab"
                id={`tab-${tab}`}
                aria-selected={activeTab === tab}
                aria-controls={`tabpanel-${tab}`}
                onClick={() => setActiveTab(tab)}
                className={`
                  px-6 py-3 rounded-md font-medium transition-all capitalize
                  ${
                    activeTab === tab
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {tab}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Tab Content */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Story Tab */}
            {activeTab === 'story' && (
              <motion.div
                key="story"
                role="tabpanel"
                id="tabpanel-story"
                aria-labelledby="tab-story"
                tabIndex={0}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                {/* Left: Personal Story */}
                <div className="space-y-6">
                  <div className="relative">
                    <Quote className="absolute -top-4 -left-1 sm:-left-4 w-8 h-8 text-primary/20" />
                    <h3 className="text-3xl font-bold mb-4">
                      From <span className="text-primary">Atoms</span> to{' '}
                      <span className="text-primary">Pixels</span>
                    </h3>
                  </div>

                  <div className="space-y-4 text-lg text-muted-foreground">
                    <p>
                      My journey began with a physics degree and a curiosity
                      about how things work. That analytical mindset became my
                      superpower in programming—breaking down complex problems
                      into elegant solutions.
                    </p>
                    <p>
                      Over {new Date().getFullYear() - 2018}+ years, I&apos;ve
                      evolved from a curious beginner to a Senior Front-End
                      Engineer, collaborating with startups and enterprises to
                      build applications that serve thousands of users daily.
                    </p>
                    <p>
                      Today, I specialize in React and TypeScript, creating
                      performant, accessible web applications that push
                      boundaries. Every project is an opportunity to innovate
                      and create something meaningful.
                    </p>
                  </div>

                  {/* Location & Availability */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      <span>Vinnytsia, Ukraine</span>
                    </div>
                    <StatusIndicator variant="available" />
                  </div>

                  {/* CTA Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button asChild>
                      <Link href="/about/journey">
                        Full Journey
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/about/philosophy">My Philosophy</Link>
                    </Button>
                  </div>
                </div>

                {/* Right: Timeline */}
                <div className="relative">
                  <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent" />

                  {timeline.map((event, index) => (
                    <motion.div
                      key={event.year}
                      initial={{ opacity: 0, x: 20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="relative flex items-start gap-6 mb-8"
                    >
                      <div className="relative z-10">
                        <div className="w-16 h-16 bg-card border-2 border-primary rounded-full flex items-center justify-center">
                          {event.type === 'work' ? (
                            <Briefcase className="w-6 h-6 text-primary" />
                          ) : event.type === 'education' ? (
                            <GraduationCap className="w-6 h-6 text-primary" />
                          ) : (
                            <Star className="w-6 h-6 text-primary" />
                          )}
                        </div>
                      </div>

                      <div className="flex-1 pt-2">
                        <div className="text-sm text-primary font-medium mb-1">
                          {event.year}
                        </div>
                        <h4 className="text-lg font-semibold mb-1">
                          {event.title}
                        </h4>
                        <p className="text-muted-foreground">
                          {event.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}

                  {/* Continue Journey Link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 1 }}
                    className="relative flex items-start gap-6"
                  >
                    <div className="relative z-10">
                      <div className="w-16 h-16 bg-primary/10 border-2 border-primary/50 border-dashed rounded-full flex items-center justify-center">
                        <Rocket className="w-6 h-6 text-primary animate-pulse" />
                      </div>
                    </div>
                    <div className="flex-1 pt-2">
                      <div className="text-sm text-primary font-medium mb-1">
                        2025+
                      </div>
                      <h4 className="text-lg font-semibold mb-1">
                        The Journey Continues
                      </h4>
                      <p className="text-muted-foreground">
                        Always learning, always growing...
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {/* Skills Tab */}
            {activeTab === 'skills' && (
              <motion.div
                key="skills"
                role="tabpanel"
                id="tabpanel-skills"
                aria-labelledby="tab-skills"
                tabIndex={0}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {skillCategories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                      className="relative group"
                    >
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${category.color} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity`}
                      />
                      <div className="relative bg-card border border-border rounded-xl p-6">
                        <div
                          className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${category.color} mb-4`}
                        >
                          <category.icon className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-semibold mb-3">
                          {category.name}
                        </h3>
                        <div className="space-y-2">
                          {category.skills.map(skill => (
                            <div
                              key={skill}
                              className="flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4 text-primary" />
                              <span className="text-sm">{skill}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Skills CTA */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="text-center pt-8"
                >
                  <p className="text-muted-foreground mb-6">
                    And 20+ more technologies across the full stack
                  </p>
                  <div className="flex gap-4 justify-center">
                    <Button variant="outline" asChild>
                      <Link href="/skills">
                        View All Skills
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <Link href="/experience">
                        Work Experience
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Link>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* Values Tab */}
            {activeTab === 'values' && (
              <motion.div
                key="values"
                role="tabpanel"
                id="tabpanel-values"
                aria-labelledby="tab-values"
                tabIndex={0}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {values.map((value, index) => (
                  <motion.div
                    key={value.title}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-card border border-border rounded-xl p-8">
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                            <value.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">
                              {value.title}
                            </h3>
                            <p className="text-muted-foreground">
                              {value.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h3 className="text-3xl font-bold mb-4">
            Curious About Working <span className="text-primary">Together</span>
            ?
          </h3>

          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            I&apos;m always excited to work on innovative projects and
            collaborate with passionate teams
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/contact">
                Get In Touch
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/projects">View My Work</Link>
            </Button>
            <Button size="lg" variant="ghost" asChild>
              <a
                href="https://github.com/odidukh"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitBranch className="mr-2 w-4 h-4" />
                GitHub
              </a>
            </Button>
          </div>
        </motion.div>
      </Container>
    </motion.section>
  );
}
