'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
  Users,
  Briefcase,
} from 'lucide-react';

interface AvailabilityData {
  status: 'available' | 'limited' | 'busy';
  nextAvailable: string;
  currentLoad: number; // percentage
  preferredProjects: string[];
  estimatedResponse: string;
  acceptingNew: boolean;
}

export function AvailabilityStatus() {
  const [availability] = React.useState<AvailabilityData>({
    status: 'available',
    nextAvailable: 'Immediately',
    currentLoad: 65,
    preferredProjects: ['React Applications', 'SaaS Platforms', 'UI/UX Design'],
    estimatedResponse: '< 24 hours',
    acceptingNew: true,
  });

  const statusConfig = {
    available: {
      color: 'text-success-600 dark:text-success-500',
      bgColor: 'bg-success-50 dark:bg-[var(--card)]',
      borderColor: 'border-success-200 dark:border-success-500',
      icon: CheckCircle,
      text: 'Available for new projects',
      pulse: true,
    },
    limited: {
      color: 'text-warning-600 dark:text-warning-500',
      bgColor: 'bg-warning-50 dark:bg-[var(--card)]',
      borderColor: 'border-warning-200 dark:border-warning-500',
      icon: AlertCircle,
      text: 'Limited availability',
      pulse: false,
    },
    busy: {
      color: 'text-error-600 dark:text-error-500',
      bgColor: 'bg-error-50 dark:bg-[var(--card)]',
      borderColor: 'border-error-200 dark:border-error-500',
      icon: AlertCircle,
      text: 'Currently at capacity',
      pulse: false,
    },
  };

  const config = statusConfig[availability.status];
  const Icon = config.icon;

  return (
    <Card className={`${config.bgColor} ${config.borderColor} border-2`}>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {/* Main Status */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Icon className={`h-6 w-6 ${config.color}`} />
                {config.pulse && (
                  <div className="absolute inset-0">
                    <Icon className={`h-6 w-6 ${config.color} animate-ping`} />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-lg">{config.text}</h3>
                <p className="text-sm text-muted-foreground">
                  Next availability: {availability.nextAvailable}
                </p>
              </div>
            </div>

            {availability.acceptingNew && (
              <Badge variant="success" className="hidden sm:inline-flex">
                <Zap className="mr-1 h-3 w-3" />
                Accepting Projects
              </Badge>
            )}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span className="text-xs">Response Time</span>
              </div>
              <p className="text-sm font-semibold">
                {availability.estimatedResponse}
              </p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <TrendingUp className="h-3 w-3" />
                <span className="text-xs">Current Load</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-mocha-500 to-navy-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${availability.currentLoad}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <span className="text-sm font-semibold">
                  {availability.currentLoad}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Users className="h-3 w-3" />
                <span className="text-xs">Active Projects</span>
              </div>
              <p className="text-sm font-semibold">3 ongoing</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span className="text-xs">Booking</span>
              </div>
              <p className="text-sm font-semibold">2-3 weeks out</p>
            </div>
          </div>

          {/* Preferred Projects */}
          <div>
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              Currently interested in:
            </p>
            <div className="flex flex-wrap gap-2">
              {availability.preferredProjects.map(project => (
                <Badge key={project} variant="secondary">
                  {project}
                </Badge>
              ))}
              <Badge variant="outline">+ More</Badge>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="pt-4 border-t flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-success-600" />
              <span>15+ projects completed</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-success-600" />
              <span>99% on-time delivery</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-success-600" />
              <span>5-star average rating</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
