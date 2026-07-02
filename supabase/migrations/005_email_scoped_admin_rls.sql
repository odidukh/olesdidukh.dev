-- supabase/migrations/005_email_scoped_admin_rls.sql
-- Email-scoped admin RLS, site-wide.
-- Version: 5.0.0
--
-- Supersedes migration 002 (which was never applied to the hosted project and
-- whose current_setting('app.admin_email') GUC pattern is fragile: the GUC is
-- null until an ALTER DATABASE runs and does not survive a project restore).
--
-- Replaces the "any authenticated session" admin-write policies on every
-- admin-content table with an email-scoped predicate so that ONLY the site
-- owner can write, closing the hole where anyone able to obtain a session
-- (public signup / anonymous sign-in) would otherwise pass auth.role() checks.
--
-- Modern Supabase form: FOR ALL TO authenticated + JWT-email predicate in both
-- USING (read/update/delete visibility) and WITH CHECK (insert/update guard).
-- The `email` claim is a verified top-level JWT claim (NOT user_metadata), so
-- it is safe for authorization.
--
-- Untouched by design:
--   * All public SELECT policies (blog_posts/projects keep published=true).
--   * interview_progress  (public INSERT/UPDATE for browser progress sync).
--   * contact_submissions (public INSERT for the contact form).
--   * guestbook_entries   (per-user auth.uid() = user_id ownership model).

BEGIN;

-- Interview prep -------------------------------------------------------------
DROP POLICY IF EXISTS "Admin full access to interview categories" ON public.interview_categories;
CREATE POLICY "Admin full access to interview categories" ON public.interview_categories
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com');

DROP POLICY IF EXISTS "Admin full access to interview stories" ON public.interview_stories;
CREATE POLICY "Admin full access to interview stories" ON public.interview_stories
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com');

DROP POLICY IF EXISTS "Admin full access to interview questions" ON public.interview_questions;
CREATE POLICY "Admin full access to interview questions" ON public.interview_questions
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com');

DROP POLICY IF EXISTS "Admin full access to interview sessions" ON public.interview_sessions;
CREATE POLICY "Admin full access to interview sessions" ON public.interview_sessions
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com');

-- Existing content tables (fulfils migration 002's original intent) ----------
DROP POLICY IF EXISTS "Admin full access to blog posts" ON public.blog_posts;
CREATE POLICY "Admin full access to blog posts" ON public.blog_posts
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com');

DROP POLICY IF EXISTS "Admin full access to projects" ON public.projects;
CREATE POLICY "Admin full access to projects" ON public.projects
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com');

DROP POLICY IF EXISTS "Admin full access to skills" ON public.skills;
CREATE POLICY "Admin full access to skills" ON public.skills
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com');

DROP POLICY IF EXISTS "Admin full access to skill categories" ON public.skill_categories;
CREATE POLICY "Admin full access to skill categories" ON public.skill_categories
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com');

DROP POLICY IF EXISTS "Admin full access to experiences" ON public.experiences;
CREATE POLICY "Admin full access to experiences" ON public.experiences
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'oles.didukh@gmail.com');

COMMIT;
