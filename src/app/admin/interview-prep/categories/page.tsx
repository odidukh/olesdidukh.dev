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
import { createCategory, updateCategory, deleteCategory } from './actions';
import { categoryAdminSchema } from './schema';
import type {
  InterviewCategory,
  InterviewCategoryInsert,
} from '@/lib/supabase/types';

export default function InterviewCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<InterviewCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [weight, setWeight] = useState(1);
  const [sortOrder, setSortOrder] = useState(0);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('interview_categories')
      .select('*')
      .order('sort_order', { ascending: true });

    setCategories((data as InterviewCategory[]) || []);
    setLoading(false);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setWeight(1);
    setSortOrder(categories.length);
    setEditingId(null);
    setShowNewForm(false);
  };

  const handleEdit = (category: InterviewCategory) => {
    setName(category.name);
    setSlug(category.slug);
    setWeight(category.weight);
    setSortOrder(category.sort_order);
    setEditingId(category.id);
    setShowNewForm(false);
  };

  const handleSave = async () => {
    const categoryData: InterviewCategoryInsert = {
      name,
      slug,
      weight,
      sort_order: sortOrder,
    };
    const validation = categoryAdminSchema.safeParse(categoryData);
    if (!validation.success) {
      alert(validation.error.issues.map(i => i.message).join(', '));
      return;
    }
    const result = editingId
      ? await updateCategory(editingId, categoryData)
      : await createCategory(categoryData);
    if ('error' in result) {
      alert(result.error);
      return;
    }
    resetForm();
    loadCategories();
  };

  const handleDelete = async (id: string) => {
    setDeleteLoading(true);
    const result = await deleteCategory(id);

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
              Interview Prep Categories
            </h1>
            <p className="text-muted-foreground mt-1">
              Organize interview questions into categories
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
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (!editingId) setSlug(generateSlug(e.target.value));
                }}
                placeholder="e.g., Behavioral"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                placeholder="behavioral"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight</Label>
              <Input
                id="weight"
                type="number"
                value={weight}
                onChange={e => setWeight(parseFloat(e.target.value))}
                min={0}
                step={0.1}
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
                      {category.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Weight {category.weight} · Order {category.sort_order}
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
            questions.
          </div>
        )}
      </div>
      {deleteTarget && (
        <DeleteConfirmDialog
          title="Delete Category"
          description="Deleting a category unlinks it from its questions (their category becomes General)."
          itemName={
            categories.find(c => c.id === deleteTarget)?.name || 'this category'
          }
          onConfirm={() => handleDelete(deleteTarget)}
          onCancel={() => setDeleteTarget(null)}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
