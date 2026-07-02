'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Briefcase,
  Code2,
  Mail,
  Settings,
  ExternalLink,
  GraduationCap,
} from 'lucide-react';

const navItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Projects',
    href: '/admin/projects',
    icon: FolderKanban,
  },
  {
    title: 'Blog Posts',
    href: '/admin/blog',
    icon: FileText,
  },
  {
    title: 'Experience',
    href: '/admin/experience',
    icon: Briefcase,
  },
  {
    title: 'Skills',
    href: '/admin/skills',
    icon: Code2,
  },
  {
    title: 'Interview Prep',
    href: '/admin/interview-prep',
    icon: GraduationCap,
  },
  {
    title: 'Messages',
    href: '/admin/messages',
    icon: Mail,
  },
];

const bottomNavItems = [
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: Settings,
  },
  {
    title: 'View Site',
    href: '/',
    icon: ExternalLink,
    external: true,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-card border-r border-border hidden lg:block overflow-y-auto">
      <nav className="p-4 space-y-1">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navItems.map(item => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
              </Link>
            );
          })}
        </div>

        {/* Divider */}
        <div className="pt-4 mt-4 border-t border-border">
          {bottomNavItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.title}
                {item.external && (
                  <ExternalLink className="w-3 h-3 ml-auto opacity-50" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
