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
  Users,
  Globe,
  Calendar,
  ExternalLink,
  Mail,
  MousePointer2,
  Award,
} from 'lucide-react';

// Import critical above-the-fold components
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ResumeDownloadButton } from '@/components/ui/ResumeDownloadButton';
import { AboutSection } from '@/components/sections/AboutSection';
import { HeroBackground } from '@/components/sections/HeroBackground';
import { JourneySection } from '@/components/sections/JourneySection';
import { SkillsPreviewSection } from '@/components/sections/SkillsPreviewSection';
import { PhilosophySection } from '@/components/sections/PhilosophySection';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import {
  // ProjectsErrorFallback,
  BlogErrorFallback,
  ContactErrorFallback,
  TestimonialsErrorFallback,
} from '@/components/ui/SectionErrorFallback';

// Lazy load below-the-fold heavy components
// const ProjectsSection = dynamic(
//   () =>
//     import('@/components/sections/ProjectsSection').then(
//       mod => mod.ProjectsSection
//     ),
//   { ssr: true }
// );

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
                {/* <Button size="lg" asChild>
                  <Link href="#projects">
                    View My Work
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button> */}
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
                <Link
                  href="#about"
                  className="block rounded-lg p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  aria-label="Scroll to about section"
                >
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
        <JourneySection />

        {/* Skills & Expertise Teaser */}
        <SkillsPreviewSection />

        {/* Philosophy Teaser */}
        <PhilosophySection />

        {/* Projects Section */}
        {/* <ErrorBoundary
          sectionName="Projects"
          fallbackRender={ProjectsErrorFallback}
        >
          <ProjectsSection />
        </ErrorBoundary> */}

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
                    href="https://calendly.com/oles-didukh"
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
