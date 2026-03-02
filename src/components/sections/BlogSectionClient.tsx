'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { BlogCard } from './BlogCard';
import { FeaturedPost } from './FeaturedPost';
import { BlogFilters } from './BlogFilters';
import { NewsletterSignup } from './NewsletterSignup';
import {
  blogCategories,
  getFeaturedPosts,
  getPostsByCategory,
  searchPosts,
  type BlogPost,
} from '@/data/blog';
import { useBlogFilterStore } from '@/stores';
import {
  Search,
  SearchX,
  BookOpen,
  TrendingUp,
  Calendar,
  Filter,
  Sparkles,
} from 'lucide-react';

interface BlogSectionClientProps {
  initialPosts: BlogPost[];
}

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
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

export function BlogSectionClient({ initialPosts }: BlogSectionClientProps) {
  // Use global filter store for persistent state
  const {
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    showFilters,
    toggleShowFilters,
    sortBy,
    setSortBy,
    clearFilters,
    resetAll,
  } = useBlogFilterStore();

  // Get featured posts
  const featuredPosts = getFeaturedPosts();

  // Filter and sort posts
  const filteredPosts = React.useMemo(() => {
    let posts = searchQuery
      ? searchPosts(searchQuery)
      : getPostsByCategory(selectedCategory);

    // Sort posts
    switch (sortBy) {
      case 'popular':
        posts = [...posts].sort((a, b) => (b.views || 0) - (a.views || 0));
        break;
      case 'trending': {
        const now = Date.now();
        posts = [...posts].sort((a, b) => {
          const daysA = Math.max(
            1,
            (now - new Date(a.publishedAt).getTime()) / 86_400_000
          );
          const daysB = Math.max(
            1,
            (now - new Date(b.publishedAt).getTime()) / 86_400_000
          );
          return (b.views || 0) / daysB - (a.views || 0) / daysA;
        });
        break;
      }
      case 'latest':
      default:
        posts = [...posts].sort(
          (a, b) =>
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
        );
    }

    return posts;
  }, [selectedCategory, searchQuery, sortBy]);

  // Blog stats
  const totalPosts = initialPosts.length;
  const totalReadingTime = initialPosts.reduce(
    (sum, post) => sum + (post.readingTime || 5),
    0
  );

  return (
    <section className="py-20 md:py-28" id="blog">
      <Container size="wide" padding="lg">
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
              <BookOpen className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Blog</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              Thoughts on{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-mocha-400">
                Code & Career
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sharing insights on React, TypeScript, web development best
              practices, and lessons learned from my journey as a senior
              front-end engineer.
            </p>

            {/* Blog Stats */}
            <div className="flex justify-center gap-8 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-mocha-600 dark:text-mocha-400">
                  {totalPosts}
                </div>
                <div className="text-xs text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success-600 dark:text-success-400">
                  {totalReadingTime}
                </div>
                <div className="text-xs text-muted-foreground">Min Read</div>
              </div>
            </div>
          </motion.div>

          {/* Featured Posts */}
          {featuredPosts.length > 0 && (
            <motion.div variants={itemVariants} className="space-y-4">
              <h3 className="text-2xl font-semibold flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-warning-500" />
                Featured Articles
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {featuredPosts.slice(0, 2).map(post => (
                  <FeaturedPost key={post.slug} post={post} />
                ))}
              </div>
            </motion.div>
          )}

          {/* Search and Filters */}
          <motion.div variants={itemVariants} className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search articles..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="pl-10"
                    size="lg"
                    aria-label="Search articles"
                  />
                </div>
              </div>

              {/* Sort and Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={toggleShowFilters}>
                  <Filter className="mr-2 h-4 w-4" />
                  Filters
                </Button>

                <div className="flex gap-1 border rounded-lg p-1">
                  <Button
                    variant={sortBy === 'latest' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('latest')}
                    className="px-3"
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Latest
                  </Button>
                  <Button
                    variant={sortBy === 'popular' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('popular')}
                    className="px-3"
                  >
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Popular
                  </Button>
                  <Button
                    variant={sortBy === 'trending' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSortBy('trending')}
                    className="px-3"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    Trending
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
              {showFilters && (
                <BlogFilters
                  selectedCategory={selectedCategory}
                  onCategoryChange={setSelectedCategory}
                  categories={blogCategories}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Blog Grid */}
          <motion.div variants={itemVariants}>
            {filteredPosts.length > 0 ? (
              filteredPosts.length >= 3 ? (
                /* Bento layout: first post spans 2 columns */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post: BlogPost, index: number) =>
                    index === 0 ? (
                      /* Featured wide card */
                      <div
                        key={post.slug}
                        className="md:col-span-2 lg:col-span-2"
                      >
                        <BlogCard post={post} index={0} featured />
                      </div>
                    ) : (
                      <BlogCard key={post.slug} post={post} index={index} />
                    )
                  )}
                </div>
              ) : (
                /* Uniform grid for < 3 results */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post: BlogPost, index: number) => (
                    <BlogCard key={post.slug} post={post} index={index} />
                  ))}
                </div>
              )
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-20 text-center"
                role="status"
              >
                <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                  <SearchX className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  No articles found
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  {searchQuery
                    ? `No articles matched "${searchQuery}". Try adjusting your search or browse all posts.`
                    : 'No articles match your current filters. Try adjusting your search or browse all posts.'}
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                  <Button variant="ghost" onClick={resetAll}>
                    Browse All
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Load More */}
          {filteredPosts.length > 6 && (
            <motion.div variants={itemVariants} className="text-center">
              <Button variant="outline" size="lg">
                Load More Articles
              </Button>
            </motion.div>
          )}

          {/* Newsletter Signup */}
          <motion.div variants={itemVariants}>
            <NewsletterSignup />
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
