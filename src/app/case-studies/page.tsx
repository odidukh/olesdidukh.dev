'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  ArrowRight,
  Clock,
  Users,
  Target,
  TrendingUp,
  Quote,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { getFeaturedProjects, type Project } from '@/data/projects';

function CaseStudyCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="mb-24 last:mb-0"
    >
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center ${
          isEven ? '' : 'lg:flex-row-reverse'
        }`}
      >
        {/* Image/Visual Section */}
        <div className={`${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
          <div className="relative">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-mocha-100 to-mocha-200 dark:from-navy-800 dark:to-navy-900 overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-8">
                  <Briefcase className="w-16 h-16 text-mocha-400 dark:text-mocha-500 mx-auto mb-4" />
                  <p className="text-lg font-medium text-mocha-600 dark:text-mocha-400">
                    {project.title}
                  </p>
                </div>
              </div>
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-gradient-to-br from-mocha-200/50 to-mocha-100/50 dark:from-navy-700/50 dark:to-navy-800/50 rounded-xl -z-10" />
          </div>
        </div>

        {/* Content Section */}
        <div className={`${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
          {/* Category & Year */}
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="default">{project.category}</Badge>
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {project.year}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold mb-4">{project.title}</h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-6">
            {project.longDescription}
          </p>

          {/* Meta Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{project.duration}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Briefcase className="w-4 h-4 text-primary" />
              <span className="text-muted-foreground">{project.role}</span>
            </div>
            {project.team && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">{project.team}</span>
              </div>
            )}
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.slice(0, 6).map(tech => (
              <Badge key={tech} variant="outline" size="sm">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 6 && (
              <Badge variant="outline" size="sm">
                +{project.technologies.length - 6} more
              </Badge>
            )}
          </div>

          {/* Results */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {project.results.slice(0, 3).map((result, i) => (
              <div key={i} className="text-center p-3 rounded-lg bg-muted/50">
                <div className="text-lg font-bold text-primary">
                  {result.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {result.metric}
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Button asChild>
            <Link href={`/projects/${project.id}`}>
              View Full Case Study
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Challenges, Solutions & Testimonial Section */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Challenges */}
        <Card className="bg-error-50/50 dark:bg-error-900/20 border-error-200 dark:border-error-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-5 h-5 text-error-600 dark:text-error-400" />
              <h3 className="font-semibold text-error-700 dark:text-error-300">
                Challenges
              </h3>
            </div>
            <ul className="space-y-2">
              {project.challenges.map((challenge, i) => (
                <li
                  key={i}
                  className="text-sm text-error-600 dark:text-error-400 flex items-start gap-2"
                >
                  <span className="text-error-400 dark:text-error-500 mt-1">
                    •
                  </span>
                  {challenge}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Solutions */}
        <Card className="bg-success-50/50 dark:bg-success-900/20 border-success-200 dark:border-success-800">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-success-600 dark:text-success-400" />
              <h3 className="font-semibold text-success-700 dark:text-success-300">
                Solutions
              </h3>
            </div>
            <ul className="space-y-2">
              {project.solutions.map((solution, i) => (
                <li
                  key={i}
                  className="text-sm text-success-600 dark:text-success-400 flex items-start gap-2"
                >
                  <span className="text-success-400 dark:text-success-500 mt-1">
                    ✓
                  </span>
                  {solution}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Testimonial */}
        {project.testimonial && (
          <Card className="bg-primary/5 dark:bg-primary/10 border-primary/20">
            <CardContent className="pt-6">
              <Quote className="w-8 h-8 text-primary/40 mb-3" />
              <blockquote className="text-sm text-muted-foreground italic mb-4">
                &quot;{project.testimonial.text}&quot;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary">
                    {project.testimonial.author
                      .split(' ')
                      .map(n => n[0])
                      .join('')}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {project.testimonial.author}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {project.testimonial.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </motion.div>
  );
}

export default function CaseStudiesPage() {
  const featuredProjects = getFeaturedProjects();

  const stats = [
    { value: '50+', label: 'Projects Completed' },
    { value: '7+', label: 'Years Experience' },
    { value: '30+', label: 'Happy Clients' },
    { value: '99%', label: 'Client Satisfaction' },
  ];

  return (
    <>
      <Navigation />
      <main id="main-content" className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-muted/50 to-background">
          <Container size="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto"
            >
              <Badge variant="secondary" className="mb-4">
                Case Studies
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Real Projects,{' '}
                <span className="text-primary">Real Results</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Dive deep into my most impactful projects. Learn about the
                challenges faced, solutions implemented, and measurable outcomes
                achieved for each client.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl font-bold text-primary mb-1">
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

        {/* Case Studies Section */}
        <section className="py-20">
          <Container size="lg">
            {featuredProjects.map((project, index) => (
              <CaseStudyCard key={project.id} project={project} index={index} />
            ))}
          </Container>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-muted/30">
          <Container size="md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h2 className="text-3xl font-bold mb-4">
                Have a Project in Mind?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                I&apos;m always excited to work on challenging projects.
                Let&apos;s discuss how I can help bring your vision to life with
                the same level of dedication shown in these case studies.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/contact">Start a Conversation</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/projects">View All Projects</Link>
                </Button>
              </div>
            </motion.div>
          </Container>
        </section>
      </main>
      <Footer />
    </>
  );
}
