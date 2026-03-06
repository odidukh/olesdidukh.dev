'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  GripVertical,
} from 'lucide-react';
import { DeleteConfirmDialog } from '@/app/admin/components/DeleteConfirmDialog';
import {
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} from '@/app/admin/skills/actions';
import type { SkillCategory, SkillCategoryInsert } from '@/lib/supabase/types';

export default function SkillCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Monitor');
  const [color, setColor] = useState('from-blue-500/20 to-cyan-500/20');
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('skill_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    setCategories((data as SkillCategory[]) || []);
    setLoading(false);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setDescription('');
    setIcon('Monitor');
    setColor('from-blue-500/20 to-cyan-500/20');
    setSortOrder(categories.length);
    setEditingId(null);
    setShowNewForm(false);
  };

  const handleEdit = (category: SkillCategory) => {
    setTitle(category.title);
    setSlug(category.slug);
    setDescription(category.description);
    setIcon(category.icon);
    setColor(category.color);
    setSortOrder(category.sort_order);
    setEditingId(category.id);
    setShowNewForm(false);
  };

  const handleSave = async () => {
    const categoryData: SkillCategoryInsert = {
      title,
      slug,
      description,
      icon,
      color,
      sort_order: sortOrder,
    };

    const result = editingId
      ? await updateSkillCategory(editingId, categoryData)
      : await createSkillCategory(categoryData);

    if ('error' in result) {
      alert(result.error);
      return;
    }

    resetForm();
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    const result = await deleteSkillCategory(id);

    if ('error' in result) {
      alert(result.error);
      setDeleteLoading(false);
      setDeleteTarget(null);
      return;
    }

    setDeleteTarget(null);
    setDeleteLoading(false);
    loadCategories();
  };

  const iconOptions = [
    'Monitor',
    'Server',
    'Settings',
    'Palette',
    'GitBranch',
    'Terminal',
    'Globe',
    'Smartphone',
    'Package',
    'Code2',
  ];

  const colorOptions = [
    { value: 'from-blue-500/20 to-cyan-500/20', label: 'Blue' },
    { value: 'from-green-500/20 to-emerald-500/20', label: 'Green' },
    { value: 'from-purple-500/20 to-pink-500/20', label: 'Purple' },
    { value: 'from-orange-500/20 to-yellow-500/20', label: 'Orange' },
    { value: 'from-red-500/20 to-rose-500/20', label: 'Red' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Skill Categories
            </h1>
            <p className="text-muted-foreground mt-1">
              Organize skills into categories
            </p>
          </div>
        </div>
        <Button onClick={() => setShowNewForm(true)} disabled={showNewForm}>
          <Plus className="w-4 h-4 mr-2" />
          Add Category
        </Button>
      </div>

      {/* New/Edit Form */}
      {(showNewForm || editingId) && (
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              {editingId ? 'Edit Category' : 'New Category'}
            </h2>
            <button
              onClick={resetForm}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={e => {
                  setTitle(e.target.value);
                  if (!editingId) setSlug(generateSlug(e.target.value));
                }}
                placeholder="e.g., Frontend Development"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="frontend"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Modern web technologies and frameworks"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <select
                id="icon"
                value={icon}
                onChange={e => setIcon(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                {iconOptions.map(opt => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <select
                id="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground"
              >
                {colorOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
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
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={resetForm}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              {editingId ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {categories.length > 0 ? (
          <div className="divide-y divide-border">
            {categories.map(category => (
              <div
                key={category.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-muted/30"
              >
                <div className="flex items-center gap-4">
                  <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
                  <div>
                    <p className="font-medium text-foreground">
                      {category.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(category.id)}
                    className="p-2 rounded-lg hover:bg-error/10 transition-colors text-muted-foreground hover:text-error"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-12 text-center text-muted-foreground">
            No categories yet. Create your first category to start adding
            skills.
          </div>
        )}
      </div>
      {deleteTarget && (
        <DeleteConfirmDialog
          title="Delete Category"
          description="This will also delete all skills in this category"
          itemName={
            categories.find(c => c.id === deleteTarget)?.title ||
            'this category'
          }
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
