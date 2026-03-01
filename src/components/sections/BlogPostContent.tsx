'use client';

import * as React from 'react';
import { motion, useScroll } from 'framer-motion';
import { Container } from '@/components/ui/Container';
import { Badge } from '@/components/ui/Badge';
import { BlogCard } from '@/components/sections/BlogCard';
import { ViewCounter } from '@/components/ui/ViewCounter';
import { ReactionButton } from '@/components/ui/ReactionButton';
import { blogPosts, type BlogPost } from '@/data/blog';
import type { BlogPostMeta } from '@/lib/mdx';
import { sanitizeHtml } from '@/lib/sanitize';
import {
  Calendar,
  Clock,
  Share2,
  Bookmark,
  ArrowLeft,
  ArrowRight,
  Copy,
  Twitter,
  Linkedin,
  Facebook,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { usePageEngagement } from '@/hooks';
import { cn } from '@/lib/utils';

// Support both legacy BlogPost and new BlogPostMeta
type PostData =
  | BlogPost
  | (BlogPostMeta & { views?: number; likes?: number; id?: string });

interface TocItem {
  id: string;
  text: string;
  level: number;
}

function DynamicTableOfContents() {
  const [headings, setHeadings] = React.useState<TocItem[]>([]);
  const [activeId, setActiveId] = React.useState<string>('');

  React.useEffect(() => {
    // Extract h2 and h3 elements from the article content
    const article =
      document.querySelector('[data-mdx-content]') ??
      document.querySelector('article');
    if (!article) return;

    const elements = article.querySelectorAll('h2, h3');
    const items: TocItem[] = Array.from(elements).map(el => {
      // Ensure heading has an id for linking
      if (!el.id) {
        el.id =
          el.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '') ?? '';
      }
      return {
        id: el.id,
        text: el.textContent ?? '',
        level: el.tagName === 'H2' ? 2 : 3,
      };
    });
    setHeadings(items);

    // Set up IntersectionObserver for active heading tracking
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0.1 }
    );

    elements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  if (headings.length === 0) return null;

  return (
    <div className="sticky top-24">
      <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">
        On this page
      </h3>
      <nav className="space-y-1 text-sm">
        {headings.map(heading => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={e => {
              e.preventDefault();
              document.getElementById(heading.id)?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
              });
            }}
            className={cn(
              'block py-1 transition-colors border-l-2',
              heading.level === 3 ? 'pl-6' : 'pl-3',
              activeId === heading.id
                ? 'border-primary text-primary font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
            )}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

interface BlogPostContentProps {
  post: PostData;
  relatedPosts: (BlogPost | BlogPostMeta)[];
  mdxContent?: React.ReactNode;
}

export function BlogPostContent({
  post,
  relatedPosts,
  mdxContent,
}: BlogPostContentProps) {
  const [bookmarked, setBookmarked] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const [showShareMenu, setShowShareMenu] = React.useState(false);
  const copyTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const shareRef = React.useRef<HTMLDivElement>(null);

  // Track scroll depth and time on page for blog posts
  usePageEngagement();

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  // Close share menu when clicking outside
  React.useEffect(() => {
    if (!showShareMenu) return;
    const handler = (e: MouseEvent) => {
      if (!shareRef.current?.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showShareMenu]);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`,
  };

  const postId = post.slug;

  // Find previous post (chronological) and next post (topically related)
  const currentIndex = blogPosts.findIndex(p => p.slug === postId);
  const prevPost = currentIndex > 0 ? blogPosts[currentIndex - 1] : null;
  // Prefer topically related post for forward navigation; fall back to positional
  const nextPost =
    (relatedPosts[0] as BlogPost | null) ??
    (currentIndex < blogPosts.length - 1 ? blogPosts[currentIndex + 1] : null);

  const { scrollYProgress } = useScroll();
  const prefersReducedMotion = React.useMemo(
    () =>
      typeof window !== 'undefined'
        ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
        : false,
    []
  );

  return (
    <>
      {/* Reading progress bar */}
      {!prefersReducedMotion && (
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-left bg-gradient-to-r from-mocha-500 to-accent-green"
          style={{ scaleX: scrollYProgress }}
          aria-hidden="true"
        />
      )}
      <article>
        {/* Hero Section */}
        <section className="relative py-12 lg:py-20 overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-br from-mocha-100 via-background to-navy-50 dark:from-navy-900 dark:via-background dark:to-mocha-900 opacity-50" />
          </div>

          <Container size="lg" padding="lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Breadcrumb */}
              <nav className="flex items-center gap-2 text-sm text-muted-foreground">
                <Link href="/" className="hover:text-primary transition-colors">
                  Home
                </Link>
                <span>/</span>
                <Link
                  href="/blog"
                  className="hover:text-primary transition-colors"
                >
                  Blog
                </Link>
                <span>/</span>
                <span className="text-foreground truncate">{post.title}</span>
              </nav>

              {/* Category and Series */}
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="px-3 py-1">
                  {post.category}
                </Badge>
                {post.series && (
                  <Badge variant="secondary">
                    {post.series.name} - Part {post.series.part} of{' '}
                    {post.series.total}
                  </Badge>
                )}
                {post.featured && (
                  <Badge className="bg-yellow-500 text-yellow-900">
                    Featured
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                {post.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg md:text-xl text-muted-foreground">
                {post.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {/* Author */}
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={post.author.avatar}
                      alt={post.author.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.author.role}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {formattedDate}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {post.readingTime} min read
                  </span>
                  <span className="flex items-center gap-1">
                    <ViewCounter slug={postId} trackView />
                  </span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <Badge key={tag} variant="secondary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </Container>
        </section>

        {/* Cover Image */}
        <section className="relative">
          <Container size="wide" padding="none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative h-96 lg:h-[500px] bg-muted overflow-hidden"
            >
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          </Container>
        </section>

        {/* Content and Sidebar */}
        <section className="py-12">
          <Container size="lg" padding="lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Sidebar - Actions */}
              <motion.aside
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-2"
              >
                <div className="sticky top-24 space-y-4">
                  {/* Bookmark */}
                  <button
                    onClick={() => setBookmarked(!bookmarked)}
                    className={`flex items-center gap-2 w-full p-3 rounded-lg border transition-all ${
                      bookmarked
                        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <Bookmark
                      className={`h-5 w-5 ${bookmarked ? 'fill-current' : ''}`}
                    />
                    <span className="text-sm font-medium">Save</span>
                  </button>

                  {/* React / Clap */}
                  <div className="w-full flex justify-center py-2">
                    <ReactionButton slug={postId} />
                  </div>

                  {/* Share */}
                  <div className="relative" ref={shareRef}>
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center gap-2 w-full p-3 rounded-lg border hover:bg-muted transition-all"
                    >
                      <Share2 className="h-5 w-5" />
                      <span className="text-sm font-medium">Share</span>
                    </button>

                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full mt-2 w-full bg-background border rounded-lg shadow-lg p-2 space-y-1 z-10"
                      >
                        <button
                          onClick={handleCopyLink}
                          className="flex items-center gap-2 w-full p-2 rounded hover:bg-muted transition-colors text-sm"
                        >
                          {copied ? (
                            <CheckCircle className="h-4 w-4 text-success-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          {copied ? 'Copied!' : 'Copy link'}
                        </button>
                        <a
                          href={shareLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 w-full p-2 rounded hover:bg-muted transition-colors text-sm"
                        >
                          <Twitter className="h-4 w-4" />
                          Twitter
                        </a>
                        <a
                          href={shareLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 w-full p-2 rounded hover:bg-muted transition-colors text-sm"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </a>
                        <a
                          href={shareLinks.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 w-full p-2 rounded hover:bg-muted transition-colors text-sm"
                        >
                          <Facebook className="h-4 w-4" />
                          Facebook
                        </a>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.aside>

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-8"
              >
                <div
                  data-mdx-content
                  className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-24 prose-pre:p-0 prose-pre:bg-transparent dark:prose-p:text-gray-200 dark:prose-li:text-gray-200 dark:prose-strong:text-white dark:prose-blockquote:text-gray-300"
                >
                  {mdxContent ? (
                    mdxContent
                  ) : 'content' in post ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(post.content),
                      }}
                    />
                  ) : null}
                </div>
              </motion.div>

              {/* Right Sidebar - Dynamic TOC */}
              <motion.aside
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="lg:col-span-2 hidden lg:block"
              >
                <DynamicTableOfContents />
              </motion.aside>
            </div>
          </Container>
        </section>

        {/* Article Navigation */}
        <section className="py-8 border-t">
          <Container size="lg" padding="lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {prevPost && (
                <Link href={`/blog/${prevPost.slug}`}>
                  <div className="p-4 border rounded-lg hover:bg-muted transition-all group">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <ArrowLeft className="h-4 w-4" />
                      Previous Article
                    </div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {prevPost.title}
                    </h4>
                  </div>
                </Link>
              )}
              {nextPost && (
                <Link
                  href={`/blog/${nextPost.slug}`}
                  className={!prevPost ? 'md:col-start-2' : ''}
                >
                  <div className="p-4 border rounded-lg hover:bg-muted transition-all group text-right">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 justify-end">
                      Continue reading
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <h4 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                      {nextPost.title}
                    </h4>
                  </div>
                </Link>
              )}
            </div>
          </Container>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-muted/50">
            <Container size="lg" padding="lg">
              <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost, index) => (
                  <BlogCard
                    key={relatedPost.slug}
                    post={relatedPost as BlogPost}
                    index={index}
                  />
                ))}
              </div>
            </Container>
          </section>
        )}
      </article>
    </>
  );
}
