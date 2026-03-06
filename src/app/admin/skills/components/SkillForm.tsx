'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import { createSkill, updateSkill } from '@/app/admin/skills/actions';
import { skillSchema } from '@/app/admin/skills/schema';
import type { Skill, SkillCategory, SkillInsert } from '@/lib/supabase/types';

interface SkillFormProps {
  skill?: Skill;
  categories: SkillCategory[];
  mode: 'create' | 'edit';
}

const skillLevels = ['Expert', 'Advanced', 'Intermediate', 'Learning'] as const;

export function SkillForm({ skill, categories, mode }: SkillFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(skill?.name || '');
  const [categoryId, setCategoryId] = useState(
    skill?.category_id || categories[0]?.id || ''
  );
  const [level, setLevel] = useState<(typeof skillLevels)[number]>(
    skill?.level || 'Intermediate'
  );
  const [yearsOfExperience, setYearsOfExperience] = useState(
    skill?.years_of_experience || 0
  );
  const [description, setDescription] = useState(skill?.description || '');
  const [lastUsed, setLastUsed] = useState(skill?.last_used || '');
  const [projectsCount, setProjectsCount] = useState(
    skill?.projects_count || 0
  );
  const [sortOrder, setSortOrder] = useState(skill?.sort_order || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const skillData: SkillInsert = {
      name,
      category_id: categoryId,
      level,
      years_of_experience: yearsOfExperience,
      description: description || null,
      last_used: lastUsed || null,
      projects_count: projectsCount,
      sort_order: sortOrder,
    };

    const validation = skillSchema.safeParse(skillData);
    if (!validation.success) {
      setError(validation.error.issues.map(e => e.message).join(', '));
      setLoading(false);
      return;
    }

    const result =
      mode === 'create'
        ? await createSkill(skillData)
        : await updateSkill(skill!.id, skillData);

    if ('error' in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push('/admin/skills');
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
              {mode === 'create' ? 'Add Skill' : 'Edit Skill'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === 'create'
                ? 'Add a new skill to your profile'
                : 'Update skill details'}
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
                Save Skill
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

      <div className="max-w-2xl">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Skill Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g., React.js"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={categoryId}
                onChange={e => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                required
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Proficiency Level *</Label>
              <select
                id="level"
                value={level}
                onChange={e =>
                  setLevel(e.target.value as (typeof skillLevels)[number])
                }
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                {skillLevels.map(lvl => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="yearsOfExperience">Years of Experience</Label>
              <Input
                id="yearsOfExperience"
                type="number"
                value={yearsOfExperience}
                onChange={e => setYearsOfExperience(parseInt(e.target.value))}
                min={0}
                max={30}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastUsed">Last Used</Label>
              <Input
                id="lastUsed"
                value={lastUsed}
                onChange={e => setLastUsed(e.target.value)}
                placeholder="e.g., Currently"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projectsCount">Projects Count</Label>
              <Input
                id="projectsCount"
                type="number"
                value={projectsCount}
                onChange={e => setProjectsCount(parseInt(e.target.value))}
                min={0}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Brief description of your expertise..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sortOrder">Sort Order</Label>
            <Input
              id="sortOrder"
              type="number"
              value={sortOrder}
              onChange={e => setSortOrder(parseInt(e.target.value))}
              min={0}
            />
            <p className="text-xs text-muted-foreground">
              Lower numbers appear first
            </p>
          </div>
        </div>
      </div>
    </form>
  );
}
