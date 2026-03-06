'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Save, ArrowLeft, Plus, X, Loader2 } from 'lucide-react';
import { createProject, updateProject } from '@/app/admin/projects/actions';
import { projectSchema } from '@/app/admin/projects/schema';
import type { Project, ProjectInsert } from '@/lib/supabase/types';

interface ProjectFormProps {
  project?: Project;
  mode: 'create' | 'edit';
}

const projectCategories = [
  'SaaS',
  'E-Commerce',
  'FinTech',
  'Healthcare',
  'Enterprise',
  'Mobile',
  'Other',
];

export function ProjectForm({ project, mode }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(project?.title || '');
  const [slug, setSlug] = useState(project?.slug || '');
  const [description, setDescription] = useState(project?.description || '');
  const [longDescription, setLongDescription] = useState(
    project?.long_description || ''
  );
  const [category, setCategory] = useState(project?.category || 'SaaS');
  const [technologies, setTechnologies] = useState<string[]>(
    project?.technologies || []
  );
  const [newTech, setNewTech] = useState('');
  const [image, setImage] = useState(project?.image || '');
  const [images, setImages] = useState<string[]>(project?.images || []);
  const [newImage, setNewImage] = useState('');
  const [demoUrl, setDemoUrl] = useState(project?.demo_url || '');
  const [githubUrl, setGithubUrl] = useState(project?.github_url || '');
  const [liveUrl, setLiveUrl] = useState(project?.live_url || '');
  const [featured, setFeatured] = useState(project?.featured || false);
  const [year, setYear] = useState(project?.year || new Date().getFullYear());
  const [duration, setDuration] = useState(project?.duration || '');
  const [role, setRole] = useState(project?.role || '');
  const [team, setTeam] = useState(project?.team || '');
  const [client, setClient] = useState(project?.client || '');
  const [challenges, setChallenges] = useState<string[]>(
    project?.challenges || []
  );
  const [newChallenge, setNewChallenge] = useState('');
  const [solutions, setSolutions] = useState<string[]>(
    project?.solutions || []
  );
  const [newSolution, setNewSolution] = useState('');
  const [published, setPublished] = useState(project?.published || false);

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

  // Add technology
  const addTechnology = () => {
    if (newTech.trim() && !technologies.includes(newTech.trim())) {
      setTechnologies([...technologies, newTech.trim()]);
      setNewTech('');
    }
  };

  // Remove technology
  const removeTechnology = (tech: string) => {
    setTechnologies(technologies.filter(t => t !== tech));
  };

  // Add challenge
  const addChallenge = () => {
    if (newChallenge.trim()) {
      setChallenges([...challenges, newChallenge.trim()]);
      setNewChallenge('');
    }
  };

  // Add solution
  const addSolution = () => {
    if (newSolution.trim()) {
      setSolutions([...solutions, newSolution.trim()]);
      setNewSolution('');
    }
  };

  // Add image
  const addImage = () => {
    if (newImage.trim() && !images.includes(newImage.trim())) {
      setImages([...images, newImage.trim()]);
      setNewImage('');
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const projectData: ProjectInsert = {
      title,
      slug,
      description,
      long_description: longDescription,
      category,
      technologies,
      image,
      images,
      demo_url: demoUrl || null,
      github_url: githubUrl || null,
      live_url: liveUrl || null,
      featured,
      year,
      duration,
      role,
      team: team || null,
      client: client || null,
      challenges,
      solutions,
      results: [],
      published,
    };

    const validation = projectSchema.safeParse(projectData);
    if (!validation.success) {
      setError(validation.error.issues.map(e => e.message).join(', '));
      setLoading(false);
      return;
    }

    const result =
      mode === 'create'
        ? await createProject(projectData)
        : await updateProject(project!.id, projectData);

    if ('error' in result) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push('/admin/projects');
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
              {mode === 'create' ? 'New Project' : 'Edit Project'}
            </h1>
            <p className="text-muted-foreground mt-1">
              {mode === 'create'
                ? 'Add a new project to your portfolio'
                : 'Update project details'}
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
                Save Project
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
                  placeholder="Project title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  placeholder="project-slug"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly identifier (auto-generated from title)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief project description"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longDescription">Long Description *</Label>
                <Textarea
                  id="longDescription"
                  value={longDescription}
                  onChange={e => setLongDescription(e.target.value)}
                  placeholder="Detailed project description"
                  rows={6}
                  required
                />
              </div>
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              Technologies
            </h2>

            <div className="flex gap-2 flex-wrap">
              {technologies.map(tech => (
                <Badge key={tech} variant="secondary" className="gap-1 pr-1">
                  {tech}
                  <button
                    type="button"
                    onClick={() => removeTechnology(tech)}
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

          {/* Challenges & Solutions */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              Challenges & Solutions
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Challenges</Label>
                <ul className="space-y-2">
                  {challenges.map((challenge, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      <span className="flex-1 text-sm">{challenge}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setChallenges(
                            challenges.filter((_, i) => i !== index)
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
                    value={newChallenge}
                    onChange={e => setNewChallenge(e.target.value)}
                    placeholder="Add challenge"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addChallenge();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addChallenge}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Solutions</Label>
                <ul className="space-y-2">
                  {solutions.map((solution, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 p-2 bg-muted rounded-lg"
                    >
                      <span className="flex-1 text-sm">{solution}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSolutions(solutions.filter((_, i) => i !== index))
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
                    value={newSolution}
                    onChange={e => setNewSolution(e.target.value)}
                    placeholder="Add solution"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSolution();
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addSolution}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
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

          {/* Category & Year */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Details</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <select
                  id="category"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                >
                  {projectCategories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year *</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={e => setYear(parseInt(e.target.value))}
                  min={2000}
                  max={2030}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration *</Label>
                <Input
                  id="duration"
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="e.g., 6 months"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role *</Label>
                <Input
                  id="role"
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  placeholder="e.g., Senior Front-End Engineer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Team Size</Label>
                <Input
                  id="team"
                  value={team}
                  onChange={e => setTeam(e.target.value)}
                  placeholder="e.g., 8 developers"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Client</Label>
                <Input
                  id="client"
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  placeholder="Client name"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Images</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image">Main Image URL *</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  placeholder="/images/projects/project.png"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Gallery Images</Label>
                <div className="space-y-2">
                  {images.map((img, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input value={img} readOnly className="flex-1" />
                      <button
                        type="button"
                        onClick={() =>
                          setImages(images.filter((_, i) => i !== index))
                        }
                        className="p-2 hover:bg-muted rounded"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newImage}
                    onChange={e => setNewImage(e.target.value)}
                    placeholder="Add image URL"
                  />
                  <Button type="button" variant="outline" onClick={addImage}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Links</h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live URL</Label>
                <Input
                  id="liveUrl"
                  value={liveUrl}
                  onChange={e => setLiveUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="demoUrl">Demo URL</Label>
                <Input
                  id="demoUrl"
                  value={demoUrl}
                  onChange={e => setDemoUrl(e.target.value)}
                  placeholder="https://demo.example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub URL</Label>
                <Input
                  id="githubUrl"
                  value={githubUrl}
                  onChange={e => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/user/repo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
