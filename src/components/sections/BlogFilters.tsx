'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { blogPosts } from '@/data/blog';
import { ALL_FILTER } from '@/constants';
import { X, Hash, Folder } from 'lucide-react';

interface BlogFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: readonly string[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

/**
 * Blog filters component for category and tag filtering.
 * Memoized to prevent unnecessary re-renders when parent state changes.
 */
export const BlogFilters = React.memo(function BlogFilters({
  selectedCategory,
  onCategoryChange,
  categories,
  searchQuery,
  onSearchChange,
}: BlogFiltersProps) {
  // Get all unique tags with counts
  const tagCounts = React.useMemo(() => {
    const counts: Record<string, number> = {};
    blogPosts.forEach(post => {
      post.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  }, []);

  const popularTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
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
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Categories
          </h3>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => {
              const count =
                category === ALL_FILTER
                  ? blogPosts.length
                  : blogPosts.filter(p => p.category === category).length;

              return (
                <Badge
                  key={category}
                  variant={
                    selectedCategory === category ? 'default' : 'outline'
                  }
                  className="cursor-pointer transition-all hover:scale-105"
                  onClick={() => onCategoryChange(category)}
                >
                  {category}
                  <span className="ml-1 text-xs opacity-60">({count})</span>
                </Badge>
              );
            })}
          </div>
        </div>

        {/* Popular Tags */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Popular Tags
          </h3>
          <div className="flex flex-wrap gap-2">
            {popularTags.map(([tag, count]) => (
              <Badge
                key={tag}
                variant={searchQuery === tag ? 'default' : 'secondary'}
                className="cursor-pointer transition-all hover:scale-105"
                onClick={() => onSearchChange(searchQuery === tag ? '' : tag)}
              >
                {tag}
                <span className="ml-1 text-xs opacity-60">({count})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Year Filter */}
        <div>
          <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
            Archive
          </h3>
          <div className="flex gap-2">
            {['2024', '2023'].map(year => (
              <Button
                key={year}
                variant={searchQuery === `year:${year}` ? 'default' : 'outline'}
                size="sm"
                onClick={() => onSearchChange(searchQuery === `year:${year}` ? '' : `year:${year}`)}
              >
                {year}
              </Button>
            ))}
            <Button
              variant={!searchQuery.startsWith('year:') ? 'default' : 'outline'}
              size="sm"
              onClick={() => onSearchChange('')}
            >
              All Time
            </Button>
          </div>
        </div>

        {/* Clear Filters */}
        {selectedCategory !== ALL_FILTER && (
          <div className="flex justify-end pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onCategoryChange(ALL_FILTER)}
              className="text-muted-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
});

BlogFilters.displayName = 'BlogFilters';
