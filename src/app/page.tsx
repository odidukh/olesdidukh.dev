'use client';

import { useEffect, useState, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  ChevronDown,
  Code2,
  Star,
  GitBranch,
  Briefcase,
  Award,
  Users,
  Zap,
  Globe,
  Calendar,
  ExternalLink,
  Mail,
  MousePointer2,
  Rocket,
  Brain,
  Heart,
  BookOpen,
  School,
  Server,
  Smartphone,
  Cloud,
  Monitor,
} from 'lucide-react';

// Import critical above-the-fold components
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResumeDownloadButton } from '@/components/ui/ResumeDownloadButton';
import { AboutSection } from '@/components/sections/AboutSection';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  ProjectsErrorFallback,
  BlogErrorFallback,
  ContactErrorFallback,
  TestimonialsErrorFallback,
} from '@/components/ui/SectionErrorFallback';

// Lazy load below-the-fold heavy components
const ProjectsSection = dynamic(
  () =>
    import('@/components/sections/ProjectsSection').then(
      mod => mod.ProjectsSection
    ),
  { ssr: true }
);

const BlogSection = dynamic(
  () =>
    import('@/components/sections/BlogSection').then(mod => mod.BlogSection),
  { ssr: true }
);

const ContactSection = dynamic(
  () =>
    import('@/components/sections/ContactSection').then(
      mod => mod.ContactSection
    ),
  { ssr: true }
);

const TestimonialsCarousel = dynamic(
  () =>
    import('@/components/sections/TestimonialsCarousel').then(
      mod => mod.TestimonialsCarousel
    ),
  { ssr: true }
);

// Lazy load 3D background with intersection observer (heavy, not critical)
const LazyHeroBackground3D = dynamic(
  () =>
    import('@/components/three/LazyHeroBackground3D').then(
      mod => mod.LazyHeroBackground3D
    ),
  { ssr: false }
);

// Quick Stats Data
const stats = [
  {
    label: 'Years Experience',
    value: '7+',
    icon: Calendar,
    color: 'text-blue-500',
  },
  {
    label: 'Projects Completed',
    value: '50+',
    icon: Briefcase,
    color: 'text-green-500',
  },
  {
    label: 'Technologies',
    value: '25+',
    icon: Code2,
    color: 'text-purple-500',
  },
  {
    label: 'Happy Clients',
    value: '30+',
    icon: Users,
    color: 'text-orange-500',
  },
];

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

interface Particle {
  id: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

export default function HomePage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();

  // Parallax transforms
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);

  // Typing animation text
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Building Digital Excellence';

  useEffect(() => {
    // Typing animation
    let index = 0;
    const interval = setInterval(() => {
      if (index <= fullText.length) {
        setDisplayText(fullText.slice(0, index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for hero effects
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate particles on client side to avoid hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <>
      {/* Main Navigation */}
      <Navigation />

      <main id="main-content">
        {/* Hero Section - Redesigned */}
        <section
          ref={heroRef}
          id="hero"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          {/* 3D Background - Desktop only, lazy loaded with intersection observer */}
          <LazyHeroBackground3D />

          {/* Dynamic Background */}
          <motion.div style={{ y: heroY }} className="absolute inset-0 -z-10">
            {/* Gradient Mesh */}
            <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />

            {/* Animated Orbs */}
            <motion.div
              animate={{
                x: mousePosition.x * 0.02,
                y: mousePosition.y * 0.02,
              }}
              transition={{ type: 'spring', stiffness: 50 }}
              className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl"
            />
            <motion.div
              animate={{
                x: mousePosition.x * -0.02,
                y: mousePosition.y * -0.02,
              }}
              transition={{ type: 'spring', stiffness: 50 }}
              className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
            />

            {/* Grid Pattern */}
            <div
              className="absolute inset-0 opacity-5"
              style={{
                backgroundImage: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(var(--primary), 0.1) 0%, transparent 50%)`,
              }}
            />

            {/* Floating Particles */}
            <div className="absolute inset-0">
              {particles.map(particle => (
                <motion.div
                  key={particle.id}
                  className="absolute w-1 h-1 bg-primary/30 rounded-full"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                  }}
                />
              ))}
            </div>
          </motion.div>

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
                className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-full mb-8"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-500">
                  Available for new opportunities
                </span>
              </motion.div>

              {/* Main Hero Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6">
                  <span className="block text-muted-foreground text-2xl md:text-3xl font-normal mb-4">
                    Hi, I&apos;m Oles Didukh
                  </span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary">
                    Senior Front-End
                  </span>
                  <span className="block mt-2">Engineer</span>
                </h1>

                <div className="text-xl md:text-2xl text-muted-foreground mb-2">
                  <span className="font-mono text-primary">{displayText}</span>
                  <span className="animate-pulse">|</span>
                </div>

                <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
                  Crafting exceptional web experiences with modern technologies.
                  7+ years transforming ideas into scalable, performant
                  applications that delight users and drive business results.
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
                <Button size="lg" asChild>
                  <Link href="#projects">
                    View My Work
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="#contact">
                    Get In Touch
                    <Mail className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <ResumeDownloadButton size="lg" variant="ghost">
                  Resume
                </ResumeDownloadButton>
              </motion.div>

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + index * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-card/50 backdrop-blur border border-border rounded-xl p-4"
                  >
                    <stat.icon
                      className={`w-6 h-6 mx-auto mb-2 ${stat.color}`}
                    />
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-xs text-muted-foreground">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Scroll Indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2"
              >
                <Link href="#about" className="block">
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-muted-foreground"
                  >
                    <MousePointer2 className="w-6 h-6 mx-auto mb-2" />
                    <ChevronDown className="w-4 h-4 mx-auto" />
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </Container>
        </section>

        {/* About Section - Using Redesigned Component */}
        <AboutSection />

        {/* Featured Journey Teaser */}
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
              {[
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
              ].map((item, index) => (
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

        {/* Skills & Expertise Teaser */}
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
                  Proficient in cutting-edge technologies and frameworks,
                  constantly expanding my toolkit to deliver the best solutions.
                </p>

                {/* Skill Categories Preview */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {[
                    { name: 'Frontend', count: '15+', icon: Monitor },
                    { name: 'Backend', count: '8+', icon: Server },
                    { name: 'Mobile', count: '5+', icon: Smartphone },
                    { name: 'DevOps', count: '10+', icon: Cloud },
                  ].map(category => (
                    <div
                      key={category.name}
                      className="flex items-center gap-3"
                    >
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
                    {[
                      'React',
                      'TypeScript',
                      'Next.js',
                      'Node.js',
                      'GraphQL',
                      'Docker',
                      'AWS',
                      'Tailwind',
                      'PostgreSQL',
                    ].map((skill, index) => (
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

        {/* Philosophy Teaser */}
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
                {[
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
                ].map((principle, index) => (
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

        {/* Projects Section */}
        <ErrorBoundary
          sectionName="Projects"
          fallbackRender={ProjectsErrorFallback}
        >
          <ProjectsSection />
        </ErrorBoundary>

        {/* Testimonials Section */}
        <ErrorBoundary
          sectionName="Testimonials"
          fallbackRender={TestimonialsErrorFallback}
        >
          <TestimonialsCarousel />
        </ErrorBoundary>

        {/* Blog Section */}
        <ErrorBoundary sectionName="Blog" fallbackRender={BlogErrorFallback}>
          <BlogSection />
        </ErrorBoundary>

        {/* Contact Section */}
        <ErrorBoundary
          sectionName="Contact"
          fallbackRender={ContactErrorFallback}
        >
          <ContactSection />
        </ErrorBoundary>

        {/* Final CTA Section */}
        <section className="py-20 bg-gradient-to-t from-primary/10 via-background to-background">
          <Container size="md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full mb-6">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-green-500">
                  Open to opportunities
                </span>
              </div>

              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Build Something
                <span className="text-primary"> Amazing?</span>
              </h2>

              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Let&apos;s collaborate on your next project and create
                exceptional experiences together
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="#contact">
                    Start a Conversation
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a
                    href="https://calendly.com/olesdidukh"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Schedule a Call
                    <ExternalLink className="ml-2 w-4 h-4" />
                  </a>
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

              {/* Social Proof */}
              <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>5.0 Client Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-500" />
                  <span>International Clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-green-500" />
                  <span>100% Project Success</span>
                </div>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>

      <Footer />
    </>
  );
}
