export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Project types
export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  long_description: string;
  category: string;
  technologies: string[];
  image: string;
  images: string[];
  demo_url: string | null;
  github_url: string | null;
  live_url: string | null;
  featured: boolean;
  year: number;
  duration: string;
  role: string;
  team: string | null;
  client: string | null;
  challenges: string[];
  solutions: string[];
  results: Json;
  testimonial: Json | null;
  video: Json | null;
  sort_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectInsert {
  id?: string;
  slug: string;
  title: string;
  description: string;
  long_description: string;
  category: string;
  technologies?: string[];
  image: string;
  images?: string[];
  demo_url?: string | null;
  github_url?: string | null;
  live_url?: string | null;
  featured?: boolean;
  year: number;
  duration: string;
  role: string;
  team?: string | null;
  client?: string | null;
  challenges?: string[];
  solutions?: string[];
  results?: Json;
  testimonial?: Json | null;
  video?: Json | null;
  sort_order?: number;
  published?: boolean;
}

// Blog Post types
export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name: string;
  author_avatar: string;
  author_role: string;
  published_at: string | null;
  updated_at: string;
  reading_time: number;
  category: string;
  tags: string[];
  featured: boolean;
  series_name: string | null;
  series_part: number | null;
  series_total: number | null;
  views: number;
  likes: number;
  related_posts: string[];
  published: boolean;
  created_at: string;
}

export interface BlogPostInsert {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image: string;
  author_name?: string;
  author_avatar?: string;
  author_role?: string;
  published_at?: string | null;
  reading_time?: number;
  category: string;
  tags?: string[];
  featured?: boolean;
  series_name?: string | null;
  series_part?: number | null;
  series_total?: number | null;
  published?: boolean;
}

// Skill Category types
export interface SkillCategory {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SkillCategoryInsert {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sort_order?: number;
}

// Skill types
export interface Skill {
  id: string;
  category_id: string;
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate' | 'Learning';
  years_of_experience: number;
  icon: string | null;
  description: string | null;
  last_used: string | null;
  projects_count: number;
  certifications: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface SkillInsert {
  category_id: string;
  name: string;
  level: 'Expert' | 'Advanced' | 'Intermediate' | 'Learning';
  years_of_experience?: number;
  icon?: string | null;
  description?: string | null;
  last_used?: string | null;
  projects_count?: number;
  certifications?: string[];
  sort_order?: number;
}

// Experience types
export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  duration: string;
  start_date: string;
  end_date: string | null;
  type: 'Full-time' | 'Contract' | 'Part-time';
  logo: string | null;
  company_url: string | null;
  description: string;
  achievements: string[];
  technologies: string[];
  team_size: string | null;
  highlights: Json;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ExperienceInsert {
  company: string;
  position: string;
  location: string;
  duration: string;
  start_date: string;
  end_date?: string | null;
  type: 'Full-time' | 'Contract' | 'Part-time';
  logo?: string | null;
  company_url?: string | null;
  description: string;
  achievements?: string[];
  technologies?: string[];
  team_size?: string | null;
  highlights?: Json;
  sort_order?: number;
}

// Contact Submission types
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  replied: boolean;
  created_at: string;
}

export interface ContactSubmissionInsert {
  name: string;
  email: string;
  message: string;
  read?: boolean;
  replied?: boolean;
}

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: Partial<ProjectInsert>;
      };
      blog_posts: {
        Row: BlogPost;
        Insert: BlogPostInsert;
        Update: Partial<BlogPostInsert>;
      };
      skill_categories: {
        Row: SkillCategory;
        Insert: SkillCategoryInsert;
        Update: Partial<SkillCategoryInsert>;
      };
      skills: {
        Row: Skill;
        Insert: SkillInsert;
        Update: Partial<SkillInsert>;
      };
      experiences: {
        Row: Experience;
        Insert: ExperienceInsert;
        Update: Partial<ExperienceInsert>;
      };
      contact_submissions: {
        Row: ContactSubmission;
        Insert: ContactSubmissionInsert;
        Update: Partial<ContactSubmissionInsert>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      skill_level: 'Expert' | 'Advanced' | 'Intermediate' | 'Learning';
      employment_type: 'Full-time' | 'Contract' | 'Part-time';
    };
  };
}
