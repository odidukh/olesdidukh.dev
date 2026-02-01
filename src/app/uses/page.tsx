'use client';

import { motion } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { Button } from '@/components/ui/Button';
import {
  Code2,
  Palette,
  Globe,
  Laptop,
  Package,
  Wrench,
  Cloud,
  Download,
  ExternalLink,
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
  /** Optional download link for the entire category */
  download?: {
    label: string;
    href: string;
    filename: string;
    /** Installation instructions shown below the download button */
    instructions?: string[];
  };
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
        link: 'https://www.apple.com/macbook-air/',
      },
      {
        name: 'Mac Mini Pro 2025',
        description:
          'The central powerhouse of my setup, handling heavy workloads and complex builds with ease.',
        link: 'https://www.apple.com/mac-mini/',
      },
      {
        name: 'Monitor iiyama 32" 4K IPS',
        description:
          'Providing massive screen real estate and crystal-clear 4K resolution for multitasking.',
        link: 'https://iiyama.com/gl_en/products/prolite-xub3293uhsn-b5/',
      },
      {
        name: 'Logitech Ergo K860',
        description:
          'An ergonomic split keyboard that ensures comfort during long coding sessions.',
        link: 'https://www.logitech.com/products/keyboards/k860-split-ergonomic.html',
      },
      {
        name: 'Magic Trackpad 3',
        description:
          'For precise control and smooth macOS gestures that enhance my workflow.',
        link: 'https://www.apple.com/shop/product/mxka3am/a/magic-trackpad-usb%E2%80%91c-black-multi-touch-surface',
      },
      {
        name: 'AirPods Pro 2',
        description:
          'Superior noise cancellation and seamless integration for focused work and calls.',
        link: 'https://www.apple.com/airpods-pro/',
      },
      {
        name: 'Airpulse A80',
        description:
          'High-fidelity active speakers that deliver exceptional audio quality for music and media.',
        link: 'https://airpulse.com/collections/airpulse-speakers/products/airpulse-a80-hi-res-active-speaker-system',
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
        name: 'Claude Code',
        description:
          'Agentic coding tool from Anthropic. Handles complex multi-file refactoring and understands entire codebases.',
        link: 'https://claude.ai/code',
      },
      {
        name: 'Gemini',
        description:
          "Google's multimodal AI assistant for research, code review, and problem-solving.",
        link: 'https://gemini.google.com',
      },
      {
        name: 'NotebookLM',
        description:
          "Google's AI-powered research assistant. Great for analyzing documentation and generating insights.",
        link: 'https://notebooklm.google.com',
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
    download: {
      label: 'Download Extensions Pack',
      href: '/downloads/vscode-extensions.sh',
      filename: 'vscode-extensions.sh',
      instructions: [
        '1. Download the script and open Terminal',
        '2. Navigate to the download folder: `cd ~/Downloads`',
        '3. Make it executable: `chmod +x vscode-extensions.sh`',
        '4. Run the script: `./vscode-extensions.sh`',
        '5. Restart VS Code to activate all extensions',
      ],
    },
    items: [
      {
        name: 'ESLint + Prettier',
        description:
          'Code linting and formatting. Format on save keeps code consistent across the team.',
      },
      {
        name: 'Tailwind CSS IntelliSense',
        description:
          'Autocomplete for Tailwind classes. Configured with custom regex for cn() and cva() utilities.',
        link: 'https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss',
      },
      {
        name: 'Pretty TypeScript Errors',
        description:
          'Makes TypeScript errors human-readable with syntax highlighting and better formatting.',
        link: 'https://marketplace.visualstudio.com/items?itemName=yoavbls.pretty-ts-errors',
      },
      {
        name: 'Git Blame + GitHub PR',
        description:
          'Inline git blame annotations and seamless GitHub pull request integration.',
      },
      {
        name: 'Prisma',
        description:
          'Schema highlighting, formatting, and jump-to-definition for Prisma ORM.',
        link: 'https://marketplace.visualstudio.com/items?itemName=Prisma.prisma',
      },
      {
        name: 'Playwright Test',
        description:
          'Run and debug Playwright tests directly from VS Code with built-in trace viewer.',
        link: 'https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright',
      },
      {
        name: 'Vim',
        description:
          'Vim keybindings for efficient text editing. Essential for keyboard-driven workflow.',
        link: 'https://marketplace.visualstudio.com/items?itemName=vscodevim.vim',
      },
      {
        name: 'Andromeda + Material Icons',
        description:
          'Dark theme with vibrant syntax colors paired with Material file icons for better navigation.',
      },
      {
        name: 'Peacock',
        description:
          "Color-codes VS Code workspaces. Instantly identify which project you're working on.",
        link: 'https://marketplace.visualstudio.com/items?itemName=johnpapa.vscode-peacock',
      },
      {
        name: 'Code Spell Checker',
        description:
          'Catches typos in code, comments, and strings. Supports camelCase and custom dictionaries.',
        link: 'https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker',
      },
      {
        name: 'Thunder Client',
        description:
          'Lightweight REST API client built into VS Code. Alternative to Postman.',
        link: 'https://marketplace.visualstudio.com/items?itemName=rangav.vscode-thunder-client',
      },
      {
        name: 'Gremlins',
        description:
          'Highlights invisible and confusing characters that can break code silently.',
        link: 'https://marketplace.visualstudio.com/items?itemName=nhoizey.gremlins',
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
    ],
  },
  {
    id: 'productivity',
    title: 'Productivity Apps',
    description: 'Apps for staying organized and focused',
    icon: Wrench,
    items: [
      {
        name: 'Notion',
        description:
          'Knowledge base, project planning, and documentation. Second brain for everything.',
        link: 'https://notion.so',
      },
      {
        name: 'Todoist',
        description:
          'Task management with natural language input, recurring tasks, and project organization.',
        link: 'https://todoist.com',
      },
      {
        name: 'Slack',
        description:
          'Team communication. Integrated with GitHub for PR notifications.',
        link: 'https://slack.com',
      },
      {
        name: 'Bitwarden',
        description:
          'Open-source password manager with secure sharing and self-hosting options.',
        link: 'https://bitwarden.com',
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
                  <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
                    <div className="flex items-center gap-3">
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
                    {category.download && (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={category.download.href}
                          download={category.download.filename}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          {category.download.label}
                        </a>
                      </Button>
                    )}
                  </div>

                  {/* Installation instructions */}
                  {category.download?.instructions && (
                    <div className="mb-6 p-4 rounded-lg bg-muted/50 border border-dashed">
                      <p className="text-sm font-medium mb-2">
                        Installation Instructions:
                      </p>
                      <ol className="text-sm text-muted-foreground space-y-1.5">
                        {category.download.instructions.map((step, index) => (
                          <li key={index} className="text-xs">
                            {step.split(/(`[^`]+`)/).map((part, partIndex) => {
                              if (part.startsWith('`') && part.endsWith('`')) {
                                return (
                                  <code
                                    key={partIndex}
                                    className="px-1.5 py-0.5 rounded bg-navy-100 dark:bg-navy-900 text-navy-700 dark:text-navy-300 font-mono text-[11px]"
                                  >
                                    {part.slice(1, -1)}
                                  </code>
                                );
                              }
                              return <span key={partIndex}>{part}</span>;
                            })}
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item, itemIndex) => {
                      const CardWrapper = item.link ? 'a' : 'div';
                      const cardProps = item.link
                        ? {
                            href: item.link,
                            target: '_blank' as const,
                            rel: 'noopener noreferrer',
                          }
                        : {};

                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.3,
                            delay: categoryIndex * 0.1 + itemIndex * 0.05,
                          }}
                        >
                          <CardWrapper
                            {...cardProps}
                            className={`group block p-4 rounded-xl border bg-card transition-all duration-200 h-full ${
                              item.link
                                ? 'hover:bg-muted/50 hover:border-mocha-300 dark:hover:border-mocha-700 hover:shadow-md cursor-pointer'
                                : ''
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h3 className="font-semibold group-hover:text-mocha-600 dark:group-hover:text-mocha-400 transition-colors">
                                {item.name}
                              </h3>
                              {item.link && (
                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-mocha-500 transition-colors flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {item.description}
                            </p>
                          </CardWrapper>
                        </motion.div>
                      );
                    })}
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
              <span className="font-medium text-foreground">February 2026</span>
            </p>
          </motion.div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
