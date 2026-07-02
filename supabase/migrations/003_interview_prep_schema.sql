-- supabase/migrations/003_interview_prep_schema.sql
-- Interview Prep Platform schema
-- Version: 3.0.0
-- Single-admin content: admin-email RLS, no user_id (matches migration 001/002).

-- Enum types
CREATE TYPE interview_difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE interview_session_status AS ENUM ('upcoming', 'done', 'archived');
CREATE TYPE interview_progress_status AS ENUM ('new', 'learning', 'known');

-- ==========================================
-- CATEGORIES
-- ==========================================
CREATE TABLE interview_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  sort_order INTEGER DEFAULT 0,
  weight NUMERIC NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- STORIES (STAR)
-- ==========================================
CREATE TABLE interview_stories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  company TEXT,
  situation TEXT NOT NULL,
  task TEXT NOT NULL,
  action TEXT NOT NULL,
  result TEXT NOT NULL,
  metrics TEXT,
  tags TEXT[] DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- QUESTIONS
-- ==========================================
CREATE TABLE interview_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES interview_categories(id) ON DELETE SET NULL,
  story_id UUID REFERENCES interview_stories(id) ON DELETE SET NULL,
  question TEXT NOT NULL,
  model_answer TEXT,
  tips JSONB DEFAULT '[]',
  difficulty interview_difficulty NOT NULL DEFAULT 'medium',
  time_estimate_sec INTEGER,
  tags TEXT[] DEFAULT '{}',
  is_custom BOOLEAN DEFAULT false,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_interview_questions_category ON interview_questions(category_id);
CREATE INDEX idx_interview_questions_story ON interview_questions(story_id);

-- ==========================================
-- SESSIONS
-- ==========================================
CREATE TABLE interview_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  round TEXT NOT NULL,
  scheduled_at TIMESTAMPTZ,
  status interview_session_status NOT NULL DEFAULT 'upcoming',
  product TEXT,
  interviewers JSONB DEFAULT '[]',
  likely_topics JSONB DEFAULT '[]',
  your_numbers JSONB DEFAULT '[]',
  bottom_line TEXT,
  stack_map JSONB DEFAULT '[]',
  focus_category_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- PROGRESS (per session x question)
-- ==========================================
CREATE TABLE interview_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES interview_sessions(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES interview_questions(id) ON DELETE CASCADE,
  status interview_progress_status NOT NULL DEFAULT 'new',
  confidence INTEGER NOT NULL DEFAULT 0 CHECK (confidence BETWEEN 0 AND 3),
  starred BOOLEAN DEFAULT false,
  times_seen INTEGER DEFAULT 0,
  last_reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (session_id, question_id)
);
CREATE INDEX idx_interview_progress_session ON interview_progress(session_id);
CREATE INDEX idx_interview_progress_question ON interview_progress(question_id);

-- ==========================================
-- updated_at TRIGGERS (function defined in migration 001)
-- ==========================================
CREATE TRIGGER update_interview_categories_updated_at
  BEFORE UPDATE ON interview_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_stories_updated_at
  BEFORE UPDATE ON interview_stories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_questions_updated_at
  BEFORE UPDATE ON interview_questions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_sessions_updated_at
  BEFORE UPDATE ON interview_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interview_progress_updated_at
  BEFORE UPDATE ON interview_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (admin-email pattern, matches migration 002)
-- ==========================================
ALTER TABLE interview_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access to interview categories" ON interview_categories
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
CREATE POLICY "Admin full access to interview stories" ON interview_stories
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
CREATE POLICY "Admin full access to interview questions" ON interview_questions
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
CREATE POLICY "Admin full access to interview sessions" ON interview_sessions
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
CREATE POLICY "Admin full access to interview progress" ON interview_progress
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
