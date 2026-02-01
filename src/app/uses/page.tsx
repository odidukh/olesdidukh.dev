'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import {
  Code2,
  Palette,
  Globe,
  Laptop,
  Package,
  Wrench,
  Cloud,
  type LucideIcon,
} from 'lucide-react';

interface UsesItem {
  name: string;
  description: string;
  link?: string;
}

interface UsesCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  items: UsesItem[];
}

const usesCategories: UsesCategory[] = [
  {
    id: 'hardware',
    title: 'Hardware',
    description: 'The physical tools I use daily',
    icon: Laptop,
    items: [
      {
        name: 'Macbook Air 15" 2023',
        description:
          'A lightweight and powerful companion for on-the-go development and daily tasks.',
      },
      {
        name: 'Mac Mini Pro 2025',
        description:
          'The central powerhouse of my setup, handling heavy workloads and complex builds with ease.',
      },
      {
        name: 'Monitor iiyama 32" 4K',
        description:
          'Providing massive screen real estate and crystal-clear 4K resolution for multitasking.',
      },
      {
        name: 'Logitech Ergo K860',
        description:
          'An ergonomic split keyboard that ensures comfort during long coding sessions.',
      },
      {
        name: 'Magic Trackpad 3',
        description:
          'For precise control and smooth macOS gestures that enhance my workflow.',
      },
      {
        name: 'AirPods Pro 2',
        description:
          'Superior noise cancellation and seamless integration for focused work and calls.',
      },
      {
        name: 'Airpulse A80',
        description:
          'High-fidelity active speakers that deliver exceptional audio quality for music and media.',
      },
    ],
  },
  {
    id: 'development',
    title: 'Development Environment',
    description: 'Tools for writing and debugging code',
    icon: Code2,
    items: [
      {
        name: 'VS Code',
        description:
          'Primary code editor. Fast, extensible, and has the best TypeScript support. Using a minimal set of carefully chosen extensions.',
        link: 'https://code.visualstudio.com',
      },
      {
        name: 'Cursor',
        description:
          'AI-powered code editor built on VS Code. Great for AI-assisted development and code generation.',
        link: 'https://cursor.com',
      },
      {
        name: 'iTerm2 + Oh My Zsh',
        description:
          'Terminal setup with custom theme, syntax highlighting, and useful aliases. Fish-shell-like autosuggestions.',
        link: 'https://iterm2.com',
      },
      {
        name: 'GitHub Copilot',
        description:
          'AI pair programmer that helps with boilerplate and suggests context-aware completions.',
        link: 'https://github.com/features/copilot',
      },
      {
        name: 'Chrome DevTools',
        description:
          'Essential for debugging, performance profiling, and testing responsive designs.',
      },
    ],
  },
  {
    id: 'vs-code-extensions',
    title: 'VS Code Extensions',
    description: 'Must-have extensions for productivity',
    icon: Package,
    items: [
      {
        name: 'ESLint + Prettier',
        description:
          'Code linting and formatting. Format on save keeps code consistent across the team.',
      },
      {
        name: 'TypeScript Importer',
        description: 'Automatically adds import statements as you type.',
      },
      {
        name: 'GitLens',
        description:
          'Git blame annotations, file history, and powerful diff views.',
        link: 'https://gitlens.amod.io',
      },
      {
        name: 'Error Lens',
        description:
          'Inline error and warning highlights. See issues without hovering.',
      },
      {
        name: 'Tailwind CSS IntelliSense',
        description:
          'Autocomplete for Tailwind classes with preview of applied styles.',
      },
      {
        name: 'One Dark Pro',
        description:
          "Color theme based on Atom's One Dark. Easy on the eyes for long coding sessions.",
      },
    ],
  },
  {
    id: 'design',
    title: 'Design & Assets',
    description: 'Tools for creating and working with designs',
    icon: Palette,
    items: [
      {
        name: 'Figma',
        description:
          'Primary design tool for UI work. Great for design handoffs and collaboration with designers.',
        link: 'https://figma.com',
      },
      {
        name: 'Excalidraw',
        description:
          'Whiteboard for quick diagrams, architecture sketches, and brainstorming.',
        link: 'https://excalidraw.com',
      },
      {
        name: 'ImageOptim',
        description:
          'Image compression for web assets. Reduces file sizes without visible quality loss.',
        link: 'https://imageoptim.com',
      },
      {
        name: 'Lucide Icons',
        description:
          'Beautiful, consistent icon set used throughout this website.',
        link: 'https://lucide.dev',
      },
    ],
  },
  {
    id: 'productivity',
    title: 'Productivity Apps',
    description: 'Apps for staying organized and focused',
    icon: Wrench,
    items: [
      {
        name: 'Raycast',
        description:
          'Spotlight replacement with snippets, clipboard history, and custom scripts.',
        link: 'https://raycast.com',
      },
      {
        name: 'Arc Browser',
        description:
          'Modern browser with workspaces and vertical tabs. Changed how I organize web apps.',
        link: 'https://arc.net',
      },
      {
        name: 'Notion',
        description:
          'Knowledge base, project planning, and documentation. Second brain for everything.',
        link: 'https://notion.so',
      },
      {
        name: 'Slack',
        description:
          'Team communication. Integrated with GitHub for PR notifications.',
        link: 'https://slack.com',
      },
      {
        name: '1Password',
        description:
          'Password manager with developer features like SSH key management.',
        link: 'https://1password.com',
      },
    ],
  },
  {
    id: 'this-website',
    title: 'This Website',
    description: 'Technologies powering olesdidukh.dev',
    icon: Globe,
    items: [
      {
        name: 'Next.js 16',
        description:
          'React framework with App Router, Server Components, and excellent performance.',
        link: 'https://nextjs.org',
      },
      {
        name: 'React 19',
        description:
          'Latest React with React Compiler for automatic optimization.',
        link: 'https://react.dev',
      },
      {
        name: 'TypeScript',
        description: 'Full type safety with strict mode enabled.',
        link: 'https://typescriptlang.org',
      },
      {
        name: 'Tailwind CSS v4',
        description:
          'Utility-first CSS with design tokens. Lightning-fast development.',
        link: 'https://tailwindcss.com',
      },
      {
        name: 'Framer Motion',
        description: 'Smooth animations and page transitions.',
        link: 'https://framer.com/motion',
      },
      {
        name: 'Three.js',
        description: '3D graphics for the interactive hero section background.',
        link: 'https://threejs.org',
      },
      {
        name: 'Vercel',
        description:
          'Deployment platform with edge functions and analytics built-in.',
        link: 'https://vercel.com',
      },
      {
        name: 'Supabase',
        description:
          'PostgreSQL database and authentication for the admin panel.',
        link: 'https://supabase.com',
      },
    ],
  },
  {
    id: 'services',
    title: 'Services & APIs',
    description: 'Third-party services integrated into projects',
    icon: Cloud,
    items: [
      {
        name: 'GitHub',
        description: 'Version control and collaboration. Actions for CI/CD.',
        link: 'https://github.com',
      },
      {
        name: 'Vercel Analytics',
        description:
          'Privacy-friendly web analytics with Core Web Vitals tracking.',
        link: 'https://vercel.com/analytics',
      },
      {
        name: 'Sentry',
        description: 'Error tracking and performance monitoring in production.',
        link: 'https://sentry.io',
      },
      {
        name: 'Resend',
        description: 'Email API for contact form submissions.',
        link: 'https://resend.com',
      },
      {
        name: 'Upstash Redis',
        description: 'Serverless Redis for rate limiting and caching.',
        link: 'https://upstash.com',
      },
    ],
  },
];

export default function UsesPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" className="min-h-screen pt-24 pb-16">
        <Container size="wide" padding="lg">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <Badge variant="outline" className="mb-4">
              <Wrench className="mr-2 h-3 w-3" />
              Developer Setup
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Uses{' '}
              <span className="bg-gradient-to-r from-mocha-500 to-accent-green bg-clip-text text-transparent">
                & Stack
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl">
              A comprehensive look at the tools, technologies, and services I
              use for software development. Inspired by{' '}
              <a
                href="https://uses.tech"
                target="_blank"
                rel="noopener noreferrer"
                className="text-mocha-600 dark:text-mocha-400 hover:underline"
              >
                uses.tech
              </a>
              .
            </p>
          </motion.div>

          {/* Categories */}
          <div className="space-y-16">
            {usesCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <motion.section
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
                  id={category.id}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-lg bg-mocha-100 dark:bg-mocha-900/30">
                      <Icon className="h-5 w-5 text-mocha-600 dark:text-mocha-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.title}</h2>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item, itemIndex) => (
                      <motion.div
                        key={item.name}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.3,
                          delay: categoryIndex * 0.1 + itemIndex * 0.05,
                        }}
                        className="group p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold group-hover:text-mocha-600 dark:group-hover:text-mocha-400 transition-colors">
                            {item.name}
                          </h3>
                          {item.link && (
                            <a
                              href={item.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted-foreground hover:text-foreground transition-colors"
                              aria-label={`Visit ${item.name} website`}
                            >
                              <Globe className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              );
            })}
          </div>

          {/* Footer note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mt-16 p-6 rounded-xl border bg-muted/30 text-center"
          >
            <p className="text-muted-foreground">
              This page is regularly updated as my workflow evolves. Last
              updated:{' '}
              <span className="font-medium text-foreground">December 2025</span>
            </p>
          </motion.div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
