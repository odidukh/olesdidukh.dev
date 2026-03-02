'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import {
  Code2,
  Layout,
  Database,
  Wrench,
  Users,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react';

type SkillLevel = 'Expert' | 'Advanced' | 'Intermediate' | 'Learning';

interface Skill {
  name: string;
  level: SkillLevel;
  years?: number;
  category: string;
}

interface SkillCategory {
  id: string;
  title: string;
  icon: LucideIcon;
  color: string;
  skills: Skill[];
}

const TIER_DOTS: Record<SkillLevel, number> = {
  Expert: 4,
  Advanced: 3,
  Intermediate: 2,
  Learning: 1,
};

const TIER_COLORS: Record<SkillLevel, string> = {
  Expert: 'from-mocha-400 to-mocha-600',
  Advanced: 'from-navy-400 to-navy-600',
  Intermediate: 'from-success-400 to-success-600',
  Learning: 'from-warning-400 to-warning-600',
};

const TIER_DESCRIPTIONS: Record<SkillLevel, string> = {
  Expert: 'Deep expertise — go-to choice for production systems',
  Advanced: 'Strong proficiency — comfortable in complex scenarios',
  Intermediate: 'Solid working knowledge — used in real projects',
  Learning: 'Actively growing — side projects & exploration',
};

const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: Code2,
    color: 'from-mocha-400 to-mocha-600',
    skills: [
      { name: 'React.js', level: 'Expert', years: 5, category: 'frontend' },
      { name: 'TypeScript', level: 'Expert', years: 3, category: 'frontend' },
      { name: 'Next.js', level: 'Advanced', years: 2, category: 'frontend' },
      {
        name: 'JavaScript ES6+',
        level: 'Expert',
        years: 7,
        category: 'frontend',
      },
      { name: 'HTML5/CSS3', level: 'Expert', years: 7, category: 'frontend' },
      {
        name: 'Redux/Zustand',
        level: 'Expert',
        years: 4,
        category: 'frontend',
      },
    ],
  },
  {
    id: 'styling',
    title: 'UI/UX & Styling',
    icon: Layout,
    color: 'from-navy-400 to-navy-600',
    skills: [
      { name: 'Tailwind CSS', level: 'Expert', years: 3, category: 'styling' },
      { name: 'SASS/SCSS', level: 'Advanced', years: 5, category: 'styling' },
      { name: 'Material UI', level: 'Advanced', years: 4, category: 'styling' },
      {
        name: 'Framer Motion',
        level: 'Advanced',
        years: 2,
        category: 'styling',
      },
      {
        name: 'Responsive Design',
        level: 'Expert',
        years: 7,
        category: 'styling',
      },
      { name: 'Figma', level: 'Intermediate', years: 3, category: 'styling' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Database',
    icon: Database,
    color: 'from-success-400 to-success-600',
    skills: [
      { name: 'Node.js', level: 'Advanced', years: 4, category: 'backend' },
      {
        name: 'Express.js',
        level: 'Intermediate',
        years: 3,
        category: 'backend',
      },
      {
        name: 'PostgreSQL',
        level: 'Intermediate',
        years: 3,
        category: 'backend',
      },
      { name: 'MongoDB', level: 'Intermediate', years: 2, category: 'backend' },
      { name: 'GraphQL', level: 'Intermediate', years: 2, category: 'backend' },
      { name: 'RESTful APIs', level: 'Expert', years: 5, category: 'backend' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & DevOps',
    icon: Wrench,
    color: 'from-warning-400 to-warning-600',
    skills: [
      { name: 'Git/GitHub', level: 'Expert', years: 7, category: 'tools' },
      { name: 'Docker', level: 'Intermediate', years: 2, category: 'tools' },
      { name: 'CI/CD', level: 'Intermediate', years: 3, category: 'tools' },
      { name: 'Webpack/Vite', level: 'Advanced', years: 4, category: 'tools' },
      { name: 'Jest/Testing', level: 'Advanced', years: 4, category: 'tools' },
      { name: 'AWS Basics', level: 'Learning', years: 2, category: 'tools' },
    ],
  },
];

function SkillTierIndicator({ level }: { level: SkillLevel }) {
  const filled = TIER_DOTS[level];
  return (
    <div className="flex items-center gap-1.5" title={TIER_DESCRIPTIONS[level]}>
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className={cn(
            'h-2 w-2 rounded-full transition-all duration-300',
            i < filled
              ? `bg-gradient-to-br ${TIER_COLORS[level]}`
              : 'bg-muted border border-border'
          )}
          aria-hidden="true"
        />
      ))}
      <span className="text-xs font-medium text-muted-foreground ml-1">
        {level}
      </span>
    </div>
  );
}

export function SkillsGrid() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );

  const filteredCategories = selectedCategory
    ? skillCategories.filter(cat => cat.id === selectedCategory)
    : skillCategories;

  const filterItems = [
    { id: null, title: 'All Skills' },
    ...skillCategories.map(c => ({ id: c.id, title: c.title })),
  ];

  const handleFilterKeyDown = (e: React.KeyboardEvent, currentIdx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (currentIdx + 1) % filterItems.length;
      setSelectedCategory(filterItems[next]!.id);
      (e.currentTarget.parentElement?.children[next] as HTMLElement)?.focus();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (currentIdx - 1 + filterItems.length) % filterItems.length;
      setSelectedCategory(filterItems[prev]!.id);
      (e.currentTarget.parentElement?.children[prev] as HTMLElement)?.focus();
    }
  };

  return (
    <div ref={ref} className="space-y-8">
      {/* Category Filter */}
      <div
        role="tablist"
        aria-label="Filter skills by category"
        className="flex flex-wrap gap-2 justify-center"
      >
        {filterItems.map((item, idx) => {
          const isSelected = selectedCategory === item.id;
          return (
            <button
              key={String(item.id)}
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedCategory(item.id)}
              onKeyDown={e => handleFilterKeyDown(e, idx)}
              className={cn(
                'rounded-full px-3 py-1 text-sm font-medium transition-all hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'border border-border text-muted-foreground hover:text-foreground'
              )}
            >
              {item.title}
            </button>
          );
        })}
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCategories.map((category, categoryIndex) => {
          const Icon = category.icon;

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: categoryIndex * 0.1 }}
              layout
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg bg-gradient-to-br ${category.color} text-white`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <span>{category.title}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.div
                      key={skill.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        delay: categoryIndex * 0.1 + skillIndex * 0.05,
                      }}
                      className="flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-medium truncate">
                          {skill.name}
                        </span>
                        {skill.years && (
                          <span className="text-xs text-muted-foreground shrink-0">
                            {skill.years}y
                          </span>
                        )}
                      </div>
                      <SkillTierIndicator level={skill.level} />
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Skills Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8"
      >
        <StatCard
          icon={Code2}
          label="Technologies"
          value="24+"
          color="text-mocha-600"
        />
        <StatCard
          icon={TrendingUp}
          label="Years Experience"
          value={`${new Date().getFullYear() - 2018}+`}
          color="text-navy-600"
        />
        <StatCard
          icon={Sparkles}
          label="Expert Skills"
          value="8"
          color="text-success-600"
        />
        <StatCard
          icon={Users}
          label="Teams Led"
          value="5+"
          color="text-warning-600"
        />
      </motion.div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="text-center hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <Icon className={`h-8 w-8 mx-auto mb-2 ${color}`} />
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </CardContent>
    </Card>
  );
}
