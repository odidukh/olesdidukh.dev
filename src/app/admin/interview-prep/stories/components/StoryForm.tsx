'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Save, ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import {
  createStory,
  updateStory,
} from '@/app/admin/interview-prep/stories/actions';
import { storyAdminSchema } from '@/app/admin/interview-prep/stories/schema';
import type {
  InterviewStory,
  InterviewStoryInsert,
} from '@/lib/supabase/types';

interface StoryFormProps {
  story?: InterviewStory;
  mode: 'create' | 'edit';
}

export function StoryForm({ story, mode }: StoryFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(story?.title || '');
  const [slug, setSlug] = useState(story?.slug || '');
  const [company, setCompany] = useState(story?.company || '');
  const [situation, setSituation] = useState(story?.situation || '');
  const [task, setTask] = useState(story?.task || '');
  const [action, setAction] = useState(story?.action || '');
  const [result, setResult] = useState(story?.result || '');
  const [metrics, setMetrics] = useState(story?.metrics || '');
  const [tags, setTags] = useState<string[]>(story?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [sortOrder, setSortOrder] = useState(story?.sort_order ?? 0);

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

    const data: InterviewStoryInsert = {
      title,
      slug,
      company: company || null,
      situation,
      task,
      action,
      result,
      metrics: metrics || null,
      tags,
      sort_order: sortOrder,
    };

    const validation = storyAdminSchema.safeParse(data);
    if (!validation.success) {
      setError(validation.error.issues.map(i => i.message).join(', '));
      setLoading(false);
      return;
    }

    const result_ =
      mode === 'create'
        ? await createStory(data)
        : await updateStory(story!.id, data);

    if ('error' in result_) {
      setError(result_.error);
      setLoading(false);
      return;
    }

    router.push('/admin/interview-prep/stories');
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
              {mode === 'create' ? 'New Story' : 'Edit Story'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === 'create'
                ? 'Add a new STAR behavioral story'
                : 'Update story details'}
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
                Save Story
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
                  placeholder="Story title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="story-slug"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier (auto-generated from title)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g., Acme Corp"
                />
              </div>
            </div>
          </div>

          {/* STAR */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              STAR Breakdown
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="situation">Situation *</Label>
                <Textarea
                  id="situation"
                  value={situation}
                  onChange={e => setSituation(e.target.value)}
                  placeholder="Set the scene and context"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="task">Task *</Label>
                <Textarea
                  id="task"
                  value={task}
                  onChange={e => setTask(e.target.value)}
                  placeholder="Describe your responsibility"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="action">Action *</Label>
                <Textarea
                  id="action"
                  value={action}
                  onChange={e => setAction(e.target.value)}
                  placeholder="Explain the steps you took"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="result">Result *</Label>
                <Textarea
                  id="result"
                  value={result}
                  onChange={e => setResult(e.target.value)}
                  placeholder="Share the outcome"
                  rows={4}
                  required
                />
              </div>
            </div>
          </div>

          {/* Metrics */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">Metrics</h2>

            <div className="space-y-2">
              <Label htmlFor="metrics">Quantified Impact</Label>
              <Textarea
                id="metrics"
                value={metrics}
                onChange={e => setMetrics(e.target.value)}
                placeholder="e.g., Reduced load time by 40%"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
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

          {/* Details */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Details</h2>

            <div className="space-y-2">
              <Label htmlFor="sortOrder">Sort Order</Label>
              <Input
                id="sortOrder"
                type="number"
                value={sortOrder}
                onChange={e => setSortOrder(parseInt(e.target.value, 10))}
                min={0}
              />
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
