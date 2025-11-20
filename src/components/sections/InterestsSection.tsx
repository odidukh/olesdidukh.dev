'use client';

import * as React from 'react';
import { motion, useInView } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import {
  Cpu,
  BookOpen,
  Music,
  Camera,
  Gamepad2,
  Plane,
  Brain,
  Dumbbell,
} from 'lucide-react';

interface Interest {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  color: string;
}

const interests: Interest[] = [
  {
    id: 'physics',
    name: 'Physics & Science',
    icon: Cpu,
    description: 'Quantum mechanics and computational physics',
    color: 'from-purple-400 to-purple-600',
  },
  {
    id: 'travel',
    name: 'Travel',
    icon: Plane,
    description: 'Exploring new cultures and places',
    color: 'from-blue-400 to-blue-600',
  },
  {
    id: 'reading',
    name: 'Reading',
    icon: BookOpen,
    description: 'Tech blogs, sci-fi, and philosophy',
    color: 'from-green-400 to-green-600',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: Gamepad2,
    description: 'Strategy and puzzle games',
    color: 'from-pink-400 to-pink-600',
  },
  {
    id: 'music',
    name: 'Music',
    icon: Music,
    description: 'Electronic and classical music',
    color: 'from-yellow-400 to-yellow-600',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    icon: Dumbbell,
    description: 'Running and outdoor activities',
    color: 'from-red-400 to-red-600',
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: Camera,
    description: 'Capturing moments and nature',
    color: 'from-indigo-400 to-indigo-600',
  },
  {
    id: 'learning',
    name: 'Learning',
    icon: Brain,
    description: 'Always exploring new technologies',
    color: 'from-orange-400 to-orange-600',
  },
];

export function InterestsSection() {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {interests.map((interest, index) => {
        const Icon = interest.icon;
        const isHovered = hoveredId === interest.id;

        return (
          <motion.div
            key={interest.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
              delay: index * 0.05,
              type: 'spring',
              stiffness: 100,
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setHoveredId(interest.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            <Card className="h-full cursor-pointer overflow-hidden group">
              <CardContent className="p-6 relative">
                {/* Background Gradient */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${interest.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                />

                {/* Icon */}
                <div className="relative z-10">
                  <motion.div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${interest.color} p-2.5 text-white mb-3 mx-auto`}
                    animate={isHovered ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    <Icon className="w-full h-full" />
                  </motion.div>

                  {/* Content */}
                  <h4 className="font-semibold text-center mb-1">
                    {interest.name}
                  </h4>
                  <p className="text-xs text-muted-foreground text-center">
                    {interest.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
