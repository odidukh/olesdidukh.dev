'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { LinkCard, type IconBoxGradient } from '@/components/ui/LinkCard';
import { ResumeDownloadButton } from '@/components/ui/ResumeDownloadButton';
import {
  decodeEmail,
  decodeString,
  ENCODED_EMAIL,
  ENCODED_PHONE,
  ENCODED_PHONE_DISPLAY,
} from '@/lib/obfuscate';
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
  type LucideIcon,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Contact method configuration for the LinkCard components
 */
interface ContactMethod {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  href: string;
  gradient: IconBoxGradient;
}

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
  const isInView = useInView(sectionRef, { once: true, amount: 0.05 });
  const [email, setEmail] = React.useState<string | null>(null);
  const [phone, setPhone] = React.useState<string | null>(null);
  const [phoneDisplay, setPhoneDisplay] = React.useState<string | null>(null);

  React.useEffect(() => {
    // Decode contact info only on client side
    setEmail(decodeEmail(ENCODED_EMAIL));
    setPhone(decodeString(ENCODED_PHONE));
    setPhoneDisplay(decodeString(ENCODED_PHONE_DISPLAY));
  }, []);

  // Build contact methods with obfuscated values
  const preferredMethods: ContactMethod[] = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Best for project inquiries',
      value: email || 'Loading...',
      href: email ? `mailto:${email}` : '#',
      gradient: 'mocha',
    },
    {
      icon: Phone,
      title: 'Phone',
      description: 'For urgent matters',
      value: phoneDisplay || 'Loading...',
      href: phone ? `tel:${phone}` : '#',
      gradient: 'navy',
    },
    {
      icon: MessageSquare,
      title: 'LinkedIn',
      description: 'Professional networking',
      value: '@oles-didukh',
      href: 'https://linkedin.com/in/oles-didukh',
      gradient: 'info',
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-28 relative overflow-hidden bg-muted/30 dark:bg-muted/10"
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
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">
                Contact
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Let&apos;s Build Something{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-mocha-400">
                Amazing Together
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
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

              {/* Preferred Contact Methods - Using LinkCard atomic component */}
              <div className="space-y-3">
                {preferredMethods.map((method, index) => (
                  <LinkCard
                    key={method.title}
                    icon={method.icon}
                    title={method.title}
                    description={`${method.description}`}
                    value={method.value}
                    href={method.href}
                    gradient={method.gradient}
                    animate={isInView}
                    animationDelay={0.2 + index * 0.1}
                  />
                ))}
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
        </motion.div>
      </Container>
    </section>
  );
}
