import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import {
  FolderKanban,
  FileText,
  Briefcase,
  Code2,
  Mail,
  TrendingUp,
  Eye,
  Clock,
} from 'lucide-react';
import { ExportButton } from '@/app/admin/components/ExportButton';
import type { ContactSubmission } from '@/lib/supabase/types';

interface ProjectStats {
  id: string;
  published: boolean;
}

interface BlogStats {
  id: string;
  published: boolean;
}

interface MessageStats {
  id: string;
  read: boolean;
}

async function getStats() {
  const supabase = await createClient();

  // Get counts from each table
  const [projects, blogPosts, experiences, skills, messages] =
    await Promise.all([
      supabase.from('projects').select('id, published', { count: 'exact' }),
      supabase.from('blog_posts').select('id, published', { count: 'exact' }),
      supabase.from('experiences').select('id', { count: 'exact' }),
      supabase.from('skills').select('id', { count: 'exact' }),
      supabase
        .from('contact_submissions')
        .select('id, read', { count: 'exact' }),
    ]);

  // Calculate stats
  const projectsData = (projects.data as ProjectStats[]) || [];
  const blogPostsData = (blogPosts.data as BlogStats[]) || [];
  const messagesData = (messages.data as MessageStats[]) || [];

  return {
    projects: {
      total: projects.count || 0,
      published: projectsData.filter(p => p.published).length,
    },
    blogPosts: {
      total: blogPosts.count || 0,
      published: blogPostsData.filter(p => p.published).length,
    },
    experiences: {
      total: experiences.count || 0,
    },
    skills: {
      total: skills.count || 0,
    },
    messages: {
      total: messages.count || 0,
      unread: messagesData.filter(m => !m.read).length,
    },
  };
}

async function getRecentMessages(): Promise<ContactSubmission[]> {
  const supabase = await createClient();

  const { data } = await supabase
    .from('contact_submissions')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  return (data as ContactSubmission[]) || [];
}

export default async function AdminDashboard() {
  const stats = await getStats();
  const recentMessages = await getRecentMessages();

  const statCards = [
    {
      title: 'Projects',
      value: stats.projects.total,
      subtitle: `${stats.projects.published} published`,
      icon: FolderKanban,
      href: '/admin/projects',
      color: 'bg-blue-500/10 text-blue-500',
    },
    {
      title: 'Blog Posts',
      value: stats.blogPosts.total,
      subtitle: `${stats.blogPosts.published} published`,
      icon: FileText,
      href: '/admin/blog',
      color: 'bg-green-500/10 text-green-500',
    },
    {
      title: 'Experience',
      value: stats.experiences.total,
      subtitle: 'positions',
      icon: Briefcase,
      href: '/admin/experience',
      color: 'bg-purple-500/10 text-purple-500',
    },
    {
      title: 'Skills',
      value: stats.skills.total,
      subtitle: 'technologies',
      icon: Code2,
      href: '/admin/skills',
      color: 'bg-orange-500/10 text-orange-500',
    },
    {
      title: 'Messages',
      value: stats.messages.total,
      subtitle: `${stats.messages.unread} unread`,
      icon: Mail,
      href: '/admin/messages',
      color: 'bg-pink-500/10 text-pink-500',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome to your portfolio admin panel
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map(card => (
          <Link
            key={card.title}
            href={card.href}
            className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{card.title}</p>
                <p className="text-3xl font-bold text-foreground mt-1">
                  {card.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {card.subtitle}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${card.color}`}>
                <card.icon className="w-5 h-5" />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/projects/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <FolderKanban className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">New Project</span>
            </Link>
            <Link
              href="/admin/blog/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <FileText className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">New Blog Post</span>
            </Link>
            <Link
              href="/admin/experience/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Add Experience</span>
            </Link>
            <Link
              href="/admin/skills/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            >
              <Code2 className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium">Add Skill</span>
            </Link>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <ExportButton type="all" label="Export All to Site" />
          </div>
        </div>

        {/* Recent Messages */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Mail className="w-5 h-5 text-primary" />
              Recent Messages
            </h2>
            <Link
              href="/admin/messages"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {recentMessages.length > 0 ? (
            <div className="space-y-3">
              {recentMessages.map(message => (
                <div
                  key={message.id}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${message.read ? 'bg-muted-foreground' : 'bg-primary'}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {message.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {message.message}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(message.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No messages yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Site Status */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Eye className="w-5 h-5 text-primary" />
          Site Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-green-500/10">
            <div className="w-3 h-3 bg-green-500 rounded-full mb-2" />
            <p className="text-sm font-medium text-foreground">Site Online</p>
            <p className="text-xs text-muted-foreground">All systems normal</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-2xl font-bold text-foreground">
              {stats.projects.published}
            </p>
            <p className="text-xs text-muted-foreground">Published Projects</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-2xl font-bold text-foreground">
              {stats.blogPosts.published}
            </p>
            <p className="text-xs text-muted-foreground">Published Posts</p>
          </div>
          <div className="p-4 rounded-lg bg-muted">
            <p className="text-2xl font-bold text-foreground">
              {stats.messages.unread}
            </p>
            <p className="text-xs text-muted-foreground">Unread Messages</p>
          </div>
        </div>
      </div>
    </div>
  );
}
