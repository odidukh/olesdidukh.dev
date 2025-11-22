'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import {
  GraduationCap,
  Trophy,
  TrendingUp,
  Award,
  Code2,
  Rocket,
  Brain,
  Users,
  Globe,
  ArrowRight,
  Star,
  Briefcase,
  School,
  CheckCircle2,
  Circle,
  Timer,
  Mountain,
  Package,
  Layers,
  Quote,
} from 'lucide-react';

interface JourneyPhase {
  id: string;
  phase: string;
  years: string;
  title: string;
  description: string;
  color: string;
  icon: React.ElementType;
  milestones: Milestone[];
}

interface Milestone {
  date: string;
  title: string;
  description: string;
  type: 'work' | 'education' | 'achievement' | 'skill' | 'personal';
  impact?: 'high' | 'medium' | 'low';
  tags?: string[];
  metrics?: { label: string; value: string }[];
}

interface LearningPath {
  category: string;
  items: LearningItem[];
}

interface LearningItem {
  name: string;
  status: 'completed' | 'in-progress' | 'planned';
  progress: number;
  icon?: React.ElementType;
  description?: string;
  startDate?: string;
  endDate?: string;
  resources?: string[];
}

interface Mentor {
  name: string;
  role: string;
  company: string;
  lesson: string;
  period: string;
  impact: string;
}

const journeyPhases: JourneyPhase[] = [
  {
    id: 'foundation',
    phase: 'Foundation',
    years: '2017-2018',
    title: 'The Beginning',
    description:
      'Discovering passion for web development and building core skills',
    color: 'from-blue-500/20 to-cyan-500/20',
    icon: School,
    milestones: [
      {
        date: 'Sep 2017',
        title: 'First Line of Code',
        description:
          'Started learning HTML, CSS, and JavaScript through online courses and bootcamps',
        type: 'education',
        impact: 'high',
        tags: ['HTML', 'CSS', 'JavaScript'],
        metrics: [
          { label: 'Courses Completed', value: '10+' },
          { label: 'Practice Hours', value: '500+' },
        ],
      },
      {
        date: 'Dec 2017',
        title: 'First Client Project',
        description:
          'Built complete website for local business, handling design and development',
        type: 'achievement',
        impact: 'medium',
        tags: ['Web Design', 'Client Work', 'Freelance'],
        metrics: [
          { label: 'Project Duration', value: '3 weeks' },
          { label: 'Client Rating', value: '5/5' },
        ],
      },
      {
        date: 'Mar 2018',
        title: 'Joined Inango Systems',
        description:
          'Started as Junior Front-End Developer, working on embedded web interfaces for network devices',
        type: 'work',
        impact: 'high',
        tags: ['First Job', 'Professional Growth', 'Enterprise'],
        metrics: [
          { label: 'Team Size', value: '5 developers' },
          { label: 'Products Shipped', value: '3' },
        ],
      },
      {
        date: 'Jun 2018',
        title: 'React.js Adoption',
        description:
          'Mastered React.js and introduced component-based architecture to team projects',
        type: 'skill',
        impact: 'high',
        tags: ['React', 'Modern JS', 'SPA'],
        metrics: [
          { label: 'Components Built', value: '50+' },
          { label: 'Performance Gain', value: '40%' },
        ],
      },
    ],
  },
  {
    id: 'growth',
    phase: 'Rapid Growth',
    years: '2019-2020',
    title: 'Skill Expansion',
    description: 'Deepening expertise and taking on bigger challenges',
    color: 'from-green-500/20 to-emerald-500/20',
    icon: TrendingUp,
    milestones: [
      {
        date: 'Jan 2019',
        title: 'Full-Stack Development',
        description:
          'Learned Node.js, Express, and MongoDB to become a versatile developer',
        type: 'skill',
        impact: 'high',
        tags: ['Node.js', 'Full-Stack', 'Backend'],
        metrics: [
          { label: 'APIs Built', value: '10+' },
          { label: 'Stack Mastery', value: 'MERN' },
        ],
      },
      {
        date: 'Jun 2020',
        title: 'Joined Emerline',
        description:
          'Promoted to Front-End Developer, working with international clients from USA, Germany, and UK',
        type: 'work',
        impact: 'high',
        tags: ['Career Growth', 'International', 'Remote'],
        metrics: [
          { label: 'Clients Served', value: '8' },
          { label: 'Time Zones', value: '3' },
        ],
      },
      {
        date: 'Sep 2020',
        title: 'Team Leadership',
        description:
          'Led first development team on major e-commerce platform rebuild',
        type: 'achievement',
        impact: 'high',
        tags: ['Leadership', 'Team Management', 'Mentoring'],
        metrics: [
          { label: 'Team Members', value: '4' },
          { label: 'Project Value', value: '$200K+' },
        ],
      },
      {
        date: 'Dec 2020',
        title: 'TypeScript Expert',
        description:
          'Mastered TypeScript and implemented type-safe architectures across projects',
        type: 'skill',
        impact: 'high',
        tags: ['TypeScript', 'Type Safety', 'DX'],
        metrics: [
          { label: 'Bug Reduction', value: '60%' },
          { label: 'Code Coverage', value: '85%' },
        ],
      },
    ],
  },
  {
    id: 'expertise',
    phase: 'Senior Expertise',
    years: '2021-2023',
    title: 'Technical Leadership',
    description:
      'Becoming a technical leader and architecting complex solutions',
    color: 'from-purple-500/20 to-pink-500/20',
    icon: Award,
    milestones: [
      {
        date: 'Mar 2021',
        title: 'Solution Architecture',
        description:
          'Designed and implemented microservices architecture for enterprise SaaS platform',
        type: 'achievement',
        impact: 'high',
        tags: ['Architecture', 'System Design', 'Scalability'],
        metrics: [
          { label: 'Users Supported', value: '50K+' },
          { label: 'Uptime', value: '99.9%' },
        ],
      },
      {
        date: 'Jan 2023',
        title: 'Joined Safebooks AI',
        description:
          'Senior Front-End Engineer working on AI-powered accounting platform',
        type: 'work',
        impact: 'high',
        tags: ['AI', 'Senior Role', 'FinTech'],
        metrics: [
          { label: 'Team Size', value: '15+' },
          { label: 'Daily Transactions', value: '1M+' },
        ],
      },
      {
        date: 'Jun 2023',
        title: 'Performance Champion',
        description:
          'Achieved consistent 95+ Lighthouse scores and sub-2s load times',
        type: 'achievement',
        impact: 'high',
        tags: ['Performance', 'Optimization', 'Core Web Vitals'],
        metrics: [
          { label: 'Lighthouse Score', value: '98' },
          { label: 'Load Time', value: '1.2s' },
        ],
      },
      {
        date: 'Oct 2023',
        title: 'Mentorship Program',
        description:
          'Started mentoring junior developers and conducting technical workshops',
        type: 'personal',
        impact: 'medium',
        tags: ['Mentorship', 'Teaching', 'Community'],
        metrics: [
          { label: 'Mentees', value: '6' },
          { label: 'Workshops', value: '12' },
        ],
      },
    ],
  },
  {
    id: 'innovation',
    phase: 'Innovation Era',
    years: '2024-Present',
    title: 'Cutting Edge',
    description:
      'Pushing boundaries with modern technologies and AI integration',
    color: 'from-orange-500/20 to-red-500/20',
    icon: Rocket,
    milestones: [
      {
        date: 'Jan 2024',
        title: 'Next.js 14+ Mastery',
        description:
          'Mastered Next.js App Router, Server Components, and Partial Prerendering',
        type: 'skill',
        impact: 'high',
        tags: ['Next.js', 'RSC', 'PPR'],
        metrics: [
          { label: 'Projects Migrated', value: '5' },
          { label: 'Performance Gain', value: '50%' },
        ],
      },
      {
        date: 'Mar 2024',
        title: 'AI-Powered Development',
        description:
          'Integrated AI tools into development workflow, boosting productivity',
        type: 'skill',
        impact: 'high',
        tags: ['AI', 'Automation', 'Productivity'],
        metrics: [
          { label: 'Productivity Boost', value: '40%' },
          { label: 'Code Quality', value: '↑25%' },
        ],
      },
      {
        date: 'Jun 2024',
        title: 'Open Source Contributor',
        description:
          'Active contributions to React ecosystem and developer tools',
        type: 'achievement',
        impact: 'medium',
        tags: ['Open Source', 'Community', 'GitHub'],
        metrics: [
          { label: 'PRs Merged', value: '25+' },
          { label: 'Stars Earned', value: '100+' },
        ],
      },
      {
        date: 'Nov 2024',
        title: 'Portfolio 2.0 Launch',
        description:
          'Built cutting-edge portfolio with Next.js 15, showcasing modern web capabilities',
        type: 'personal',
        impact: 'high',
        tags: ['Portfolio', 'Next.js 15', 'Innovation'],
        metrics: [
          { label: 'Technologies', value: '15+' },
          { label: 'Lighthouse', value: '100' },
        ],
      },
    ],
  },
];

const learningPaths: LearningPath[] = [
  {
    category: 'Currently Learning',
    items: [
      {
        name: 'Three.js / WebGL',
        status: 'in-progress',
        progress: 60,
        icon: Brain,
        description: '3D graphics and immersive web experiences',
        resources: ['Three.js Journey', 'WebGL Fundamentals'],
      },
      {
        name: 'Rust Programming',
        status: 'in-progress',
        progress: 30,
        icon: Code2,
        description:
          'Systems programming for performance-critical applications',
        resources: ['Rust Book', 'Rustlings'],
      },
      {
        name: 'Web3 & Blockchain',
        status: 'in-progress',
        progress: 20,
        icon: Globe,
        description: 'Decentralized applications and smart contracts',
        resources: ['Ethereum Docs', 'Web3 University'],
      },
      {
        name: 'AI/ML Fundamentals',
        status: 'in-progress',
        progress: 15,
        icon: Brain,
        description: 'Machine learning concepts and implementation',
        resources: ['Fast.ai', 'TensorFlow Tutorials'],
      },
    ],
  },
  {
    category: 'Recently Completed',
    items: [
      {
        name: 'Next.js 15',
        status: 'completed',
        progress: 100,
        icon: CheckCircle2,
        startDate: '2024-09',
        endDate: '2024-11',
        description: 'Latest features including PPR and React Compiler',
      },
      {
        name: 'Tailwind CSS v4',
        status: 'completed',
        progress: 100,
        icon: CheckCircle2,
        startDate: '2024-10',
        endDate: '2024-11',
        description: 'New architecture and performance improvements',
      },
      {
        name: 'Framer Motion',
        status: 'completed',
        progress: 100,
        icon: CheckCircle2,
        startDate: '2024-08',
        endDate: '2024-10',
        description: 'Advanced animations and gestures',
      },
    ],
  },
  {
    category: 'Future Goals',
    items: [
      {
        name: 'Native Mobile Development',
        status: 'planned',
        progress: 0,
        icon: Circle,
        description: 'Swift for iOS and Kotlin for Android',
      },
      {
        name: 'Cloud Architecture',
        status: 'planned',
        progress: 0,
        icon: Circle,
        description: 'AWS Solutions Architect certification',
      },
      {
        name: 'DevOps Mastery',
        status: 'planned',
        progress: 0,
        icon: Circle,
        description: 'Kubernetes, CI/CD, and infrastructure as code',
      },
    ],
  },
];

const mentors: Mentor[] = [
  {
    name: 'Alex Thompson',
    role: 'Tech Lead',
    company: 'Emerline',
    lesson:
      'Clean code is not about perfection, it&apos;s about clarity and maintainability',
    period: '2020-2021',
    impact: 'Transformed my approach to code architecture',
  },
  {
    name: 'Maria Silva',
    role: 'Senior Architect',
    company: 'Safebooks AI',
    lesson:
      'Always think about scale from day one, but don&apos;t over-engineer',
    period: '2023-Present',
    impact: 'Learned to balance innovation with pragmatism',
  },
  {
    name: 'Open Source Community',
    role: 'Various Contributors',
    company: 'GitHub',
    lesson: 'Collaboration and knowledge sharing accelerate growth',
    period: '2019-Present',
    impact: 'Expanded technical horizons and network',
  },
];

export default function JourneyPage() {
  const [selectedPhase, setSelectedPhase] = useState<string>('innovation');
  const [viewMode, setViewMode] = useState<'timeline' | 'phases'>('timeline');

  const selectedPhaseData = journeyPhases.find(p => p.id === selectedPhase);

  const totalYears = new Date().getFullYear() - 2017;
  const totalProjects = 50;
  const technologiesMastered = 25;
  const menteesTrained = 6;

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[50vh] flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-5">
            {[...Array(30)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -100, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 5 + 5,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
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
              <Rocket className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Professional Journey
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {totalYears} Years of{' '}
              <span className="text-primary">Innovation</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              From curious beginner to Senior Engineer, explore the milestones,
              learnings, and achievements that shaped my career
            </p>

            {/* Journey Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-xl p-6">
                <Mountain className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{totalYears}+</div>
                <div className="text-sm text-muted-foreground">
                  Years Experience
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Package className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{totalProjects}+</div>
                <div className="text-sm text-muted-foreground">
                  Projects Completed
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Layers className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">
                  {technologiesMastered}+
                </div>
                <div className="text-sm text-muted-foreground">
                  Technologies
                </div>
              </div>
              <div className="bg-card border border-border rounded-xl p-6">
                <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl font-bold mb-1">{menteesTrained}</div>
                <div className="text-sm text-muted-foreground">
                  Mentees Trained
                </div>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* View Mode Toggle */}
      <section className="py-8 border-b sticky top-0 bg-background/95 backdrop-blur z-40">
        <Container size="lg">
          <div className="flex justify-center gap-2">
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              onClick={() => setViewMode('timeline')}
            >
              Timeline View
            </Button>
            <Button
              variant={viewMode === 'phases' ? 'default' : 'outline'}
              onClick={() => setViewMode('phases')}
            >
              Phase View
            </Button>
          </div>
        </Container>
      </section>

      {/* Main Content */}
      {viewMode === 'timeline' ? (
        /* Timeline View */
        <section className="py-20">
          <Container size="lg">
            <div className="max-w-5xl mx-auto">
              {/* Phase Selector */}
              <div className="flex flex-wrap gap-2 justify-center mb-12">
                {journeyPhases.map(phase => (
                  <button
                    key={phase.id}
                    onClick={() => setSelectedPhase(phase.id)}
                    className={`
                      px-6 py-3 rounded-lg font-medium transition-all
                      ${
                        selectedPhase === phase.id
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-card border border-border hover:border-primary'
                      }
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <phase.icon className="w-5 h-5" />
                      <span>{phase.phase}</span>
                      <Badge variant="outline" className="ml-2">
                        {phase.years}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>

              {/* Selected Phase Details */}
              {selectedPhaseData && (
                <motion.div
                  key={selectedPhaseData.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Phase Header */}
                  <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">
                      {selectedPhaseData.title}
                    </h2>
                    <p className="text-lg text-muted-foreground">
                      {selectedPhaseData.description}
                    </p>
                  </div>

                  {/* Milestones */}
                  <div className="relative">
                    <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

                    {selectedPhaseData.milestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.date}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start gap-8 mb-12"
                      >
                        {/* Timeline Dot */}
                        <div className="relative z-10">
                          <div
                            className={`
                            w-16 h-16 rounded-full flex items-center justify-center
                            ${
                              milestone.impact === 'high'
                                ? 'bg-primary text-primary-foreground'
                                : milestone.impact === 'medium'
                                  ? 'bg-primary/20 text-primary'
                                  : 'bg-muted text-muted-foreground'
                            }
                          `}
                          >
                            {milestone.type === 'work' ? (
                              <Briefcase className="w-6 h-6" />
                            ) : milestone.type === 'education' ? (
                              <GraduationCap className="w-6 h-6" />
                            ) : milestone.type === 'achievement' ? (
                              <Trophy className="w-6 h-6" />
                            ) : milestone.type === 'skill' ? (
                              <Code2 className="w-6 h-6" />
                            ) : (
                              <Star className="w-6 h-6" />
                            )}
                          </div>
                        </div>

                        {/* Milestone Content */}
                        <div className="flex-1">
                          <div className="bg-card border border-border rounded-xl p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-semibold mb-1">
                                  {milestone.title}
                                </h3>
                                <div className="text-sm text-primary font-medium">
                                  {milestone.date}
                                </div>
                              </div>
                              {milestone.impact && (
                                <Badge
                                  variant={
                                    milestone.impact === 'high'
                                      ? 'default'
                                      : milestone.impact === 'medium'
                                        ? 'secondary'
                                        : 'outline'
                                  }
                                >
                                  {milestone.impact} impact
                                </Badge>
                              )}
                            </div>

                            <p className="text-muted-foreground mb-4">
                              {milestone.description}
                            </p>

                            {/* Tags */}
                            {milestone.tags && (
                              <div className="flex flex-wrap gap-2 mb-4">
                                {milestone.tags.map(tag => (
                                  <Badge key={tag} variant="outline">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            )}

                            {/* Metrics */}
                            {milestone.metrics && (
                              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                {milestone.metrics.map(metric => (
                                  <div
                                    key={metric.label}
                                    className="text-center"
                                  >
                                    <div className="text-2xl font-bold text-primary">
                                      {metric.value}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {metric.label}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </Container>
        </section>
      ) : (
        /* Phase View */
        <section className="py-20">
          <Container size="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {journeyPhases.map((phase, index) => (
                <motion.div
                  key={phase.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${phase.color} rounded-xl opacity-10 group-hover:opacity-20 transition-opacity`}
                  />
                  <div className="relative bg-card border border-border rounded-xl p-8">
                    {/* Phase Header */}
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${phase.color}`}
                      >
                        <phase.icon className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{phase.phase}</h3>
                        <Badge variant="outline">{phase.years}</Badge>
                      </div>
                    </div>

                    <h4 className="text-lg font-semibold mb-2">
                      {phase.title}
                    </h4>
                    <p className="text-muted-foreground mb-6">
                      {phase.description}
                    </p>

                    {/* Key Milestones Summary */}
                    <div className="space-y-3">
                      <div className="text-sm font-medium text-muted-foreground mb-2">
                        Key Milestones:
                      </div>
                      {phase.milestones.slice(0, 3).map(milestone => (
                        <div
                          key={milestone.date}
                          className="flex items-center gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                          <span className="text-sm">{milestone.title}</span>
                        </div>
                      ))}
                    </div>

                    {/* View Details */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-6"
                      onClick={() => {
                        setSelectedPhase(phase.id);
                        setViewMode('timeline');
                      }}
                    >
                      View Details
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Learning Paths Section */}
      <section className="py-20 bg-muted/30">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Continuous <span className="text-primary">Learning</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The journey never stops. Here&apos;s what I&apos;m learning and
              planning to master next
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {learningPaths.map((path, index) => (
              <motion.div
                key={path.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold mb-6">{path.category}</h3>

                <div className="space-y-4">
                  {path.items.map(item => (
                    <div key={item.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.status === 'completed' ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                          ) : item.status === 'in-progress' ? (
                            <Timer className="w-5 h-5 text-yellow-500" />
                          ) : (
                            <Circle className="w-5 h-5 text-muted-foreground" />
                          )}
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {item.progress}%
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${item.progress}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.2 }}
                          className={`h-full ${
                            item.status === 'completed'
                              ? 'bg-green-500'
                              : item.status === 'in-progress'
                                ? 'bg-yellow-500'
                                : 'bg-muted-foreground'
                          }`}
                        />
                      </div>

                      {item.description && (
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Mentors & Influences */}
      <section className="py-20">
        <Container size="lg">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Mentors & <span className="text-primary">Influences</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Great developers stand on the shoulders of giants
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {mentors.map((mentor, index) => (
              <motion.div
                key={mentor.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{mentor.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {mentor.role} at {mentor.company}
                    </div>
                  </div>
                </div>

                <blockquote className="relative">
                  <Quote className="absolute -top-2 -left-2 w-6 h-6 text-primary/20" />
                  <p className="text-sm italic text-muted-foreground pl-4">
                    &quot;{mentor.lesson}&quot;
                  </p>
                </blockquote>

                <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{mentor.period}</span>
                    <Badge variant="outline" className="text-xs">
                      {mentor.impact}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-background">
        <Container size="md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              The Journey <span className="text-primary">Continues</span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Ready to write the next chapter together?
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/contact">
                  Join My Journey
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/about/philosophy">My Philosophy</Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
