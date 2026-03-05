'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ResumeDownloadButton } from '@/components/ui/ResumeDownloadButton';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import {
  Calendar,
  MapPin,
  Building2,
  Users,
  Trophy,
  ArrowRight,
  ExternalLink,
  Briefcase,
  Code2,
  Rocket,
  Target,
  TrendingUp,
  Award,
  type LucideIcon,
} from 'lucide-react';

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  duration: string;
  startDate: string;
  endDate: string | 'Present';
  type: 'Full-time' | 'Contract' | 'Part-time';
  logo?: string;
  companyUrl?: string;
  description: string;
  achievements: string[];
  technologies: string[];
  teamSize?: string;
  highlights?: {
    metric: string;
    value: string;
    icon?: LucideIcon;
  }[];
}

const experiences: Experience[] = [
  {
    id: 'safebooks',
    company: 'Safebooks AI',
    position: 'Senior Front-End Engineer',
    location: 'Remote',
    duration: 'Apr 2024 - Jul 2025',
    startDate: '2024-04',
    endDate: '2025-07',
    type: 'Full-time',
    companyUrl: 'https://safebooks.ai',
    description:
      'Architected real-time financial dashboards for an AI-powered accounting platform, delivering high-performance React applications with advanced data visualization for enterprise clients.',
    achievements: [
      'Architected Next.js/React financial governance platform processing 1M+ daily transactions, reducing manual data reconciliation by 40%.',
      'Engineered a real-time anomaly detection dashboard visualizing 50,000+ data points with sub-200ms render times.',
      'Built type-safe data pipelines using advanced TypeScript Generics, reducing runtime errors by 95% and saving ~15 QA hours per sprint.',
    ],
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Zustand',
      'Material-UI',
      'Jest',
      'Webpack',
    ],
    teamSize: '10+ people',
    highlights: [
      { metric: 'Load Time Reduction', value: '50%', icon: Rocket },
      { metric: 'Test Coverage', value: '85%', icon: Target },
      { metric: 'Enterprise Clients', value: '9', icon: Users },
      { metric: 'Lighthouse Score', value: '95+', icon: TrendingUp },
    ],
  },
  {
    id: 'emerline',
    company: 'Emerline',
    position: 'Senior Front-End Developer',
    location: 'Remote',
    duration: 'May 2021 - Jan 2024',
    startDate: '2021-05',
    endDate: '2024-01',
    type: 'Full-time',
    companyUrl: 'https://emerline.com',
    description:
      'Led front-end architecture for enterprise platforms, designing scalable component libraries and mentoring junior developers while delivering high-impact solutions for international clients.',
    achievements: [
      'Led front-end architecture for complex enterprise portals, delivering 3 major client apps under budget and increasing retention by 20%.',
      'Deployed a white-label React/Storybook component library adopted by 5 teams, cutting UI dev time by 30%.',
      'Streamlined Developer Experience workflows through custom tooling, reducing onboarding time by 50%.',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Redux',
      'JavaScript ES6+',
      'SASS',
      'Webpack',
      'Storybook',
    ],
    teamSize: '8-12 people',
    highlights: [
      { metric: 'Employees Served', value: '1K+', icon: Users },
      { metric: 'Dev Time Reduction', value: '40%', icon: TrendingUp },
      { metric: 'Core Web Vitals', value: '+35%', icon: Award },
    ],
  },
  {
    id: 'inango',
    company: 'Inango Systems',
    position: 'Middle Front-End Developer',
    location: 'Kyiv, Ukraine',
    duration: 'Mar 2019 - Apr 2021',
    startDate: '2019-03',
    endDate: '2021-04',
    type: 'Full-time',
    companyUrl: 'https://inango.com',
    description:
      'Enhanced ISP web platforms using React/Redux, delivering significant UX improvements for large customer bases while leading migration initiatives from legacy systems.',
    achievements: [
      'Developed real-time ISP network UIs monitoring 10,000+ nodes, improving client incident response by 35%.',
      'Migrated legacy portals to modern React/Redux architectures, eliminating frame drops and boosting Lighthouse scores to 92.',
      'Integrated front-end architectures with robust SQL/NoSQL backend systems, cutting client-side parsing overhead by 25%.',
    ],
    technologies: [
      'React.js',
      'Redux',
      'React Native',
      'JavaScript',
      'HTML5',
      'CSS3',
      'jQuery',
    ],
    teamSize: '6-8 people',
    highlights: [
      { metric: 'Customers Served', value: '50K+', icon: Users },
      { metric: 'Performance Boost', value: '40%', icon: Rocket },
      { metric: 'UX Improvement', value: '25%', icon: TrendingUp },
    ],
  },
  {
    id: 'helios',
    company: 'Helios Technologies',
    position: 'Junior Front-End Developer',
    location: 'Kyiv, Ukraine',
    duration: 'Jun 2018 - Feb 2019',
    startDate: '2018-06',
    endDate: '2019-02',
    type: 'Full-time',
    description:
      'Started professional development career creating responsive interfaces and implementing pixel-perfect designs for client projects, building a strong foundation in modern front-end technologies.',
    achievements: [
      'Developed responsive interfaces for 5 client projects, implementing pixel-perfect Figma designs.',
      'Built interactive components using JavaScript and React',
      'Collaborated with design team to ensure optimal user experience',
    ],
    technologies: [
      'JavaScript',
      'React',
      'HTML5',
      'CSS3',
      'Bootstrap',
      'Figma',
      'Git',
    ],
    teamSize: '5-7 people',
  },
];

export default function ExperiencePage() {
  const [selectedExperience, setSelectedExperience] = useState<string | null>(
    null
  );
  const [viewMode, setViewMode] = useState<'timeline' | 'cards'>('timeline');

  const totalYears = new Date().getFullYear() - 2018;
  const companiesCount = experiences.length;
  const projectsCompleted = 15; // You can calculate this dynamically

  const stats = [
    { label: 'Years Experience', value: `${totalYears}+`, icon: Calendar },
    { label: 'Companies', value: companiesCount.toString(), icon: Building2 },
    {
      label: 'Projects Completed',
      value: `${projectsCompleted}+`,
      icon: Briefcase,
    },
    { label: 'Technologies Used', value: '25+', icon: Code2 },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <>
      <BreadcrumbSchema page="experience" />
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <Container size="lg" className="relative z-10 text-center pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Experience
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional <span className="text-primary">Experience</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              {totalYears}+ years of crafting exceptional digital experiences,
              from startups to enterprise solutions
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <stat.icon
                    className="w-8 h-8 text-accent-mocha mx-auto mb-3"
                    aria-hidden="true"
                  />
                  <div className="text-3xl font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* View Mode Toggle */}
      <section className="py-8 border-b">
        <Container size="lg">
          <div className="flex justify-center gap-2">
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              onClick={() => setViewMode('timeline')}
              aria-pressed={viewMode === 'timeline'}
            >
              Timeline View
            </Button>
            <Button
              variant={viewMode === 'cards' ? 'default' : 'outline'}
              onClick={() => setViewMode('cards')}
              aria-pressed={viewMode === 'cards'}
            >
              Card View
            </Button>
          </div>
        </Container>
      </section>

      {/* Experience Timeline */}
      <section className="py-20">
        <Container size="lg">
          {viewMode === 'timeline' ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative"
            >
              {/* Timeline Line */}
              <div className="timeline-line absolute left-8 md:left-1/2 top-0 bottom-0 -translate-x-1/2" />

              {experiences.map((exp, index) => {
                const isLeft = index % 2 === 0;

                const CardContent = (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="timeline-card bg-card rounded-xl p-6 cursor-pointer"
                    role="button"
                    tabIndex={0}
                    aria-expanded={selectedExperience === exp.id}
                    aria-controls={`exp-details-${exp.id}`}
                    onClick={() =>
                      setSelectedExperience(
                        selectedExperience === exp.id ? null : exp.id
                      )
                    }
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedExperience(
                          selectedExperience === exp.id ? null : exp.id
                        );
                      }
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold mb-1">
                          {exp.position}
                        </h3>
                        <div
                          className={`flex items-center gap-2 mb-3 flex-wrap ${
                            isLeft ? 'md:justify-end' : ''
                          }`}
                        >
                          <span className="text-primary font-semibold">
                            {exp.company}
                          </span>
                          {exp.companyUrl && (
                            <a
                              href={exp.companyUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-primary"
                              aria-label={`Visit ${exp.company} website`}
                              onClick={e => e.stopPropagation()}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                        <div
                          className={`flex items-center gap-4 text-sm text-muted-foreground flex-wrap ${
                            isLeft ? 'md:justify-end' : ''
                          }`}
                        >
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {exp.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {exp.location}
                          </span>
                          <Badge variant="secondary">{exp.type}</Badge>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p
                      className={`mt-4 text-muted-foreground ${isLeft ? 'md:text-right' : ''}`}
                    >
                      {exp.description}
                    </p>

                    {/* Technologies */}
                    <div
                      className={`mt-4 flex gap-2 flex-wrap ${
                        isLeft ? 'md:justify-end' : ''
                      }`}
                    >
                      {exp.technologies.slice(0, 5).map(tech => (
                        <Badge key={tech} variant="outline">
                          {tech}
                        </Badge>
                      ))}
                      {exp.technologies.length > 5 && (
                        <Badge variant="outline">
                          +{exp.technologies.length - 5} more
                        </Badge>
                      )}
                    </div>

                    {/* Expanded Content */}
                    {selectedExperience === exp.id && (
                      <motion.div
                        id={`exp-details-${exp.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-6 pt-6 border-t"
                      >
                        {/* Highlights */}
                        {exp.highlights && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            {exp.highlights.map(highlight => (
                              <div
                                key={highlight.metric}
                                className="text-center"
                              >
                                {highlight.icon && (
                                  <highlight.icon className="w-6 h-6 text-primary mx-auto mb-2" />
                                )}
                                <div className="text-xl font-bold">
                                  {highlight.value}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {highlight.metric}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Achievements */}
                        <div>
                          <h4
                            className={`font-semibold mb-3 flex items-center gap-2 ${isLeft ? 'md:justify-end' : ''}`}
                          >
                            <Trophy className="w-5 h-5 text-primary" />
                            Key Achievements
                          </h4>
                          <ul className="space-y-2">
                            {exp.achievements.map((achievement, i) => (
                              <li
                                key={i}
                                className={`flex items-start gap-2 ${isLeft ? 'md:flex-row-reverse md:text-right' : ''}`}
                              >
                                <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-muted-foreground">
                                  {achievement}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Team Size */}
                        {exp.teamSize && (
                          <div
                            className={`mt-4 flex items-center gap-2 text-sm text-muted-foreground ${isLeft ? 'md:justify-end' : ''}`}
                          >
                            <Users className="w-4 h-4" />
                            Team size: {exp.teamSize}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                );

                return (
                  <motion.div
                    key={exp.id}
                    variants={itemVariants}
                    className="relative mb-16"
                  >
                    {/* Mobile Layout */}
                    <div className="md:hidden pl-20">{CardContent}</div>

                    {/* Desktop Layout - CSS Grid for precise alignment */}
                    <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-0">
                      {/* Left Column */}
                      <div className={isLeft ? 'pr-12 text-right' : ''}>
                        {isLeft && CardContent}
                      </div>

                      {/* Center Column - Icon */}
                      <div className="timeline-icon w-10 h-10 rounded-full flex items-center justify-center z-10 mx-auto">
                        <Briefcase className="w-4 h-4" />
                      </div>

                      {/* Right Column */}
                      <div className={!isLeft ? 'pl-12' : ''}>
                        {!isLeft && CardContent}
                      </div>
                    </div>

                    {/* Mobile Icon */}
                    <div className="md:hidden timeline-icon absolute left-8 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10">
                      <Briefcase className="w-4 h-4" />
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            /* Card View */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {experiences.map(exp => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="timeline-card bg-card rounded-xl p-8"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">
                        {exp.position}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-semibold">
                          {exp.company}
                        </span>
                        {exp.companyUrl && (
                          <a
                            href={exp.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary"
                            aria-label={`Visit ${exp.company} website`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                    <Badge variant="secondary">{exp.type}</Badge>
                  </div>

                  {/* Meta Info */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {exp.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {exp.location}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground mb-6">
                    {exp.description}
                  </p>

                  {/* Highlights */}
                  {exp.highlights && (
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {exp.highlights.slice(0, 2).map(highlight => (
                        <div
                          key={highlight.metric}
                          className="bg-background rounded-lg p-3 text-center"
                        >
                          <div className="text-xl font-bold text-primary">
                            {highlight.value}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {highlight.metric}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Technologies */}
                  <div className="flex gap-2 flex-wrap">
                    {exp.technologies.slice(0, 6).map(tech => (
                      <Badge key={tech} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                    {exp.technologies.length > 6 && (
                      <Badge variant="outline">
                        +{exp.technologies.length - 6}
                      </Badge>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-muted/30">
        <Container size="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Work Together?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let&apos;s discuss how I can contribute to your team&apos;s
              success
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="/contact">Get In Touch</a>
              </Button>
              <ResumeDownloadButton size="lg" variant="outline" />
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
