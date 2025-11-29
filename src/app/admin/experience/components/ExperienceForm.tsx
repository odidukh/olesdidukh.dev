'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { captureException } from '@/lib/sentry';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Save, ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import type { Experience } from '@/lib/supabase/types';

interface ExperienceFormProps {
  experience?: Experience;
  mode: 'create' | 'edit';
}

const employmentTypes = ['Full-time', 'Contract', 'Part-time'] as const;

export function ExperienceForm({ experience, mode }: ExperienceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [company, setCompany] = useState(experience?.company || '');
  const [position, setPosition] = useState(experience?.position || '');
  const [location, setLocation] = useState(experience?.location || '');
  const [duration, setDuration] = useState(experience?.duration || '');
  const [startDate, setStartDate] = useState(experience?.start_date || '');
  const [endDate, setEndDate] = useState(experience?.end_date || '');
  const [type, setType] = useState<(typeof employmentTypes)[number]>(
    experience?.type || 'Full-time'
  );
  const [companyUrl, setCompanyUrl] = useState(experience?.company_url || '');
  const [description, setDescription] = useState(experience?.description || '');
  const [achievements, setAchievements] = useState<string[]>(
    experience?.achievements || []
  );
  const [newAchievement, setNewAchievement] = useState('');
  const [technologies, setTechnologies] = useState<string[]>(
    experience?.technologies || []
  );
  const [newTech, setNewTech] = useState('');
  const [teamSize, setTeamSize] = useState(experience?.team_size || '');
  const [sortOrder, setSortOrder] = useState(experience?.sort_order || 0);

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setAchievements([...achievements, newAchievement.trim()]);
      setNewAchievement('');
    }
  };

  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const expData = {
      company,
      position,
      location,
      duration,
      start_date: startDate,
      end_date: endDate || null,
      type,
      company_url: companyUrl || null,
      description,
      achievements,
      technologies,
      team_size: teamSize || null,
      highlights: [],
      sort_order: sortOrder,
    };

    try {
      const supabase = createClient();

      if (mode === 'create') {
        const { error } = await supabase
          .from('experiences')
          .insert([expData] as never);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('experiences')
          .update(expData as never)
          .eq('id', experience!.id);
        if (error) throw error;
      }

      router.push('/admin/experience');
      router.refresh();
    } catch (err) {
      captureException(err, {
        component: 'ExperienceForm',
        action: mode === 'create' ? 'create_experience' : 'update_experience',
        experienceId: experience?.id,
      });
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setLoading(false);
    }
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
              {mode === 'create' ? 'Add Experience' : 'Edit Experience'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === 'create'
                ? 'Add a new work experience'
                : 'Update experience details'}
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
                Save
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="Company name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  placeholder="Job title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g., Remote, New York, NY"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Employment Type *</Label>
                <select
                  id="type"
                  value={type}
                  onChange={e =>
                    setType(e.target.value as (typeof employmentTypes)[number])
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  {employmentTypes.map(t => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Describe your role and responsibilities"
                rows={4}
                required
              />
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              Achievements
            </h2>

            <ul className="space-y-2">
              {achievements.map((achievement, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 p-3 bg-muted rounded-lg"
                >
                  <span className="flex-1 text-sm">{achievement}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setAchievements(
                        achievements.filter((_, i) => i !== index)
                      )
                    }
                    className="p-1 hover:bg-muted-foreground/20 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex gap-2">
              <Input
                value={newAchievement}
                onChange={e => setNewAchievement(e.target.value)}
                placeholder="Add an achievement"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addAchievement();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addAchievement}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              Technologies Used
            </h2>

            <div className="flex gap-2 flex-wrap">
              {technologies.map(tech => (
                <Badge key={tech} variant="secondary" className="gap-1 pr-1">
                  {tech}
                  <button
                    type="button"
                    onClick={() =>
                      setTechnologies(technologies.filter(t => t !== tech))
                    }
                    className="ml-1 p-0.5 hover:bg-muted-foreground/20 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={newTech}
                onChange={e => setNewTech(e.target.value)}
                placeholder="Add technology"
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTechnology();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTechnology}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Duration */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Duration</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Display Duration *</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="e.g., Jan 2023 - Present"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  placeholder="e.g., 2023-01"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  placeholder="Leave empty for current"
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty if this is your current position
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Additional Details
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyUrl">Company Website</Label>
                <Input
                  id="companyUrl"
                  value={companyUrl}
                  onChange={e => setCompanyUrl(e.target.value)}
                  placeholder="https://company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="teamSize">Team Size</Label>
                <Input
                  id="teamSize"
                  value={teamSize}
                  onChange={e => setTeamSize(e.target.value)}
                  placeholder="e.g., 15+ people"
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
                  Lower numbers appear first (most recent first)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
