'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import {
  Heart,
  Brain,
  Zap,
  Users,
  Target,
  Shield,
  GitBranch,
  BookOpen,
  Rocket,
  CheckCircle,
  ArrowRight,
  Quote,
  Star,
  TrendingUp,
  Layers,
  Puzzle,
  Compass,
  Scale,
  Infinity as InfinityIcon,
  Eye,
  Fingerprint,
  TreePine,
  Timer,
  FileCode,
} from 'lucide-react';

interface Principle {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  examples: string[];
  quote?: string;
}

interface Practice {
  name: string;
  description: string;
  icon: React.ElementType;
  tools?: string[];
}

interface Methodology {
  title: string;
  description: string;
  steps: string[];
  benefits: string[];
}

interface CodeExample {
  title: string;
  description: string;
  before: string;
  after: string;
  improvement: string;
}

const corePrinciples: Principle[] = [
  {
    title: 'Performance First',
    description:
      'Every millisecond matters. I treat performance as a feature, not an afterthought.',
    icon: Zap,
    color: 'from-yellow-500/20 to-orange-500/20',
    examples: [
      'Lazy loading and code splitting by default',
      'Optimizing bundle sizes and tree shaking',
      'Implementing virtual scrolling for large lists',
      'Using web workers for heavy computations',
    ],
    quote: 'Performance is not about speed, it&apos;s about perception',
  },
  {
    title: 'User-Centric Design',
    description:
      'Technology should be invisible. Users shouldn&apos;t think about how it works, just enjoy that it does.',
    icon: Heart,
    color: 'from-pink-500/20 to-red-500/20',
    examples: [
      'Progressive enhancement for all users',
      'Intuitive interfaces that guide naturally',
      'Meaningful error messages and recovery',
      'Responsive design that adapts seamlessly',
    ],
    quote: 'The best interface is no interface',
  },
  {
    title: 'Clean Architecture',
    description:
      'Code is written once but read hundreds of times. I optimize for readability and maintainability.',
    icon: Layers,
    color: 'from-blue-500/20 to-cyan-500/20',
    examples: [
      'Single Responsibility Principle in every component',
      'Clear separation of concerns',
      'Comprehensive documentation and comments',
      'Consistent naming conventions',
    ],
    quote: 'Clean code always looks like it was written by someone who cares',
  },
  {
    title: 'Continuous Learning',
    description:
      'The tech landscape evolves daily. Staying curious and adaptive is not optional.',
    icon: BookOpen,
    color: 'from-green-500/20 to-emerald-500/20',
    examples: [
      'Weekly exploration of new technologies',
      'Contributing to open source projects',
      'Attending conferences and workshops',
      'Teaching and mentoring others',
    ],
    quote: 'The more I learn, the more I realize I don&apos;t know',
  },
  {
    title: 'Collaborative Excellence',
    description:
      'Great software is built by teams, not individuals. I prioritize communication and cooperation.',
    icon: Users,
    color: 'from-purple-500/20 to-indigo-500/20',
    examples: [
      'Detailed code reviews with constructive feedback',
      'Pair programming for complex features',
      'Knowledge sharing through documentation',
      'Fostering inclusive team environments',
    ],
    quote: 'Alone we can do so little; together we can do so much',
  },
  {
    title: 'Pragmatic Innovation',
    description:
      'Balance cutting-edge with battle-tested. Innovation should solve real problems, not create new ones.',
    icon: Rocket,
    color: 'from-indigo-500/20 to-purple-500/20',
    examples: [
      'Evaluating new tech against real needs',
      'Proof of concepts before full adoption',
      'Incremental migration strategies',
      'Measuring impact of innovations',
    ],
    quote: 'Innovation is not about being first, it&apos;s about being better',
  },
];

const developmentPractices: Practice[] = [
  {
    name: 'Test-Driven Development',
    description:
      'Writing tests first ensures code meets requirements and remains maintainable',
    icon: Shield,
    tools: ['Jest', 'React Testing Library', 'Cypress', 'Playwright'],
  },
  {
    name: 'Component-Driven Design',
    description:
      'Building UIs from small, reusable components that compose into complex interfaces',
    icon: Puzzle,
    tools: ['Storybook', 'Component Libraries', 'Design Systems'],
  },
  {
    name: 'Continuous Integration',
    description:
      'Automated testing and deployment for consistent, reliable releases',
    icon: GitBranch,
    tools: ['GitHub Actions', 'Vercel', 'Husky', 'Lint-staged'],
  },
  {
    name: 'Performance Monitoring',
    description:
      'Tracking real-world performance to identify and fix bottlenecks',
    icon: Timer,
    tools: ['Lighthouse CI', 'Web Vitals', 'Bundle Analyzer', 'Sentry'],
  },
  {
    name: 'Accessibility First',
    description: 'Building inclusive experiences that work for everyone',
    icon: Eye,
    tools: ['axe DevTools', 'WAVE', 'Screen Readers', 'Keyboard Testing'],
  },
  {
    name: 'Documentation Culture',
    description:
      'Comprehensive documentation as part of the development process',
    icon: FileCode,
    tools: ['JSDoc', 'TypeDoc', 'README', 'Architecture Decision Records'],
  },
];

const methodologies: Methodology[] = [
  {
    title: 'Agile Development',
    description:
      'Iterative development with continuous feedback and improvement',
    steps: [
      'Sprint planning with clear goals',
      'Daily standups for alignment',
      'Regular demos and feedback',
      'Retrospectives for improvement',
    ],
    benefits: [
      'Faster delivery of value',
      'Better adaptation to changes',
      'Improved team collaboration',
      'Higher customer satisfaction',
    ],
  },
  {
    title: 'Domain-Driven Design',
    description: 'Aligning code structure with business domains for clarity',
    steps: [
      'Understand the business domain',
      'Define bounded contexts',
      'Create ubiquitous language',
      'Model domain entities',
    ],
    benefits: [
      'Better business alignment',
      'Clearer code organization',
      'Reduced complexity',
      'Easier onboarding',
    ],
  },
  {
    title: 'Progressive Enhancement',
    description: 'Building robust foundations that enhance with capabilities',
    steps: [
      'Start with semantic HTML',
      'Add CSS for presentation',
      'Enhance with JavaScript',
      'Optimize for performance',
    ],
    benefits: [
      'Better accessibility',
      'Improved SEO',
      'Faster initial load',
      'Graceful degradation',
    ],
  },
];

const codeExamples: CodeExample[] = [
  {
    title: 'Component Composition',
    description: 'Breaking down complex components into reusable pieces',
    before: `// Before: Monolithic component
function UserProfile({ user }) {
  return (
    <div className="profile">
      <img src={user.avatar} />
      <h2>{user.name}</h2>
      <p>{user.bio}</p>
      <div className="stats">
        <span>{user.posts} posts</span>
        <span>{user.followers} followers</span>
      </div>
    </div>
  );
}`,
    after: `// After: Composed components
function UserProfile({ user }) {
  return (
    <Card>
      <Avatar src={user.avatar} alt={user.name} />
      <UserInfo name={user.name} bio={user.bio} />
      <UserStats posts={user.posts} followers={user.followers} />
    </Card>
  );
}`,
    improvement: '70% more reusable, 50% easier to test',
  },
  {
    title: 'Performance Optimization',
    description: 'Using React patterns for better performance',
    before: `// Before: Unnecessary re-renders
function List({ items }) {
  return items.map(item => (
    <div key={item.id} onClick={() => handleClick(item)}>
      {item.name}
    </div>
  ));
}`,
    after: `// After: Optimized with memoization
const ListItem = memo(({ item, onClick }) => (
  <div onClick={() => onClick(item)}>
    {item.name}
  </div>
));

function List({ items }) {
  const handleClick = useCallback((item) => {
    // Handle click
  }, []);
  
  return items.map(item => (
    <ListItem key={item.id} item={item} onClick={handleClick} />
  ));
}`,
    improvement: '80% fewer re-renders',
  },
];

export default function PhilosophyPage() {
  const [selectedPrinciple, setSelectedPrinciple] = useState<number | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<
    'principles' | 'practices' | 'code'
  >('principles');

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0">
            {/* Code Rain Effect */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-primary/20 font-mono text-xs"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `-20px`,
                }}
                animate={{
                  y: ['0vh', '100vh'],
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 10,
                  ease: 'linear',
                }}
              >
                {
                  [
                    'const',
                    'function',
                    'return',
                    'async',
                    'await',
                    '=>',
                    'class',
                    'import',
                  ][Math.floor(Math.random() * 8)]
                }
              </motion.div>
            ))}
          </div>
        </div>

        <Container size="lg" className="relative z-10 text-center py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <Brain className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Development Philosophy
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Principles That <span className="text-primary">Guide</span> My
              Code
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              A collection of beliefs, practices, and methodologies that shape
              how I approach software development
            </p>

            {/* Philosophy Stats */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto">
              <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-6">
                <Compass className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">6</div>
                <div className="text-sm text-muted-foreground">
                  Core Principles
                </div>
              </div>
              <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-6">
                <Scale className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">Balance</div>
                <div className="text-sm text-muted-foreground">
                  Innovation & Stability
                </div>
              </div>
              <div className="bg-card/50 backdrop-blur border border-border rounded-xl p-6">
                <InfinityIcon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-2xl font-bold mb-1">Always</div>
                <div className="text-sm text-muted-foreground">
                  Learning & Growing
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Tab Navigation */}
      <section className="sticky top-0 z-40 bg-background/95 backdrop-blur border-b">
        <Container size="lg">
          <div className="flex justify-center py-4">
            <div className="inline-flex p-1 bg-muted rounded-lg">
              <button
                onClick={() => setActiveTab('principles')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'principles'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Core Principles
              </button>
              <button
                onClick={() => setActiveTab('practices')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'practices'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Best Practices
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`px-6 py-2 rounded-md font-medium transition-colors ${
                  activeTab === 'code'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Code Examples
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {/* Core Principles */}
        {activeTab === 'principles' && (
          <motion.section
            key="principles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20"
          >
            <Container size="lg">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {corePrinciples.map((principle, index) => (
                  <motion.div
                    key={principle.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() =>
                      setSelectedPrinciple(
                        selectedPrinciple === index ? null : index
                      )
                    }
                    className="cursor-pointer group"
                  >
                    <div className="relative h-full">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${principle.color} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity`}
                      />
                      <div className="relative bg-card border border-border rounded-xl p-6 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start gap-4 mb-4">
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-br ${principle.color}`}
                          >
                            <principle.icon className="w-6 h-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">
                              {principle.title}
                            </h3>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-muted-foreground mb-4 flex-1">
                          {principle.description}
                        </p>

                        {/* Quote */}
                        {principle.quote && (
                          <div className="relative mb-4">
                            <Quote className="absolute -top-2 -left-2 w-4 h-4 text-primary/20" />
                            <p className="text-sm italic text-muted-foreground pl-4">
                              &quot;{principle.quote}&quot;
                            </p>
                          </div>
                        )}

                        {/* Expanded Examples */}
                        <AnimatePresence>
                          {selectedPrinciple === index && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="space-y-2 pt-4 border-t"
                            >
                              <div className="text-sm font-medium mb-2">
                                Examples in Practice:
                              </div>
                              {principle.examples.map(example => (
                                <div
                                  key={example}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">
                                    {example}
                                  </span>
                                </div>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Expand Indicator */}
                        <div className="flex justify-center mt-4">
                          <div className="text-xs text-muted-foreground">
                            Click to{' '}
                            {selectedPrinciple === index
                              ? 'collapse'
                              : 'expand'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Container>
          </motion.section>
        )}

        {/* Best Practices */}
        {activeTab === 'practices' && (
          <motion.section
            key="practices"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20"
          >
            <Container size="lg">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
                {/* Development Practices */}
                <div>
                  <h2 className="text-2xl font-bold mb-8">
                    Development Practices
                  </h2>
                  <div className="space-y-6">
                    {developmentPractices.map((practice, index) => (
                      <motion.div
                        key={practice.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ x: 5 }}
                        className="bg-card border border-border rounded-xl p-6"
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-3 bg-primary/10 rounded-lg">
                            <practice.icon className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-2">
                              {practice.name}
                            </h3>
                            <p className="text-muted-foreground mb-4">
                              {practice.description}
                            </p>
                            {practice.tools && (
                              <div className="flex flex-wrap gap-2">
                                {practice.tools.map(tool => (
                                  <Badge key={tool} variant="outline">
                                    {tool}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Methodologies */}
                <div>
                  <h2 className="text-2xl font-bold mb-8">Methodologies</h2>
                  <div className="space-y-6">
                    {methodologies.map((methodology, index) => (
                      <motion.div
                        key={methodology.title}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-card border border-border rounded-xl p-6"
                      >
                        <h3 className="text-lg font-semibold mb-2">
                          {methodology.title}
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {methodology.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium mb-2">
                              Process:
                            </div>
                            <ul className="space-y-1">
                              {methodology.steps.map((step, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="text-primary font-mono text-sm">
                                    {i + 1}.
                                  </span>
                                  <span className="text-sm text-muted-foreground">
                                    {step}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <div className="text-sm font-medium mb-2">
                              Benefits:
                            </div>
                            <ul className="space-y-1">
                              {methodology.benefits.map(benefit => (
                                <li
                                  key={benefit}
                                  className="flex items-start gap-2"
                                >
                                  <Star className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">
                                    {benefit}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </Container>
          </motion.section>
        )}

        {/* Code Examples */}
        {activeTab === 'code' && (
          <motion.section
            key="code"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="py-20"
          >
            <Container size="lg">
              <div className="space-y-12 max-w-6xl mx-auto">
                {codeExamples.map((example, index) => (
                  <motion.div
                    key={example.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    {/* Header */}
                    <div className="p-6 border-b">
                      <h3 className="text-xl font-semibold mb-2">
                        {example.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {example.description}
                      </p>
                    </div>

                    {/* Code Comparison */}
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                      {/* Before */}
                      <div className="border-r">
                        <div className="px-6 py-3 bg-red-500/10 border-b">
                          <span className="text-sm font-medium text-red-500">
                            Before
                          </span>
                        </div>
                        <pre className="p-6 overflow-x-auto">
                          <code className="text-sm font-mono text-muted-foreground">
                            {example.before}
                          </code>
                        </pre>
                      </div>

                      {/* After */}
                      <div>
                        <div className="px-6 py-3 bg-green-500/10 border-b">
                          <span className="text-sm font-medium text-green-500">
                            After
                          </span>
                        </div>
                        <pre className="p-6 overflow-x-auto">
                          <code className="text-sm font-mono text-muted-foreground">
                            {example.after}
                          </code>
                        </pre>
                      </div>
                    </div>

                    {/* Improvement Metric */}
                    <div className="p-6 bg-primary/5 border-t">
                      <div className="flex items-center justify-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        <span className="font-medium">Result:</span>
                        <span className="text-primary font-semibold">
                          {example.improvement}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Container>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Philosophy in Action */}
      <section className="py-20 bg-muted/30">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Philosophy in <span className="text-primary">Action</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These principles aren&apos;t just theory—they guide every line of
              code I write
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Result-Driven</h3>
              <p className="text-muted-foreground">
                Every decision is measured against its impact on users and
                business goals
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Fingerprint className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Signature</h3>
              <p className="text-muted-foreground">
                My code is my signature—I take pride in every commit
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TreePine className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sustainable Code</h3>
              <p className="text-muted-foreground">
                Building for today while planning for tomorrow&apos;s growth
              </p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20">
        <Container size="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Let&apos;s Build with{' '}
              <span className="text-primary">Purpose</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Ready to create something meaningful together?
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/projects">
                  See My Work
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Let&apos;s Talk</Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
