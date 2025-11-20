'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Code2,
  Layout,
  Database,
  Wrench,
  Users,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

interface Skill {
  name: string;
  level: number; // 0-100
  years?: number;
  category: string;
}

interface SkillCategory {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    id: 'frontend',
    title: 'Frontend Development',
    icon: Code2,
    color: 'from-mocha-400 to-mocha-600',
    skills: [
      { name: 'React.js', level: 95, years: 5, category: 'frontend' },
      { name: 'TypeScript', level: 90, years: 3, category: 'frontend' },
      { name: 'Next.js', level: 85, years: 2, category: 'frontend' },
      { name: 'JavaScript ES6+', level: 95, years: 7, category: 'frontend' },
      { name: 'HTML5/CSS3', level: 95, years: 7, category: 'frontend' },
      { name: 'Redux/Zustand', level: 90, years: 4, category: 'frontend' },
    ],
  },
  {
    id: 'styling',
    title: 'UI/UX & Styling',
    icon: Layout,
    color: 'from-navy-400 to-navy-600',
    skills: [
      { name: 'Tailwind CSS', level: 90, years: 3, category: 'styling' },
      { name: 'SASS/SCSS', level: 85, years: 5, category: 'styling' },
      { name: 'Material UI', level: 85, years: 4, category: 'styling' },
      { name: 'Framer Motion', level: 80, years: 2, category: 'styling' },
      { name: 'Responsive Design', level: 95, years: 7, category: 'styling' },
      { name: 'Figma', level: 75, years: 3, category: 'styling' },
    ],
  },
  {
    id: 'backend',
    title: 'Backend & Database',
    icon: Database,
    color: 'from-success-400 to-success-600',
    skills: [
      { name: 'Node.js', level: 80, years: 4, category: 'backend' },
      { name: 'Express.js', level: 75, years: 3, category: 'backend' },
      { name: 'PostgreSQL', level: 70, years: 3, category: 'backend' },
      { name: 'MongoDB', level: 65, years: 2, category: 'backend' },
      { name: 'GraphQL', level: 70, years: 2, category: 'backend' },
      { name: 'RESTful APIs', level: 90, years: 5, category: 'backend' },
    ],
  },
  {
    id: 'tools',
    title: 'Tools & DevOps',
    icon: Wrench,
    color: 'from-warning-400 to-warning-600',
    skills: [
      { name: 'Git/GitHub', level: 90, years: 7, category: 'tools' },
      { name: 'Docker', level: 70, years: 2, category: 'tools' },
      { name: 'CI/CD', level: 75, years: 3, category: 'tools' },
      { name: 'Webpack/Vite', level: 80, years: 4, category: 'tools' },
      { name: 'Jest/Testing', level: 85, years: 4, category: 'tools' },
      { name: 'AWS Basics', level: 65, years: 2, category: 'tools' },
    ],
  },
];

export function SkillsGrid() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [hoveredSkill, setHoveredSkill] = React.useState<string | null>(null);

  const filteredCategories = selectedCategory
    ? skillCategories.filter(cat => cat.id === selectedCategory)
    : skillCategories;

  return (
    <div ref={ref} className="space-y-8">
      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Badge
          variant={selectedCategory === null ? 'default' : 'outline'}
          className="cursor-pointer transition-all hover:scale-105"
          onClick={() => setSelectedCategory(null)}
        >
          All Skills
        </Badge>
        {skillCategories.map(category => (
          <Badge
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            className="cursor-pointer transition-all hover:scale-105"
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.title}
          </Badge>
        ))}
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
                      onMouseEnter={() => setHoveredSkill(skill.name)}
                      onMouseLeave={() => setHoveredSkill(null)}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {skill.name}
                          </span>
                          {skill.years && (
                            <span className="text-xs text-muted-foreground">
                              ({skill.years}y)
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {skill.level}%
                        </span>
                      </div>

                      <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className={`absolute inset-y-0 left-0 bg-gradient-to-r ${category.color} rounded-full`}
                          initial={{ width: 0 }}
                          animate={
                            isInView
                              ? { width: `${skill.level}%` }
                              : { width: 0 }
                          }
                          transition={{
                            duration: 1,
                            delay: categoryIndex * 0.1 + skillIndex * 0.05,
                            ease: 'easeOut',
                          }}
                        >
                          {hoveredSkill === skill.name && (
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              initial={{ x: '-100%' }}
                              animate={{ x: '100%' }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: 'linear',
                              }}
                            />
                          )}
                        </motion.div>
                      </div>
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
          value="7+"
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
  icon: React.ElementType;
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
