'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { ANIMATION } from '@/constants';
import {
  Code2,
  Palette,
  Server,
  Settings,
  Star,
  TrendingUp,
  Award,
  BookOpen,
  Zap,
  Activity,
  BarChart3,
  Layers,
  Terminal,
  Globe,
  Smartphone,
  Monitor,
  Package,
  Clock,
  type LucideIcon,
} from 'lucide-react';

type ProficiencyLevel = 'Expert' | 'Advanced' | 'Intermediate' | 'Learning';
type ViewMode = 'grid' | 'list' | 'radar';

interface Skill {
  name: string;
  level: ProficiencyLevel;
  yearsOfExperience: number;
  icon?: LucideIcon;
  description?: string;
  lastUsed?: string;
  projects?: number;
  certifications?: string[];
}

interface SkillCategory {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    description: 'Modern web technologies and frameworks',
    icon: Monitor,
    color: 'from-blue-500/20 to-cyan-500/20',
    skills: [
      {
        name: 'JavaScript ES6+',
        level: 'Expert',
        yearsOfExperience: 7,
        description:
          'Modern JavaScript, async patterns, functional programming',
        projects: 30,
        lastUsed: 'Currently',
      },
      {
        name: 'React.js',
        level: 'Expert',
        yearsOfExperience: 6,
        description:
          'Component-based architecture, hooks, context, performance optimization',
        projects: 25,
        lastUsed: 'Currently',
      },
      {
        name: 'TypeScript',
        level: 'Advanced',
        yearsOfExperience: 4,
        description: 'Type-safe development, generics, advanced patterns',
        projects: 15,
        lastUsed: 'Currently',
      },
      {
        name: 'Next.js',
        level: 'Advanced',
        yearsOfExperience: 3,
        description: 'SSR/SSG, App Router, API routes, optimization',
        projects: 8,
        lastUsed: 'Currently',
      },
      {
        name: 'HTML5/CSS3',
        level: 'Expert',
        yearsOfExperience: 7,
        description: 'Semantic HTML, modern CSS, animations, responsive design',
        projects: 40,
        lastUsed: 'Currently',
      },
      {
        name: 'SASS/SCSS',
        level: 'Expert',
        yearsOfExperience: 5,
        description:
          'CSS preprocessor, mixins, variables, nested rules, modular architecture',
        projects: 20,
        lastUsed: 'Currently',
      },
      {
        name: 'Tailwind CSS',
        level: 'Advanced',
        yearsOfExperience: 2,
        description:
          'Utility-first CSS, custom configurations, component patterns',
        projects: 10,
        lastUsed: 'Currently',
      },
      {
        name: 'Redux/Zustand',
        level: 'Advanced',
        yearsOfExperience: 5,
        description: 'State management, middleware, performance optimization',
        projects: 15,
        lastUsed: 'Currently',
      },
      {
        name: 'Framer Motion',
        level: 'Intermediate',
        yearsOfExperience: 1,
        description: 'Animation library, gestures, scroll-triggered animations',
        projects: 5,
        lastUsed: 'Currently',
      },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & APIs',
    description: 'Server-side technologies and API development',
    icon: Server,
    color: 'from-green-500/20 to-emerald-500/20',
    skills: [
      {
        name: 'Node.js',
        level: 'Advanced',
        yearsOfExperience: 4,
        description: 'Express, middleware, async operations, performance',
        projects: 15,
        lastUsed: 'Currently',
      },
      {
        name: 'GraphQL',
        level: 'Intermediate',
        yearsOfExperience: 2,
        description: 'Apollo, schemas, resolvers, subscriptions',
        projects: 5,
        lastUsed: '2024',
      },
      {
        name: 'REST APIs',
        level: 'Advanced',
        yearsOfExperience: 5,
        description: 'RESTful design, authentication, documentation',
        projects: 20,
        lastUsed: 'Currently',
      },
      {
        name: 'PostgreSQL',
        level: 'Intermediate',
        yearsOfExperience: 3,
        description: 'SQL queries, optimization, migrations',
        projects: 8,
        lastUsed: '2024',
      },
      {
        name: 'MongoDB',
        level: 'Intermediate',
        yearsOfExperience: 2,
        description: 'NoSQL design, aggregation, indexing',
        projects: 6,
        lastUsed: '2023',
      },
      {
        name: 'Redis',
        level: 'Learning',
        yearsOfExperience: 1,
        description: 'Caching strategies, pub/sub, session management',
        projects: 3,
        lastUsed: '2024',
      },
    ],
  },
  {
    id: 'mobile',
    title: 'Mobile Development',
    description: 'Cross-platform mobile application development',
    icon: Smartphone,
    color: 'from-purple-500/20 to-pink-500/20',
    skills: [
      {
        name: 'React Native',
        level: 'Advanced',
        yearsOfExperience: 2,
        description: 'Cross-platform apps, native modules, MVP delivery',
        projects: 3,
        lastUsed: '2021',
      },
      {
        name: 'Expo',
        level: 'Intermediate',
        yearsOfExperience: 1,
        description: 'Managed workflow, EAS, OTA updates',
        projects: 2,
        lastUsed: '2021',
      },
      {
        name: 'PWA',
        level: 'Intermediate',
        yearsOfExperience: 2,
        description: 'Service workers, offline functionality, app manifest',
        projects: 4,
        lastUsed: 'Currently',
      },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & DevOps',
    description: 'Development tools and deployment technologies',
    icon: Settings,
    color: 'from-orange-500/20 to-red-500/20',
    skills: [
      {
        name: 'Git/GitHub',
        level: 'Expert',
        yearsOfExperience: 7,
        description: 'Version control, branching strategies, CI/CD',
        projects: 50,
        lastUsed: 'Currently',
      },
      {
        name: 'Docker',
        level: 'Intermediate',
        yearsOfExperience: 2,
        description: 'Containerization, Docker Compose, optimization',
        projects: 6,
        lastUsed: '2024',
      },
      {
        name: 'AWS',
        level: 'Intermediate',
        yearsOfExperience: 2,
        description: 'EC2, S3, CloudFront, Lambda',
        projects: 5,
        lastUsed: '2024',
      },
      {
        name: 'Vercel',
        level: 'Advanced',
        yearsOfExperience: 2,
        description: 'Deployment, edge functions, analytics',
        projects: 10,
        lastUsed: 'Currently',
      },
      {
        name: 'Webpack/Vite',
        level: 'Advanced',
        yearsOfExperience: 4,
        description: 'Build optimization, code splitting, plugins',
        projects: 15,
        lastUsed: 'Currently',
      },
      {
        name: 'Jest/Testing',
        level: 'Advanced',
        yearsOfExperience: 3,
        description: 'Unit testing, integration testing, TDD',
        projects: 12,
        lastUsed: 'Currently',
      },
    ],
  },
  {
    id: 'design',
    title: 'Design & UX',
    description: 'Design tools and user experience principles',
    icon: Palette,
    color: 'from-indigo-500/20 to-purple-500/20',
    skills: [
      {
        name: 'Figma',
        level: 'Intermediate',
        yearsOfExperience: 3,
        description: 'Design systems, prototyping, developer handoff',
        projects: 15,
        lastUsed: 'Currently',
      },
      {
        name: 'UI/UX Principles',
        level: 'Advanced',
        yearsOfExperience: 5,
        description: 'User research, wireframing, usability testing',
        projects: 20,
        lastUsed: 'Currently',
      },
      {
        name: 'Responsive Design',
        level: 'Expert',
        yearsOfExperience: 7,
        description: 'Mobile-first, breakpoints, fluid typography',
        projects: 40,
        lastUsed: 'Currently',
      },
      {
        name: 'Accessibility',
        level: 'Advanced',
        yearsOfExperience: 4,
        description: 'WCAG compliance, ARIA, screen reader optimization',
        projects: 15,
        lastUsed: 'Currently',
      },
    ],
  },
];

const proficiencyColors: Record<ProficiencyLevel, string> = {
  Expert: 'text-green-500 border-green-500/20 bg-green-500/10',
  Advanced: 'text-blue-500 border-blue-500/20 bg-blue-500/10',
  Intermediate: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10',
  Learning: 'text-purple-500 border-purple-500/20 bg-purple-500/10',
};

const proficiencyPercentages: Record<ProficiencyLevel, number> = {
  Expert: 90,
  Advanced: 75,
  Intermediate: 50,
  Learning: 25,
};

export default function SkillsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [showDetails, setShowDetails] = useState<string | null>(null);

  const filteredCategories =
    selectedCategory === 'all'
      ? skillCategories
      : skillCategories.filter(cat => cat.id === selectedCategory);

  // Calculate statistics
  const totalSkills = skillCategories.reduce(
    (acc, cat) => acc + cat.skills.length,
    0
  );
  const expertSkills = skillCategories.reduce(
    (acc, cat) => acc + cat.skills.filter(s => s.level === 'Expert').length,
    0
  );
  const totalExperience = Math.max(
    ...skillCategories.flatMap(cat => cat.skills.map(s => s.yearsOfExperience))
  );

  const stats = [
    { label: 'Total Skills', value: totalSkills, icon: Code2 },
    { label: 'Expert Level', value: expertSkills, icon: Star },
    { label: 'Years Coding', value: `${totalExperience}+`, icon: TrendingUp },
    { label: 'Active Projects', value: '15+', icon: Activity },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
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

  return (
    <>
      <Navigation />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            {[...Array(ANIMATION.PARTICLE_COUNT)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Technical <span className="text-primary">Skills</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
              A comprehensive overview of my technical expertise, from frontend
              frameworks to cloud technologies
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-xl p-6"
                >
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* Filters and View Mode */}
      <section className="py-8 border-b sticky top-0 bg-background/95 backdrop-blur z-40">
        <Container size="lg">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap justify-center">
              <Button
                size="sm"
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
              >
                All Skills
              </Button>
              {skillCategories.map(cat => (
                <Button
                  key={cat.id}
                  size="sm"
                  variant={selectedCategory === cat.id ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <cat.icon className="w-4 h-4 mr-2" />
                  {cat.title}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                onClick={() => setViewMode('grid')}
              >
                <Layers className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === 'list' ? 'default' : 'outline'}
                onClick={() => setViewMode('list')}
              >
                <BarChart3 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Skills Display */}
      <section className="py-20">
        <Container size="lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-12"
            >
              {filteredCategories.map(category => (
                <motion.div key={category.id} variants={itemVariants}>
                  {/* Category Header */}
                  <div className="flex items-center gap-4 mb-8">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-br ${category.color}`}
                    >
                      <category.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">{category.title}</h2>
                      <p className="text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  {/* Skills Grid/List */}
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {category.skills.map(skill => (
                        <motion.div
                          key={skill.name}
                          whileHover={{ scale: 1.02 }}
                          className="bg-card border border-border rounded-xl p-6 cursor-pointer"
                          onClick={() =>
                            setShowDetails(
                              showDetails === skill.name ? null : skill.name
                            )
                          }
                        >
                          {/* Skill Header */}
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-lg font-semibold">
                                {skill.name}
                              </h3>
                              <span
                                className={`inline-flex px-2 py-1 rounded-md text-xs font-medium mt-2 ${
                                  proficiencyColors[skill.level]
                                }`}
                              >
                                {skill.level}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {skill.yearsOfExperience}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                years
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mb-4">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Proficiency</span>
                              <span>
                                {proficiencyPercentages[skill.level]}%
                              </span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                whileInView={{
                                  width: `${proficiencyPercentages[skill.level]}%`,
                                }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, delay: 0.2 }}
                                className="h-full bg-gradient-to-r from-primary to-primary/50"
                              />
                            </div>
                          </div>

                          {/* Quick Stats */}
                          <div className="flex justify-between text-sm text-muted-foreground">
                            {skill.projects && (
                              <span className="flex items-center gap-1">
                                <Package className="w-4 h-4" />
                                {skill.projects} projects
                              </span>
                            )}
                            {skill.lastUsed && (
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {skill.lastUsed}
                              </span>
                            )}
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {showDetails === skill.name &&
                              skill.description && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="mt-4 pt-4 border-t"
                                >
                                  <p className="text-sm text-muted-foreground">
                                    {skill.description}
                                  </p>
                                  {skill.certifications && (
                                    <div className="mt-3">
                                      <div className="text-xs font-medium mb-1">
                                        Certifications:
                                      </div>
                                      {skill.certifications.map(cert => (
                                        <Badge
                                          key={cert}
                                          variant="outline"
                                          className="text-xs mr-1"
                                        >
                                          {cert}
                                        </Badge>
                                      ))}
                                    </div>
                                  )}
                                </motion.div>
                              )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    /* List View */
                    <div className="space-y-4">
                      {category.skills.map(skill => (
                        <motion.div
                          key={skill.name}
                          whileHover={{ x: 5 }}
                          className="bg-card border border-border rounded-xl p-6"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6 flex-1">
                              {/* Skill Name & Level */}
                              <div className="min-w-[200px]">
                                <h3 className="font-semibold">{skill.name}</h3>
                                <span
                                  className={`inline-flex px-2 py-1 rounded-md text-xs font-medium mt-1 ${
                                    proficiencyColors[skill.level]
                                  }`}
                                >
                                  {skill.level}
                                </span>
                              </div>

                              {/* Progress Bar */}
                              <div className="flex-1 max-w-md">
                                <div className="h-3 bg-muted rounded-full overflow-hidden">
                                  <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{
                                      width: `${proficiencyPercentages[skill.level]}%`,
                                    }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-gradient-to-r from-primary to-primary/50"
                                  />
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                                <span>{skill.yearsOfExperience} years</span>
                                {skill.projects && (
                                  <span>{skill.projects} projects</span>
                                )}
                                {skill.lastUsed && (
                                  <Badge variant="outline">
                                    {skill.lastUsed}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </Container>
      </section>

      {/* Skills Matrix / Additional Info */}
      <section className="py-20 bg-muted/30">
        <Container size="lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Learning Path */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <BookOpen className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">Currently Learning</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Three.js / WebGL</span>
                  <Badge variant="outline">In Progress</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Rust</span>
                  <Badge variant="outline">Planned</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Web3 / Blockchain</span>
                  <Badge variant="outline">Research</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Machine Learning</span>
                  <Badge variant="outline">Exploring</Badge>
                </div>
              </div>
            </motion.div>

            {/* Certifications & Achievements */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-card border border-border rounded-xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Award className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold">Key Achievements</h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Performance Expert</div>
                    <div className="text-sm text-muted-foreground">
                      Achieved 95+ Lighthouse scores on multiple projects
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">International Experience</div>
                    <div className="text-sm text-muted-foreground">
                      Worked with clients from 5+ countries
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Terminal className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <div className="font-medium">Full-Stack Capable</div>
                    <div className="text-sm text-muted-foreground">
                      End-to-end application development expertise
                    </div>
                  </div>
                </div>
              </div>
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
              Looking for These Skills?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Let&apos;s discuss how my expertise can contribute to your
              project&apos;s success
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/projects">View My Work</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/contact">Start a Conversation</Link>
              </Button>
            </div>
          </motion.div>
        </Container>
      </section>

      <Footer />
    </>
  );
}
