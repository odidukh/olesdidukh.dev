'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  GraduationCap,
  Code,
  Users,
  Zap,
  TrendingUp,
  Calendar,
  MapPin,
  type LucideIcon,
} from 'lucide-react';
import { MetaItem } from '@/components/ui/MetaItem';

interface TimelineItem {
  id: number;
  type: 'work' | 'education';
  title: string;
  company: string;
  location: string;
  period: string;
  description: string[];
  technologies?: string[];
  achievements?: string[];
  icon: LucideIcon;
}

const timelineData: TimelineItem[] = [
  {
    id: 1,
    type: 'work',
    title: 'Senior Front-End Engineer',
    company: 'Safebooks AI',
    location: 'Remote',
    period: '2023 - Present',
    description: [
      'Leading front-end development for AI-powered bookkeeping platform',
      'Architecting scalable React/TypeScript solutions for 10,000+ users',
      'Reduced bundle size by 35% through code splitting and optimization',
      'Mentoring junior developers and conducting code reviews',
    ],
    technologies: [
      'React',
      'TypeScript',
      'Next.js',
      'Redux Toolkit',
      'TailwindCSS',
    ],
    achievements: [
      '40% performance improvement',
      '99.9% uptime',
      'Team productivity +25%',
    ],
    icon: Zap,
  },
  {
    id: 2,
    type: 'work',
    title: 'Senior Front-End Developer',
    company: 'Emerline',
    location: 'Vinnytsia, Ukraine',
    period: '2021 - 2023',
    description: [
      'Developed enterprise-level web applications for international clients',
      'Led a team of 5 developers on multiple concurrent projects',
      'Implemented CI/CD pipelines reducing deployment time by 60%',
      'Created reusable component library used across 8 projects',
    ],
    technologies: ['React', 'Vue.js', 'TypeScript', 'GraphQL', 'Docker'],
    achievements: [
      '8 successful launches',
      '$2M+ project value',
      '100% on-time delivery',
    ],
    icon: Users,
  },
  {
    id: 3,
    type: 'work',
    title: 'Middle Front-End Developer',
    company: 'Inango Systems',
    location: 'Vinnytsia, Ukraine',
    period: '2019 - 2021',
    description: [
      'Built responsive web interfaces for ISP management platform',
      'Migrated legacy jQuery codebase to modern React architecture',
      'Improved application performance by 40% through optimization',
      'Collaborated with backend team on RESTful API design',
    ],
    technologies: ['React', 'Redux', 'JavaScript', 'jQuery', 'Webpack'],
    achievements: [
      '50,000+ active users',
      '40% faster load times',
      'Zero critical bugs',
    ],
    icon: TrendingUp,
  },
  {
    id: 4,
    type: 'work',
    title: 'Junior Front-End Developer',
    company: 'Helios Technologies',
    location: 'Vinnytsia, Ukraine',
    period: '2018 - 2019',
    description: [
      'Developed responsive websites for local businesses',
      'Implemented pixel-perfect designs from Figma mockups',
      'Learned React.js and modern JavaScript development',
      'Participated in agile development processes',
    ],
    technologies: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Git'],
    icon: Code,
  },
  {
    id: 5,
    type: 'education',
    title: 'Programming School (École 42 Network)',
    company: 'UNIT Factory',
    location: 'Kyiv, Ukraine',
    period: '2017 - 2019',
    description: [
      'Selected from 13,000+ applicants for innovative peer-to-peer program',
      'Completed intensive C/C++ curriculum with algorithms and data structures',
      'Developed 20+ projects including shell, ray tracer, and web server',
      'Mastered self-learning and collaborative problem-solving',
    ],
    achievements: [
      'Top 10% of cohort',
      '60+ hour weeks',
      'Zero teacher instruction',
    ],
    icon: GraduationCap,
  },
  {
    id: 6,
    type: 'education',
    title: "Master's Degree in Physics",
    company: 'Taras Shevchenko University',
    location: 'Kyiv, Ukraine',
    period: '2016 - 2018',
    description: [
      'Specialized in computational physics and data analysis',
      'Thesis: "Thermal conductivity in silicon nanowires"',
      'Co-authored 3 peer-reviewed scientific publications',
      'Developed analytical and problem-solving skills',
    ],
    icon: GraduationCap,
  },
];

export function Timeline() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <div ref={ref} className="relative">
      {/* Timeline Line */}
      <div className="timeline-line absolute left-8 md:left-1/2 top-0 bottom-0 transform -translate-x-1/2" />

      {/* Timeline Items */}
      <div className="space-y-12">
        {timelineData.map((item, index) => {
          const isLeft = index % 2 === 0;
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`relative flex items-center ${
                isLeft ? 'md:justify-start' : 'md:justify-end'
              }`}
            >
              {/* Mobile Layout */}
              <div className="md:hidden w-full pl-16">
                <TimelineCard item={item} />
              </div>

              {/* Desktop Layout */}
              <div className="hidden md:flex w-full items-center">
                {isLeft ? (
                  <>
                    <div className="w-1/2 pr-8 text-right">
                      <TimelineCard item={item} />
                    </div>
                    <div className="w-1/2 pl-8" />
                  </>
                ) : (
                  <>
                    <div className="w-1/2 pr-8" />
                    <div className="w-1/2 pl-8">
                      <TimelineCard item={item} />
                    </div>
                  </>
                )}
              </div>

              {/* Timeline Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1 + 0.2, type: 'spring' }}
                className="timeline-icon absolute left-8 md:left-1/2 transform -translate-x-1/2 w-12 h-12 rounded-full flex items-center justify-center z-10"
              >
                <Icon className="h-5 w-5" />
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function TimelineCard({ item }: { item: TimelineItem }) {
  return (
    <Card className="timeline-card">
      <CardContent className="pt-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h4 className="text-lg font-semibold">{item.title}</h4>
            <p className="timeline-company text-mocha-600 dark:text-mocha-400 font-medium">
              {item.company}
            </p>
            <div className="flex items-center gap-4 mt-1">
              <MetaItem icon={Calendar}>{item.period}</MetaItem>
              <MetaItem icon={MapPin}>{item.location}</MetaItem>
            </div>
          </div>
          <Badge
            variant={item.type === 'work' ? 'default' : 'secondary'}
            className="ml-4"
          >
            {item.type === 'work' ? 'Work' : 'Education'}
          </Badge>
        </div>

        {/* Description */}
        <ul className="space-y-2 mb-4">
          {item.description.map((desc, index) => (
            <li
              key={index}
              className="text-sm text-muted-foreground flex items-start gap-2"
            >
              <div className="timeline-bullet w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" />
              <span>{desc}</span>
            </li>
          ))}
        </ul>

        {/* Technologies */}
        {item.technologies && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {item.technologies.map(tech => (
              <Badge key={tech} variant="outline" size="sm">
                {tech}
              </Badge>
            ))}
          </div>
        )}

        {/* Achievements */}
        {item.achievements && (
          <div className="pt-3 border-t">
            <div className="flex flex-wrap gap-3 text-xs">
              {item.achievements.map((achievement, index) => (
                <span key={index} className="timeline-achievement font-medium">
                  ✓ {achievement}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
