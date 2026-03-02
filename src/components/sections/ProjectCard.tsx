'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { Project } from '@/data/projects';
import {
  ExternalLink,
  Github,
  Calendar,
  Clock,
  Users,
  ArrowRight,
  Star,
} from 'lucide-react';
import { MetaItem } from '@/components/ui/MetaItem';
import Image from 'next/image';

interface ProjectCardProps {
  project: Project;
  index: number;
  viewMode: 'grid' | 'list';
}

export const ProjectCard = React.memo(function ProjectCard({
  project,
  index,
  viewMode,
}: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ x: 5 }}
        whileTap={{ x: 0, scale: 0.98 }}
      >
        <Link href={`/projects/${project.id}`}>
          <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
            <div className="flex flex-col md:flex-row gap-6 p-6">
              {/* Image */}
              <div className="md:w-48 h-32 md:h-36 rounded-lg overflow-hidden bg-muted relative shrink-0">
                {!imageError ? (
                  <>
                    {!imageLoaded && (
                      <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted to-muted-foreground/10" />
                    )}
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      placeholder={project.blurDataURL ? 'blur' : 'empty'}
                      {...(project.blurDataURL
                        ? { blurDataURL: project.blurDataURL }
                        : {})}
                      sizes="(max-width: 768px) 100vw, 192px"
                      className={`object-cover transition-opacity duration-300 ${
                        imageLoaded ? 'opacity-100' : 'opacity-0'
                      }`}
                      onLoad={() => setImageLoaded(true)}
                      onError={() => setImageError(true)}
                    />
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <span className="text-4xl font-bold">
                      {project.title[0]}
                    </span>
                  </div>
                )}
                {project.featured && (
                  <Badge
                    variant="secondary"
                    className="absolute top-2 right-2 gap-1 bg-warning-500/90 text-warning-900 text-xs"
                  >
                    <Star className="h-3 w-3 fill-current" />
                    Featured
                  </Badge>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
                    <Badge variant="outline">{project.category}</Badge>
                  </div>
                  <p className="text-muted-foreground mt-2 line-clamp-2">
                    {project.description}
                  </p>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-1.5">
                  {project.technologies.slice(0, 5).map(tech => (
                    <Badge key={tech} variant="secondary" size="sm">
                      {tech}
                    </Badge>
                  ))}
                  {project.technologies.length > 5 && (
                    <Badge variant="secondary" size="sm">
                      +{project.technologies.length - 5}
                    </Badge>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-4">
                  <MetaItem icon={Calendar}>{project.year}</MetaItem>
                  <MetaItem icon={Clock}>{project.duration}</MetaItem>
                  {project.team && (
                    <MetaItem icon={Users}>{project.team}</MetaItem>
                  )}
                </div>

                {/* Results Preview */}
                {project.results && project.results.length > 0 && (
                  <div className="flex gap-4 text-sm">
                    {project.results.slice(0, 2).map((result, idx) => (
                      <div
                        key={idx}
                        className="text-success-600 dark:text-success-400"
                      >
                        <span className="font-semibold">{result.value}</span>
                        <span className="text-muted-foreground ml-1">
                          {result.metric}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-2 md:justify-center">
                {project.liveUrl && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View ${project.title} live demo`}
                    onClick={e => {
                      e.stopPropagation();
                      window.open(project.liveUrl, '_blank');
                    }}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
                {project.githubUrl && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View ${project.title} on GitHub`}
                    onClick={e => {
                      e.stopPropagation();
                      window.open(project.githubUrl, '_blank');
                    }}
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </Link>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      whileTap={{ scale: 0.98 }}
      className="h-full"
    >
      <Link href={`/projects/${project.id}`} className="h-full block">
        <Card className="overflow-hidden hover:shadow-lg hover:shadow-primary/5 dark:hover:shadow-primary/10 hover:border-primary/30 dark:hover:border-primary/20 transition-all duration-300 cursor-pointer h-full flex flex-col group">
          {/* Image */}
          <div className="relative h-48 bg-muted overflow-hidden">
            {!imageError ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted to-muted-foreground/10" />
                )}
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  placeholder={project.blurDataURL ? 'blur' : 'empty'}
                  {...(project.blurDataURL
                    ? { blurDataURL: project.blurDataURL }
                    : {})}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageError(true)}
                />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-mocha-100 to-navy-100 dark:from-mocha-900 dark:to-navy-900">
                <span className="text-6xl font-bold opacity-20">
                  {project.title[0]}
                </span>
              </div>
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Featured Badge */}
            {project.featured && (
              <Badge
                variant="secondary"
                className="absolute top-3 right-3 gap-1 bg-warning-500/90 text-warning-900 text-xs shadow-lg"
              >
                <Star className="h-3 w-3 fill-current" />
                Featured
              </Badge>
            )}

            {/* Quick Actions */}
            <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {project.liveUrl && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/90 hover:bg-white"
                  aria-label={`View ${project.title} live demo`}
                  onClick={e => {
                    e.stopPropagation();
                    window.open(project.liveUrl, '_blank');
                  }}
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              )}
              {project.githubUrl && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="h-8 w-8 bg-white/90 hover:bg-white"
                  aria-label={`View ${project.title} on GitHub`}
                  onClick={e => {
                    e.stopPropagation();
                    window.open(project.githubUrl, '_blank');
                  }}
                >
                  <Github className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* Content */}
          <CardContent className="pt-4 flex-1 flex flex-col">
            {/* Header */}
            <div className="space-y-2 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {project.title}
                </h3>
                <Badge variant="outline" className="shrink-0">
                  {project.category}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-1 pt-2">
                {project.technologies.slice(0, 3).map(tech => (
                  <Badge key={tech} variant="secondary" size="sm">
                    {tech}
                  </Badge>
                ))}
                {project.technologies.length > 3 && (
                  <Badge variant="secondary" size="sm">
                    +{project.technologies.length - 3}
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="pt-0">
            <div className="w-full flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-3">
                <MetaItem icon={Calendar}>{project.year}</MetaItem>
                <MetaItem icon={Clock}>{project.duration}</MetaItem>
              </div>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
});

ProjectCard.displayName = 'ProjectCard';
