import type { Skill, SkillCategory } from '@/lib/supabase/types';

/**
 * Generate a TypeScript file exporting skills data grouped by category.
 */
export function generateSkillsTS(
  categories: SkillCategory[],
  skills: Skill[]
): string {
  const catData = JSON.stringify(
    categories.map(cat => ({
      id: cat.id,
      slug: cat.slug,
      title: cat.title,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      sort_order: cat.sort_order,
    })),
    null,
    2
  );

  const skillsData = JSON.stringify(
    skills.map(skill => ({
      id: skill.id,
      category_id: skill.category_id,
      name: skill.name,
      level: skill.level,
      years_of_experience: skill.years_of_experience,
      icon: skill.icon,
      description: skill.description,
      last_used: skill.last_used,
      projects_count: skill.projects_count,
      certifications: skill.certifications,
      sort_order: skill.sort_order,
    })),
    null,
    2
  );

  return [
    '// Auto-generated from admin CMS. Do not edit manually.',
    `// Last exported: ${new Date().toISOString()}`,
    '',
    "import type { Skill, SkillCategory } from '@/lib/supabase/types';",
    '',
    `export const skillCategories: Omit<SkillCategory, 'created_at' | 'updated_at'>[] = ${catData};`,
    '',
    `export const skills: Omit<Skill, 'created_at' | 'updated_at'>[] = ${skillsData};`,
    '',
  ].join('\n');
}
