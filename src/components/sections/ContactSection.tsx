'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ResumeDownloadButton } from '@/components/ui/ResumeDownloadButton';
import { ContactForm } from './ContactForm';
import { ContactInfo } from './ContactInfo';
import { FAQ } from './FAQ';
import { SocialLinks } from './SocialLinks';
import { AvailabilityStatus } from './AvailabilityStatus';
import {
  Mail,
  MessageSquare,
  Sparkles,
  Send,
  Calendar,
  Clock,
  Phone,
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

export function ContactSection() {
  const sectionRef = React.useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const preferredMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Best for project inquiries',
      value: 'oles.didukh@gmail.com',
      action: 'mailto:oles.didukh@gmail.com',
      color: 'from-mocha-500 to-mocha-600',
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'For urgent matters',
      value: '+38 067 88 99 570',
      action: 'tel:+380678899570',
      color: 'from-navy-500 to-navy-600',
    },
    {
      icon: MessageSquare,
      title: 'LinkedIn',
      description: 'Professional networking',
      value: '@oles-didukh',
      action: 'https://linkedin.com/in/oles-didukh',
      color: 'from-info-500 to-info-600',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden"
      id="contact"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-10 w-96 h-96 bg-mocha-200/20 dark:bg-mocha-800/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-72 h-72 bg-navy-200/20 dark:bg-navy-800/20 rounded-full blur-3xl" />
      </div>

      <Container size="lg" padding="lg">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="space-y-16"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <Badge variant="outline" className="mb-4">
              <MessageSquare className="mr-2 h-3 w-3" />
              Contact
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Let&apos;s Build Something{' '}
              <span className="bg-gradient-to-r from-mocha-500 to-accent-green bg-clip-text text-transparent">
                Amazing Together
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              I&apos;m currently available for freelance projects and full-time
              opportunities. Whether you have a project in mind or just want to
              chat about possibilities, I&apos;d love to hear from you.
            </p>
          </motion.div>

          {/* Availability Status */}
          <motion.div variants={itemVariants}>
            <AvailabilityStatus />
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Contact Form - Left Side */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-3 space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5" />
                    Send Me a Message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactForm />
                </CardContent>
              </Card>

              {/* Preferred Contact Methods - Horizontal Cards */}
              <div className="space-y-4">
                {preferredMethods.map((method, index) => {
                  const Icon = method.icon;
                  const isExternal = method.action.startsWith('http');

                  return (
                    <motion.a
                      key={method.title}
                      href={method.action}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: 0.2 + index * 0.1,
                        type: 'spring',
                        stiffness: 100,
                      }}
                      whileHover={{ scale: 1.02, x: 8 }}
                      whileTap={{ scale: 0.98 }}
                      className="group block"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card to-card/80 p-5 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:border-primary/30">
                        {/* Animated gradient background */}
                        <div
                          className={`absolute inset-0 bg-gradient-to-r ${method.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                        />

                        {/* Shine effect on hover */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                        </div>

                        {/* Content */}
                        <div className="relative flex items-center gap-5">
                          {/* Icon Container */}
                          <div
                            className={`relative shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} p-4 text-white shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-xl`}
                          >
                            <Icon className="w-full h-full drop-shadow-sm" />
                            {/* Icon glow */}
                            <div
                              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${method.color} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500 -z-10`}
                            />
                          </div>

                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            {/* Title & Description Row */}
                            <div className="flex items-baseline gap-3 mb-1">
                              <h4 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
                                {method.title}
                              </h4>
                              <span className="text-xs text-muted-foreground font-medium px-2 py-0.5 rounded-full bg-muted/50">
                                {method.description}
                              </span>
                            </div>

                            {/* Contact Value - Hero */}
                            <p className="text-xl font-semibold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:to-primary/70 transition-all duration-300">
                              {method.value}
                            </p>
                          </div>

                          {/* Arrow indicator */}
                          <div className="shrink-0 w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:bg-primary/10">
                            <svg
                              className="w-5 h-5 text-primary transform group-hover:translate-x-1 transition-transform duration-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </motion.div>

            {/* Contact Info & Social - Right Side */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 space-y-6"
            >
              {/* Contact Information */}
              <ContactInfo />

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Connect With Me</CardTitle>
                </CardHeader>
                <CardContent>
                  <SocialLinks />
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-gradient-to-br from-mocha-50 to-navy-50 dark:from-mocha-900/20 dark:to-navy-900/20 border-mocha-200 dark:border-mocha-800">
                <CardContent className="pt-6">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Quick Actions
                  </h4>
                  <div className="space-y-3">
                    <ResumeDownloadButton
                      className="w-full"
                      variant="outline"
                      showIcon={false}
                    >
                      Download My Resume
                    </ResumeDownloadButton>
                    <Button className="w-full" variant="outline" asChild>
                      <Link href="/projects">View My Projects</Link>
                    </Button>
                    <Button className="w-full" variant="outline" asChild>
                      <a
                        href="https://calendly.com/oles-didukh"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Schedule a Call
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* FAQ Section */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h3>
            <FAQ />
          </motion.div>

          {/* Response Time Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-r from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 border-success-200 dark:border-success-800">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Average Response Time
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      I typically respond to inquiries within 24 hours during
                      business days
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                      &lt; 24h
                    </div>
                    <p className="text-xs text-muted-foreground">Mon-Fri</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            variants={itemVariants}
            className="text-center space-y-4 pt-8"
          >
            <h3 className="text-2xl font-semibold">
              Ready to Start Your Project?
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              I&apos;m excited to learn about your vision and explore how we can
              work together to create something exceptional. Every great project
              starts with a conversation.
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" asChild>
                <a href="mailto:oles.didukh@gmail.com">
                  <Mail className="mr-2 h-4 w-4" />
                  Start the Conversation
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
