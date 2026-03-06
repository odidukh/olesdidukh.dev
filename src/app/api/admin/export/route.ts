import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { env } from '@/lib/env';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import {
  generateBlogMDX,
  generateProjectMDX,
  generateExperienceTS,
  generateSkillsTS,
} from '@/app/admin/lib/exporters';
import type {
  BlogPost,
  Project,
  Experience,
  Skill,
  SkillCategory,
} from '@/lib/supabase/types';

const CONTENT_DIR = path.join(process.cwd(), 'src/content');
const DATA_DIR = path.join(process.cwd(), 'src/data');

export async function POST(request: NextRequest) {
  // Auth check
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.email !== env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { type } = await request.json();
  const filesWritten: string[] = [];

  try {
    if (type === 'blog' || type === 'all') {
      const { data: posts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (posts) {
        await mkdir(path.join(CONTENT_DIR, 'blog'), { recursive: true });
        for (const post of posts as BlogPost[]) {
          const filePath = path.join(CONTENT_DIR, 'blog', `${post.slug}.mdx`);
          await writeFile(filePath, generateBlogMDX(post), 'utf-8');
          filesWritten.push(`src/content/blog/${post.slug}.mdx`);
        }
      }
    }

    if (type === 'projects' || type === 'all') {
      const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .eq('published', true)
        .order('sort_order', { ascending: true });

      if (projects) {
        await mkdir(path.join(CONTENT_DIR, 'projects'), { recursive: true });
        for (const project of projects as Project[]) {
          const filePath = path.join(
            CONTENT_DIR,
            'projects',
            `${project.slug}.mdx`
          );
          await writeFile(filePath, generateProjectMDX(project), 'utf-8');
          filesWritten.push(`src/content/projects/${project.slug}.mdx`);
        }
      }
    }

    if (type === 'experience' || type === 'all') {
      const { data: experiences } = await supabase
        .from('experiences')
        .select('*')
        .order('sort_order', { ascending: true });

      if (experiences) {
        await mkdir(path.join(DATA_DIR, 'generated'), { recursive: true });
        const filePath = path.join(DATA_DIR, 'generated', 'experience.ts');
        await writeFile(
          filePath,
          generateExperienceTS(experiences as Experience[]),
          'utf-8'
        );
        filesWritten.push('src/data/generated/experience.ts');
      }
    }

    if (type === 'skills' || type === 'all') {
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

      if (categories && skills) {
        await mkdir(path.join(DATA_DIR, 'generated'), { recursive: true });
        const filePath = path.join(DATA_DIR, 'generated', 'skills.ts');
        await writeFile(
          filePath,
          generateSkillsTS(categories as SkillCategory[], skills as Skill[]),
          'utf-8'
        );
        filesWritten.push('src/data/generated/skills.ts');
      }
    }

    return NextResponse.json({ success: true, filesWritten });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Export failed',
      },
      { status: 500 }
    );
  }
}
