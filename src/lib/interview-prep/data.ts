// src/lib/interview-prep/data.ts
import { createClient } from '@/lib/supabase/server';
import type {
  InterviewCategory,
  InterviewStory,
  InterviewQuestion,
  InterviewSession,
  InterviewProgress,
} from '@/lib/supabase/types';

export async function getCategories(): Promise<InterviewCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('interview_categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(`Failed to load categories: ${error.message}`);
  return (data as InterviewCategory[] | null) ?? [];
}

export async function getStories(): Promise<InterviewStory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('interview_stories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw new Error(`Failed to load stories: ${error.message}`);
  return (data as InterviewStory[] | null) ?? [];
}

export async function getQuestions(): Promise<InterviewQuestion[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('interview_questions')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throw new Error(`Failed to load questions: ${error.message}`);
  return (data as InterviewQuestion[] | null) ?? [];
}

export async function getSessions(): Promise<InterviewSession[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .order('scheduled_at', { ascending: true });
  if (error) throw new Error(`Failed to load sessions: ${error.message}`);
  return (data as InterviewSession[] | null) ?? [];
}

export async function getSessionBySlug(
  slug: string
): Promise<InterviewSession | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw new Error(`Failed to load session: ${error.message}`);
  return (data as InterviewSession | null) ?? null;
}

export async function getProgressForSession(
  sessionId: string
): Promise<InterviewProgress[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('interview_progress')
    .select('*')
    .eq('session_id', sessionId);
  if (error) throw new Error(`Failed to load progress: ${error.message}`);
  return (data as InterviewProgress[] | null) ?? [];
}
