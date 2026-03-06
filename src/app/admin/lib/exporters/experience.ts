import type { Experience } from '@/lib/supabase/types';

/**
 * Generate a TypeScript file exporting experience data.
 * The generated file imports and re-exports the Supabase Experience type.
 */
export function generateExperienceTS(experiences: Experience[]): string {
  const data = JSON.stringify(
    experiences.map(exp => ({
      id: exp.id,
      company: exp.company,
      position: exp.position,
      location: exp.location,
      duration: exp.duration,
      start_date: exp.start_date,
      end_date: exp.end_date,
      type: exp.type,
      logo: exp.logo,
      company_url: exp.company_url,
      description: exp.description,
      achievements: exp.achievements,
      technologies: exp.technologies,
      team_size: exp.team_size,
      highlights: exp.highlights,
      sort_order: exp.sort_order,
      created_at: exp.created_at,
      updated_at: exp.updated_at,
    })),
    null,
    2
  );

  return [
    '// Auto-generated from admin CMS. Do not edit manually.',
    `// Last exported: ${new Date().toISOString()}`,
    '',
    "import type { Experience } from '@/lib/supabase/types';",
    '',
    `export const experiences: Experience[] = ${data};`,
    '',
  ].join('\n');
}
