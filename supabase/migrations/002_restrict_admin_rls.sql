-- ==========================================
-- RESTRICT ADMIN RLS POLICIES
-- ==========================================
-- SUPERSEDED / NEVER APPLIED to the hosted project. Retained for history only.
-- The current_setting('app.admin_email') GUC approach below is fragile (the GUC
-- is null until the ALTER DATABASE runs, and does not survive a project restore).
-- Migration 005 replaces this with an email-scoped RLS predicate that uses a
-- literal address (no GUC dependency) and extends the same rule site-wide,
-- including the interview_* tables. Do not apply this file to the hosted project.
--
-- Previously, any authenticated user had full CRUD access.
-- Now restricted to the specific admin email via JWT claim.
--
-- IMPORTANT: You must set the admin email in your Supabase project:
--   ALTER DATABASE postgres SET app.admin_email = 'your-admin@email.com';
-- Then restart the Supabase database for the setting to take effect.

-- Set the admin email (update this value to your actual admin email)
ALTER DATABASE postgres SET app.admin_email = 'oles.didukh@gmail.com';

-- Drop overly permissive policies
DROP POLICY IF EXISTS "Admin full access to projects" ON projects;
DROP POLICY IF EXISTS "Admin full access to blog posts" ON blog_posts;
DROP POLICY IF EXISTS "Admin full access to skill categories" ON skill_categories;
DROP POLICY IF EXISTS "Admin full access to skills" ON skills;
DROP POLICY IF EXISTS "Admin full access to experiences" ON experiences;
DROP POLICY IF EXISTS "Admin full access to contact submissions" ON contact_submissions;

-- Recreate with admin email check (explicit USING + WITH CHECK)
CREATE POLICY "Admin full access to projects" ON projects
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

CREATE POLICY "Admin full access to blog posts" ON blog_posts
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

CREATE POLICY "Admin full access to skill categories" ON skill_categories
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

CREATE POLICY "Admin full access to skills" ON skills
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

CREATE POLICY "Admin full access to experiences" ON experiences
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));

CREATE POLICY "Admin full access to contact submissions" ON contact_submissions
  FOR ALL
  USING (auth.jwt() ->> 'email' = current_setting('app.admin_email', true))
  WITH CHECK (auth.jwt() ->> 'email' = current_setting('app.admin_email', true));
