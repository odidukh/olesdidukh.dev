'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Navigation } from '@/components/ui/Navigation';
import { Footer } from '@/components/ui/Footer';
import { BreadcrumbSchema } from '@/components/BreadcrumbSchema';
import { ANIMATION } from '@/constants';
import { generateParticleData } from '@/lib/random';
import {
  Code2,
  Star,
  Activity,
  BarChart3,
  Layers,
  BookOpen,
  Zap,
  Award,
  Terminal,
  Users,
  Settings,
  Package,
  Clock,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';
import {
  skillCategories as rawCategories,
  skills as rawSkills,
} from '@/data/generated/skills';
import { resolveIcon } from '@/lib/icon-resolver';

type ProficiencyLevel = 'Expert' | 'Advanced' | 'Intermediate' | 'Learning';
type ViewMode = 'grid' | 'list' | 'radar';

interface SkillView {
  name: string;
  level: ProficiencyLevel;
  yearsOfExperience: number;
  description?: string | null | undefined;
  lastUsed?: string | null | undefined;
  projects?: number | undefined;
  certifications?: string[] | undefined;
}

interface SkillCategoryView {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  skills: SkillView[];
}

// Map generated data (separate categories + skills) to grouped view model
const skillCategories: SkillCategoryView[] = rawCategories.map(cat => ({
  id: cat.id,
  title: cat.title,
  description: cat.description,
  icon: resolveIcon(cat.icon) || Code2,
  color: cat.color,
  skills: rawSkills
    .filter(s => s.category_id === cat.id)
    .map(s => ({
      name: s.name,
      level: s.level,
      yearsOfExperience: s.years_of_experience,
      description: s.description,
      lastUsed: s.last_used,
      projects: s.projects_count || undefined,
      certifications: s.certifications?.length ? s.certifications : undefined,
    })),
}));

const proficiencyColors: Record<ProficiencyLevel, string> = {
  Expert: 'text-green-500 border-green-500/20 bg-green-500/10',
  Advanced: 'text-blue-500 border-blue-500/20 bg-blue-500/10',
  Intermediate: 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10',
  Learning: 'text-purple-500 border-purple-500/20 bg-purple-500/10',
};

// Pre-compute particle data at module level (same on server and client)
const particleData = generateParticleData(ANIMATION.PARTICLE_COUNT);

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
      <BreadcrumbSchema page="skills" />
      <Navigation />

      <main id="main-content">
        {/* Hero Section */}
        <section className="relative min-h-[40vh] flex items-center justify-center bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden pt-20">
          {/* Animated Background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 opacity-10">
              {particleData.map((particle, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-primary rounded-full"
                  style={{
                    left: `${particle.left}%`,
                    top: `${particle.top}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: particle.duration,
                    repeat: Infinity,
                    delay: particle.delay,
                  }}
                />
              ))}
            </div>
          </div>

          <Container size="lg" className="relative z-10 text-center pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
                <Code2 className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-primary">
                  Skills
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Technical <span className="text-primary">Skills</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-12">
                A comprehensive overview of my technical expertise, from
                frontend frameworks to cloud technologies
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
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              {/* Category Filter */}
              <div className="flex gap-2 flex-wrap">
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
                    variant={
                      selectedCategory === cat.id ? 'default' : 'outline'
                    }
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
                  aria-label="Grid view"
                  aria-pressed={viewMode === 'grid'}
                >
                  <Layers className="w-4 h-4" aria-hidden="true" />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                  aria-label="List view"
                  aria-pressed={viewMode === 'list'}
                >
                  <BarChart3 className="w-4 h-4" aria-hidden="true" />
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
                          <motion.button
                            key={skill.name}
                            type="button"
                            whileHover={{ scale: 1.02 }}
                            className="bg-card border border-border rounded-xl p-6 cursor-pointer text-left w-full"
                            onClick={() =>
                              setShowDetails(
                                showDetails === skill.name ? null : skill.name
                              )
                            }
                            aria-expanded={showDetails === skill.name}
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

                            {/* Proficiency Level */}
                            <div className="mb-4">
                              <Badge
                                variant={
                                  skill.level === 'Expert'
                                    ? 'default'
                                    : skill.level === 'Advanced'
                                      ? 'secondary'
                                      : 'outline'
                                }
                                className="text-xs"
                              >
                                {skill.level}
                              </Badge>
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
                          </motion.button>
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
                                  <h3 className="font-semibold">
                                    {skill.name}
                                  </h3>
                                  <span
                                    className={`inline-flex px-2 py-1 rounded-md text-xs font-medium mt-1 ${
                                      proficiencyColors[skill.level]
                                    }`}
                                  >
                                    {skill.level}
                                  </span>
                                </div>

                                {/* Proficiency Level */}
                                <div className="flex-1 max-w-md">
                                  <Badge
                                    variant={
                                      skill.level === 'Expert'
                                        ? 'default'
                                        : skill.level === 'Advanced'
                                          ? 'secondary'
                                          : 'outline'
                                    }
                                    className="text-xs"
                                  >
                                    {skill.level}
                                  </Badge>
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
              {/* Education & Background */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-bold">Education</h3>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="font-medium">
                      UNIT Factory (École 42 Network)
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Kyiv, Ukraine · 2017–2019
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Selected from 13,000+ applicants for peer-to-peer
                      programming education. Mastered C/C++, algorithms, and
                      data structures through 20+ practical projects.
                    </p>
                  </div>
                  <div>
                    <div className="font-medium">
                      Master&apos;s Degree in Physics
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Taras Shevchenko University of Kyiv · 2016–2018
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Computational Physics, Data Analysis. Co-authored 3
                      scientific publications.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Key Achievements */}
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
                    <Zap className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Performance Expert</div>
                      <div className="text-sm text-muted-foreground">
                        Engineered real-time dashboards with sub-200ms render
                        times and 92+ Lighthouse scores.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Enterprise Scale</div>
                      <div className="text-sm text-muted-foreground">
                        Architected platforms processing 1M+ daily transactions
                        and monitoring 10,000+ nodes.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Settings className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Developer Experience</div>
                      <div className="text-sm text-muted-foreground">
                        Deployed component libraries and tooling that cut UI dev
                        time by 30% and onboarding time by 50%.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Terminal className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">Quality & Stability</div>
                      <div className="text-sm text-muted-foreground">
                        Built type-safe data pipelines, reducing runtime errors
                        by 95% and saving ~15 QA hours per sprint.
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
      </main>
      <Footer />
    </>
  );
}
