import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Pencil, FolderPlus } from 'lucide-react';
import { DeleteSkillButton } from './components/DeleteSkillButton';
import type { SkillCategory, Skill } from '@/lib/supabase/types';

export const metadata = {
  title: 'Skills | Admin Dashboard',
};

async function getSkillsWithCategories(): Promise<{
  categories: SkillCategory[];
  skills: Skill[];
}> {
  const supabase = await createClient();

  const [{ data: categories }, { data: skills }] = await Promise.all([
    supabase
      .from('skill_categories')
      .select('*')
      .order('sort_order', { ascending: true }),
    supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);

  return {
    categories: (categories as SkillCategory[]) || [],
    skills: (skills as Skill[]) || [],
  };
}

const levelColors: Record<string, string> = {
  Expert: 'bg-green-500/10 text-green-500',
  Advanced: 'bg-blue-500/10 text-blue-500',
  Intermediate: 'bg-yellow-500/10 text-yellow-500',
  Learning: 'bg-purple-500/10 text-purple-500',
};

export default async function SkillsPage() {
  const { categories, skills } = await getSkillsWithCategories();

  // Group skills by category
  const skillsByCategory = categories.map(category => ({
    ...category,
    skills: skills.filter(skill => skill.category_id === category.id),
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Skills</h1>
          <p className="text-muted-foreground mt-1">
            Manage your skills and categories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/skills/categories">
            <Button variant="outline">
              <FolderPlus className="w-4 h-4 mr-2" />
              Categories
            </Button>
          </Link>
          <Link href="/admin/skills/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Skill
            </Button>
          </Link>
        </div>
      </div>

      {/* Skills by Category */}
      {categories.length > 0 ? (
        <div className="space-y-6">
          {skillsByCategory.map(category => (
            <div
              key={category.id}
              className="bg-card border border-border rounded-xl overflow-hidden"
            >
              <div className="px-6 py-4 bg-muted/50 border-b border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      {category.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {category.skills.length} skills
                  </Badge>
                </div>
              </div>

              {category.skills.length > 0 ? (
                <div className="divide-y divide-border">
                  {category.skills.map(skill => (
                    <div
                      key={skill.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-muted/30"
                    >
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium text-foreground">
                            {skill.name}
                          </p>
                          {skill.description && (
                            <p className="text-sm text-muted-foreground">
                              {skill.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge className={levelColors[skill.level] || ''}>
                          {skill.level}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {skill.years_of_experience} years
                        </span>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/skills/${skill.id}`}
                            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <DeleteSkillButton
                            skillId={skill.id}
                            skillName={skill.name}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-8 text-center text-muted-foreground">
                  No skills in this category
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderPlus className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium text-foreground mb-2">
            No categories yet
          </h3>
          <p className="text-muted-foreground mb-4">
            Create skill categories before adding skills
          </p>
          <Link href="/admin/skills/categories">
            <Button>
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Category
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
