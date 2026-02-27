'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import type { BlogPostMeta } from '@/lib/mdx';
import { Clock, ArrowRight, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface FeaturedPostProps {
  post: BlogPostMeta;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Link href={`/blog/${post.slug}`}>
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full">
          <div className="grid grid-cols-1 md:grid-cols-2 h-full">
            {/* Image Side */}
            <div className="relative h-64 md:h-full bg-muted overflow-hidden">
              {!imageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-muted to-muted-foreground/10" />
              )}
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                placeholder={post.blurDataURL ? 'blur' : 'empty'}
                {...(post.blurDataURL ? { blurDataURL: post.blurDataURL } : {})}
                sizes="(max-width: 768px) 100vw, 50vw"
                className={`object-cover transition-all duration-700 group-hover:scale-110 ${
                  imageLoaded ? 'opacity-100' : 'opacity-0'
                }`}
                onLoad={() => setImageLoaded(true)}
              />

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent md:bg-gradient-to-r md:from-black/80 md:via-black/40 md:to-transparent" />

              {/* Featured Badge */}
              <div className="absolute top-4 left-4">
                <Badge className="bg-yellow-500 text-yellow-900">
                  <Star className="mr-1 h-3 w-3 fill-current" />
                  Featured
                </Badge>
              </div>
            </div>

            {/* Content Side */}
            <div className="p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Category and Reading Time */}
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {post.readingTime} min read
                  </span>
                  {post.series && (
                    <Badge variant="secondary">
                      Series: Part {post.series.part}/{post.series.total}
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 4).map(tag => (
                    <Badge key={tag} variant="secondary" size="sm">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 space-y-4">
                {/* Author and Date */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden">
                      <Image
                        src={post.author.avatar}
                        alt={post.author.name}
                        fill
                        sizes="40px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{post.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formattedDate}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Read More Button */}
                <Button className="w-full group/button" variant="outline">
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/button:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}
