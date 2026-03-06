'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Save, ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import { createBlogPost, updateBlogPost } from '@/app/admin/blog/actions';
import { blogPostSchema } from '@/app/admin/blog/schema';
import type { BlogPost, BlogPostInsert } from '@/lib/supabase/types';

interface BlogFormProps {
  post?: BlogPost;
  mode: 'create' | 'edit';
}

const blogCategories = [
  'React',
  'TypeScript',
  'Web Development',
  'Performance',
  'Career',
  'Tutorial',
  'Best Practices',
  'Tools',
];

export function BlogForm({ post, mode }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [content, setContent] = useState(post?.content || '');
  const [coverImage, setCoverImage] = useState(post?.cover_image || '');
  const [category, setCategory] = useState(post?.category || 'Web Development');
  const [tags, setTags] = useState<string[]>(post?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [readingTime, setReadingTime] = useState(post?.reading_time || 5);
  const [featured, setFeatured] = useState(post?.featured || false);
  const [published, setPublished] = useState(post?.published || false);
  const [seriesName, setSeriesName] = useState(post?.series_name || '');
  const [seriesPart, setSeriesPart] = useState(post?.series_part || 1);
  const [seriesTotal, setSeriesTotal] = useState(post?.series_total || 1);

  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Handle title change and auto-generate slug
  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (mode === 'create') {
      setSlug(generateSlug(value));
    }
  };

  // Calculate reading time from content
  const calculateReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
  };

  // Handle content change
  const handleContentChange = (value: string) => {
    setContent(value);
    setReadingTime(calculateReadingTime(value));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  // Remove tag
  const removeTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const postData: BlogPostInsert = {
      title,
      slug,
      excerpt,
      content,
      cover_image: coverImage,
      category,
      tags,
      reading_time: readingTime,
      featured,
      published,
      published_at: published
        ? post?.published_at || new Date().toISOString()
        : null,
      series_name: seriesName || null,
      series_part: seriesName ? seriesPart : null,
      series_total: seriesName ? seriesTotal : null,
    };

    const validation = blogPostSchema.safeParse(postData);
    if (!validation.success) {
      setError(validation.error.issues.map(e => e.message).join(', '));
      setLoading(false);
      return;
    }

    const result =
      mode === 'create'
        ? await createBlogPost(postData)
        : await updateBlogPost(post!.id, postData);

    if ('error' in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push('/admin/blog');
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {mode === 'create' ? 'New Blog Post' : 'Edit Blog Post'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === 'create'
                ? 'Write a new article'
                : 'Update article details'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Post
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-error/10 border border-error/20 rounded-lg p-4 text-error">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              Basic Information
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={e => handleTitleChange(e.target.value)}
                  placeholder="Post title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="post-slug"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier (auto-generated from title)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Excerpt *</Label>
                <Textarea
                  id="excerpt"
                  value={excerpt}
                  onChange={e => setExcerpt(e.target.value)}
                  placeholder="Brief post description"
                  rows={3}
                  required
                />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Content</h2>
              <span className="text-sm text-muted-foreground">
                ~{readingTime} min read
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (MDX) *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={e => handleContentChange(e.target.value)}
                placeholder="Write your post content in MDX format..."
                rows={20}
                className="font-mono text-sm"
                required
              />
              <p className="text-xs text-muted-foreground">
                Supports Markdown and MDX components
              </p>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Tags</h2>

            <div className="flex gap-2 flex-wrap">
              {tags.map(tag => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 p-0.5 hover:bg-muted-foreground/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Status</h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={published}
                  onChange={e => setPublished(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Published</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={e => setFeatured(e.target.checked)}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Featured</span>
              </label>
            </div>
          </div>

          {/* Category */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Category</h2>

            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
            >
              {blogCategories.map(cat => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Cover Image */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Cover Image
            </h2>

            <div className="space-y-2">
              <Input
                value={coverImage}
                onChange={e => setCoverImage(e.target.value)}
                placeholder="/images/blog/cover.jpg"
              />
              {coverImage && (
                <div className="mt-2 rounded-lg overflow-hidden bg-muted aspect-video">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                    onError={e => {
                      (e.target as HTMLImageElement).src =
                        '/images/placeholder.jpg';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Series */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Series (Optional)
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="seriesName">Series Name</Label>
                <Input
                  id="seriesName"
                  value={seriesName}
                  onChange={e => setSeriesName(e.target.value)}
                  placeholder="e.g., React Deep Dive"
                />
              </div>

              {seriesName && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seriesPart">Part</Label>
                    <Input
                      id="seriesPart"
                      type="number"
                      value={seriesPart}
                      onChange={e => setSeriesPart(parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seriesTotal">Total</Label>
                    <Input
                      id="seriesTotal"
                      type="number"
                      value={seriesTotal}
                      onChange={e => setSeriesTotal(parseInt(e.target.value))}
                      min={1}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
