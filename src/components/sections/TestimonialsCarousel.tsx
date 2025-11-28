'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { getTestimonials, type TestimonialWithProject } from '@/data/projects';

function TestimonialCard({
  testimonial,
  isActive,
}: {
  testimonial: TestimonialWithProject;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isActive ? 1 : 0, scale: isActive ? 1 : 0.95 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4, ease: 'easeInOut' }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="relative w-full max-w-3xl mx-auto px-4">
        <Quote className="absolute -top-4 -left-2 w-12 h-12 text-mocha-200 dark:text-mocha-800 opacity-50" />
        <blockquote className="relative z-10">
          <p className="text-lg md:text-xl lg:text-2xl text-foreground/90 leading-relaxed mb-6 text-center italic">
            &ldquo;{testimonial.text}&rdquo;
          </p>
          <footer className="text-center">
            <cite className="not-italic">
              <span className="block text-lg font-semibold text-foreground">
                {testimonial.author}
              </span>
              <span className="block text-sm text-muted-foreground mt-1">
                {testimonial.role}
              </span>
              <Link
                href={`/projects/${testimonial.projectId}`}
                className="inline-block text-sm text-mocha-600 dark:text-mocha-400 hover:text-mocha-700 dark:hover:text-mocha-300 mt-2 underline-offset-4 hover:underline transition-colors"
              >
                View Project: {testimonial.projectTitle}
              </Link>
            </cite>
          </footer>
        </blockquote>
      </div>
    </motion.div>
  );
}

function CarouselDots({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {Array.from({ length: total }).map((_, index) => (
        <button
          key={index}
          onClick={() => onSelect(index)}
          className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
            index === current
              ? 'bg-mocha-500 dark:bg-mocha-400 w-8'
              : 'bg-mocha-200 dark:bg-mocha-700 hover:bg-mocha-300 dark:hover:bg-mocha-600'
          }`}
          aria-label={`Go to testimonial ${index + 1}`}
          aria-current={index === current ? 'true' : 'false'}
        />
      ))}
    </div>
  );
}

export function TestimonialsCarousel() {
  const testimonials = getTestimonials();
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);

  const goToNext = React.useCallback(() => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const goToPrevious = React.useCallback(() => {
    setCurrentIndex(
      prev => (prev - 1 + testimonials.length) % testimonials.length
    );
  }, [testimonials.length]);

  const goToIndex = React.useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Auto-advance carousel
  React.useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(goToNext, 6000);
    return () => clearInterval(timer);
  }, [goToNext, isPaused]);

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevious();
      } else if (e.key === 'ArrowRight') {
        goToNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrevious]);

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section
      className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30"
      aria-label="Client Testimonials"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <Container>
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-block px-4 py-1.5 rounded-full bg-mocha-100 dark:bg-mocha-900/50 text-mocha-700 dark:text-mocha-300 text-sm font-medium mb-4"
          >
            Testimonials
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            What Clients Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-muted-foreground max-w-2xl mx-auto"
          >
            Feedback from the teams and leaders I&apos;ve worked with
          </motion.p>
        </div>

        <div className="relative">
          {/* Navigation buttons */}
          <Button
            variant="ghost"
            size="icon"
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 hidden md:flex"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </Button>

          {/* Carousel content */}
          <div
            className="relative min-h-[280px] md:min-h-[240px] overflow-hidden"
            role="region"
            aria-roledescription="carousel"
            aria-label="Client testimonials"
          >
            <AnimatePresence mode="wait">
              {testimonials.map(
                (testimonial, index) =>
                  index === currentIndex && (
                    <TestimonialCard
                      key={testimonial.projectId}
                      testimonial={testimonial}
                      isActive={index === currentIndex}
                    />
                  )
              )}
            </AnimatePresence>
          </div>

          {/* Dots navigation */}
          <CarouselDots
            total={testimonials.length}
            current={currentIndex}
            onSelect={goToIndex}
          />

          {/* Mobile swipe hint */}
          <p className="text-center text-xs text-muted-foreground mt-4 md:hidden">
            Swipe or tap dots to navigate
          </p>
        </div>
      </Container>
    </section>
  );
}
