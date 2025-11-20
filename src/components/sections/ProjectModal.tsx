'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/data/projects';
import {
  X,
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Users,
  ChevronLeft,
  ChevronRight,
  Quote,
  Target,
  Lightbulb,
  TrendingUp,
  Award,
} from 'lucide-react';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const modalRef = React.useRef<HTMLDivElement>(null);

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Prevent body scroll when modal is open
  // Prevent body scroll when modal is open and handle layout shift
  React.useEffect(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.paddingRight = '0px';
    };
  }, []);

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      prev => (prev - 1 + project.images.length) % project.images.length
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.5 }}
        className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-card/95 backdrop-blur-xl rounded-xl shadow-2xl border border-border/50"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-muted transition-colors"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Image Gallery */}
        <div className="relative h-72 md:h-96 bg-muted overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.img
              key={currentImageIndex}
              src={project.images[currentImageIndex]}
              alt={`${project.title} screenshot ${currentImageIndex + 1}`}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full object-cover"
            />
          </AnimatePresence>

          {/* Gallery Navigation */}
          {project.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {project.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Featured Badge */}
          {project.featured && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
              <Award className="h-4 w-4" />
              Featured Project
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold">{project.title}</h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                  <Badge variant="outline">{project.category}</Badge>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {project.year}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {project.duration}
                  </span>
                  {project.team && (
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {project.team}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                {project.liveUrl && (
                  <Button
                    variant="default"
                    onClick={() => window.open(project.liveUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(project.githubUrl, '_blank')}
                  >
                    <Github className="mr-2 h-4 w-4" />
                    Source Code
                  </Button>
                )}
                {project.demoUrl && (
                  <Button
                    variant="outline"
                    onClick={() => window.open(project.demoUrl, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Demo
                  </Button>
                )}
              </div>
            </div>

            <p className="text-lg text-muted-foreground">
              {project.longDescription}
            </p>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Role & Technologies */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">My Role</h3>
                <p className="text-muted-foreground">{project.role}</p>
                {project.client && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Client: {project.client}
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">
                  Technologies Used
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map(tech => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Results */}
            {project.results && project.results.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-success-600" />
                  Key Results
                </h3>
                <div className="space-y-3">
                  {project.results.map((result, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                        {result.value}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {result.metric}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Challenges & Solutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Challenges */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Target className="h-5 w-5 text-warning-600" />
                Challenges
              </h3>
              <ul className="space-y-2">
                {project.challenges.map((challenge, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-warning-500 mt-1.5 shrink-0" />
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-info-600" />
                Solutions
              </h3>
              <ul className="space-y-2">
                {project.solutions.map((solution, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-info-500 mt-1.5 shrink-0" />
                    <span>{solution}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Testimonial */}
          {project.testimonial && (
            <div className="relative p-6 bg-gradient-to-br from-mocha-50 to-navy-50 dark:from-mocha-900/20 dark:to-navy-900/20 rounded-xl">
              <Quote className="absolute top-4 left-4 h-8 w-8 text-mocha-300 dark:text-mocha-700" />
              <blockquote className="relative z-10 space-y-3">
                <p className="text-lg italic pl-8">
                  &ldquo;{project.testimonial.text}&rdquo;
                </p>
                <footer className="text-sm text-muted-foreground pl-8">
                  <strong>{project.testimonial.author}</strong>
                  <span className="mx-2">·</span>
                  <span>{project.testimonial.role}</span>
                </footer>
              </blockquote>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
