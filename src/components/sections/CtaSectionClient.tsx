'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  ExternalLink,
  GitBranch,
  Star,
  Globe,
  Award,
} from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function CtaSectionClient() {
  return (
    <section className="py-20 bg-gradient-to-t from-primary/10 via-background to-background">
      <Container size="md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-success-500/10 rounded-full mb-6">
            <div className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-success-500">
              Open to opportunities
            </span>
          </div>

          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Build Something
            <span className="text-primary"> Amazing?</span>
          </h2>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let&apos;s collaborate on your next project and create exceptional
            experiences together
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
              <Star className="w-4 h-4 text-warning-500" />
              <span>5.0 Client Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-navy-500" />
              <span>International Clients</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-success-500" />
              <span>100% Project Success</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
