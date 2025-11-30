'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProjectCard } from './ProjectCard';
import { projectsData } from '@/data/projects';
import { useProjectsFilterStore } from '@/stores';
import { Search, Filter, Grid3x3, List, Sparkles, X } from 'lucide-react';
import {
  PROJECT_CATEGORIES,
  PROJECT_TECHNOLOGIES,
} from '@/config/project-filters';
import { ALL_FILTER } from '@/constants';

export function ProjectsSection() {
  // Use global filter store for persistent state
  const {
    selectedCategory,
    setSelectedCategory,
    selectedTechnologies,
    toggleTechnology,
    searchQuery,
    setSearchQuery,
    viewMode,
    setViewMode,
    showFilters,
    toggleShowFilters,
    clearFilters,
  } = useProjectsFilterStore();

  // Filter projects based on category, technologies, and search
  const filteredProjects = React.useMemo(() => {
    return projectsData.filter(project => {
      // Category filter
      if (
        selectedCategory !== ALL_FILTER &&
        project.category !== selectedCategory
      ) {
        return false;
      }

      // Technology filter
      if (
        selectedTechnologies.length > 0 &&
        !selectedTechnologies.some(tech => project.technologies.includes(tech))
      ) {
        return false;
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          project.title.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query) ||
          project.technologies.some(tech => tech.toLowerCase().includes(query))
        );
      }

      return true;
    });
  }, [selectedCategory, selectedTechnologies, searchQuery]);

  const activeFiltersCount =
    (selectedCategory !== ALL_FILTER ? 1 : 0) +
    selectedTechnologies.length +
    (searchQuery ? 1 : 0);

  return (
    <section className="py-20" id="projects">
      <Container size="wide" padding="lg">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <Badge variant="outline" className="mb-4">
              <Sparkles className="mr-2 h-3 w-3" />
              Portfolio
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold">
              Featured{' '}
              <span className="bg-gradient-to-r from-mocha-500 to-accent-green bg-clip-text text-transparent">
                Projects
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              A showcase of my best work, from enterprise applications to
              open-source contributions. Each project demonstrates my commitment
              to quality, performance, and user experience.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10"
                  size="lg"
                />
              </div>
            </div>

            {/* Filter Toggle & View Mode */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={toggleShowFilters}
                className="relative"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              <div className="flex gap-1 border rounded-lg p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="px-3"
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="px-3"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="p-6 bg-muted/50 rounded-xl space-y-6">
                  {/* Categories */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_CATEGORIES.map(category => (
                        <Badge
                          key={category}
                          variant={
                            selectedCategory === category
                              ? 'default'
                              : 'outline'
                          }
                          className="cursor-pointer transition-all hover:scale-105"
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Technologies */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                      Technologies
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {PROJECT_TECHNOLOGIES.map(tech => (
                        <Badge
                          key={tech}
                          variant={
                            selectedTechnologies.includes(tech)
                              ? 'default'
                              : 'outline'
                          }
                          className="cursor-pointer transition-all hover:scale-105"
                          onClick={() => toggleTechnology(tech)}
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  {activeFiltersCount > 0 && (
                    <div className="flex justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearFilters}
                        className="text-muted-foreground"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Clear all filters
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && !showFilters && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Active filters:
              </span>
              {selectedCategory !== ALL_FILTER && (
                <Badge variant="secondary">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory(ALL_FILTER)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {selectedTechnologies.map(tech => (
                <Badge key={tech} variant="secondary">
                  {tech}
                  <button
                    onClick={() => toggleTechnology(tech)}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {searchQuery && (
                <Badge variant="secondary">
                  Search: {searchQuery}
                  <button
                    onClick={() => setSearchQuery('')}
                    className="ml-2 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}

          {/* Results Count */}
          <div className="text-sm text-muted-foreground">
            Showing {filteredProjects.length} of {projectsData.length} projects
          </div>

          {/* Projects Grid/List */}
          <AnimatePresence mode="wait">
            {filteredProjects.length > 0 ? (
              <motion.div
                key={viewMode}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-6'
                }
              >
                {filteredProjects.map((project, index) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={index}
                    viewMode={viewMode}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-muted-foreground">
                  No projects found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={clearFilters}
                  className="mt-4"
                >
                  Clear filters
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </section>
  );
}
