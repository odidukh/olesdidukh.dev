-- Portfolio CMS Database Schema
-- Version: 1.0.0
-- Created: 2025-11-28

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom enum types
CREATE TYPE skill_level AS ENUM ('Expert', 'Advanced', 'Intermediate', 'Learning');
CREATE TYPE employment_type AS ENUM ('Full-time', 'Contract', 'Part-time');

-- ==========================================
-- PROJECTS TABLE
-- ==========================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  long_description TEXT NOT NULL,
  category TEXT NOT NULL,
  technologies TEXT[] DEFAULT '{}',
  image TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  demo_url TEXT,
  github_url TEXT,
  live_url TEXT,
  featured BOOLEAN DEFAULT false,
  year INTEGER NOT NULL,
  duration TEXT NOT NULL,
  role TEXT NOT NULL,
  team TEXT,
  client TEXT,
  challenges TEXT[] DEFAULT '{}',
  solutions TEXT[] DEFAULT '{}',
  results JSONB DEFAULT '[]',
  testimonial JSONB,
  video JSONB,
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX idx_projects_featured ON projects(featured) WHERE published = true;
CREATE INDEX idx_projects_category ON projects(category) WHERE published = true;
CREATE INDEX idx_projects_year ON projects(year DESC) WHERE published = true;

-- ==========================================
-- BLOG POSTS TABLE
-- ==========================================
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  cover_image TEXT NOT NULL,
  author_name TEXT DEFAULT 'Oles Didukh',
  author_avatar TEXT DEFAULT '/images/avatar.jpg',
  author_role TEXT DEFAULT 'Senior Front-End Engineer',
  published_at TIMESTAMPTZ,
  reading_time INTEGER DEFAULT 5,
  category TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT false,
  series_name TEXT,
  series_part INTEGER,
  series_total INTEGER,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  related_posts TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for blog posts
CREATE INDEX idx_blog_posts_featured ON blog_posts(featured) WHERE published = true;
CREATE INDEX idx_blog_posts_category ON blog_posts(category) WHERE published = true;
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at DESC) WHERE published = true;
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags) WHERE published = true;

-- ==========================================
-- SKILL CATEGORIES TABLE
-- ==========================================
CREATE TABLE skill_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- SKILLS TABLE
-- ==========================================
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID NOT NULL REFERENCES skill_categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  level skill_level NOT NULL DEFAULT 'Intermediate',
  years_of_experience INTEGER DEFAULT 0,
  icon TEXT,
  description TEXT,
  last_used TEXT,
  projects_count INTEGER DEFAULT 0,
  certifications TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for skills
CREATE INDEX idx_skills_category ON skills(category_id);
CREATE INDEX idx_skills_level ON skills(level);

-- ==========================================
-- EXPERIENCES TABLE
-- ==========================================
CREATE TABLE experiences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  location TEXT NOT NULL,
  duration TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  type employment_type NOT NULL DEFAULT 'Full-time',
  logo TEXT,
  company_url TEXT,
  description TEXT NOT NULL,
  achievements TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  team_size TEXT,
  highlights JSONB DEFAULT '[]',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for experiences
CREATE INDEX idx_experiences_sort ON experiences(sort_order ASC);

-- ==========================================
-- CONTACT SUBMISSIONS TABLE
-- ==========================================
CREATE TABLE contact_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for unread messages
CREATE INDEX idx_contact_unread ON contact_submissions(read) WHERE read = false;

-- ==========================================
-- UPDATED_AT TRIGGER FUNCTION
-- ==========================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skill_categories_updated_at
  BEFORE UPDATE ON skill_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_skills_updated_at
  BEFORE UPDATE ON skills
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experiences_updated_at
  BEFORE UPDATE ON experiences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can read published projects" ON projects
  FOR SELECT USING (published = true);

CREATE POLICY "Public can read published blog posts" ON blog_posts
  FOR SELECT USING (published = true);

CREATE POLICY "Public can read skill categories" ON skill_categories
  FOR SELECT USING (true);

CREATE POLICY "Public can read skills" ON skills
  FOR SELECT USING (true);

CREATE POLICY "Public can read experiences" ON experiences
  FOR SELECT USING (true);

-- Public can insert contact submissions
CREATE POLICY "Public can insert contact submissions" ON contact_submissions
  FOR INSERT WITH CHECK (true);

-- Authenticated admin can do everything
CREATE POLICY "Admin full access to projects" ON projects
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to blog posts" ON blog_posts
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to skill categories" ON skill_categories
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to skills" ON skills
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to experiences" ON experiences
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admin full access to contact submissions" ON contact_submissions
  FOR ALL USING (auth.role() = 'authenticated');

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

-- Function to increment blog post views
CREATE OR REPLACE FUNCTION increment_blog_views(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET views = views + 1
  WHERE slug = post_slug AND published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment blog post likes
CREATE OR REPLACE FUNCTION increment_blog_likes(post_slug TEXT)
RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET likes = likes + 1
  WHERE slug = post_slug AND published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
