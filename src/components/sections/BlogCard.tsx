'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { BlogPostMeta } from '@/lib/mdx';
import { Clock, ArrowRight, BookOpen } from 'lucide-react';
import { MetaItem } from '@/components/ui/MetaItem';
import Link from 'next/link';
import Image from 'next/image';

interface BlogCardProps {
  post: BlogPostMeta;
  index: number;
  featured?: boolean;
}

export const BlogCard = React.memo(function BlogCard({
  post,
  index,
  featured = false,
}: BlogCardProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -5 }}
      whileTap={{ y: 0, scale: 0.98 }}
      className="h-full"
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group">
          {/* Cover Image */}
          <div
            className={`relative bg-muted overflow-hidden ${featured ? 'h-72' : 'h-48'}`}
          >
            {!imageError ? (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted to-muted-foreground/10" />
                )}
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  placeholder={post.blurDataURL ? 'blur' : 'empty'}
                  {...(post.blurDataURL
                    ? { blurDataURL: post.blurDataURL }
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
              <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gradient-to-br from-primary/10 to-primary/5">
                <BookOpen className="h-12 w-12" />
              </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge variant="secondary" className="bg-background/90">
                {post.category}
              </Badge>
            </div>

            {/* Series Badge */}
            {post.series && (
              <div className="absolute top-3 right-3">
                <Badge variant="outline" className="bg-background/90">
                  Part {post.series.part}/{post.series.total}
                </Badge>
              </div>
            )}

            {/* Reading length indicator bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
              <div
                className="h-full bg-primary/80 transition-all duration-300"
                style={{
                  width: `${Math.min(100, (post.readingTime / 15) * 100)}%`,
                }}
              />
            </div>
          </div>

          {/* Content */}
          <CardContent className="flex-1 pt-4 space-y-3">
            {/* Title */}
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {post.title}
            </h3>

            {/* Excerpt */}
            <p
              className={`text-sm text-muted-foreground ${featured ? 'line-clamp-4' : 'line-clamp-3'}`}
            >
              {post.excerpt}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" size="sm">
                  {tag}
                </Badge>
              ))}
              {post.tags.length > 3 && (
                <Badge variant="outline" size="sm">
                  +{post.tags.length - 3}
                </Badge>
              )}
            </div>
          </CardContent>

          {/* Footer */}
          <CardFooter className="pt-0">
            <div className="w-full flex items-center justify-between text-sm text-muted-foreground">
              <span>{formattedDate}</span>
              <div className="flex items-center gap-2">
                <MetaItem icon={Clock}>{post.readingTime} min read</MetaItem>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          </CardFooter>
        </Card>
      </Link>
    </motion.div>
  );
});

BlogCard.displayName = 'BlogCard';
