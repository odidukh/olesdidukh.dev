export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// Project types
export type Project = {
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
};

export type ProjectInsert = {
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
};

// Blog Post types
export type BlogPost = {
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
};

export type BlogPostInsert = {
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
};

// Skill Category types
export type SkillCategory = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type SkillCategoryInsert = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  sort_order?: number;
};

// Skill types
export type Skill = {
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
};

export type SkillInsert = {
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
};

// Experience types
export type Experience = {
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
};

export type ExperienceInsert = {
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
};

// Contact Submission types
export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  message: string;
  read: boolean;
  replied: boolean;
  created_at: string;
};

export type ContactSubmissionInsert = {
  name: string;
  email: string;
  message: string;
  read?: boolean;
  replied?: boolean;
};

// Guestbook Entry types
export type GuestbookEntry = {
  id: string;
  created_at: string;
  user_id: string;
  full_name: string;
  avatar_url: string;
  message: string;
};

export type GuestbookEntryInsert = {
  id?: string;
  created_at?: string;
  user_id: string;
  full_name: string;
  avatar_url: string;
  message: string;
};

// Database type for Supabase client
export type Database = {
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: ProjectInsert;
        Update: Partial<ProjectInsert>;
        Relationships: [];
      };
      blog_posts: {
        Row: BlogPost;
        Insert: BlogPostInsert;
        Update: Partial<BlogPostInsert>;
        Relationships: [];
      };
      skill_categories: {
        Row: SkillCategory;
        Insert: SkillCategoryInsert;
        Update: Partial<SkillCategoryInsert>;
        Relationships: [];
      };
      skills: {
        Row: Skill;
        Insert: SkillInsert;
        Update: Partial<SkillInsert>;
        Relationships: [];
      };
      experiences: {
        Row: Experience;
        Insert: ExperienceInsert;
        Update: Partial<ExperienceInsert>;
        Relationships: [];
      };
      contact_submissions: {
        Row: ContactSubmission;
        Insert: ContactSubmissionInsert;
        Update: Partial<ContactSubmissionInsert>;
        Relationships: [];
      };
      guestbook_entries: {
        Row: GuestbookEntry;
        Insert: GuestbookEntryInsert;
        Update: Partial<GuestbookEntryInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      skill_level: 'Expert' | 'Advanced' | 'Intermediate' | 'Learning';
      employment_type: 'Full-time' | 'Contract' | 'Part-time';
    };
  };
};
