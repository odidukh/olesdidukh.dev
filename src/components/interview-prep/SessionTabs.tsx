'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const TABS: { segment: string; label: string }[] = [
  { segment: 'briefing', label: 'Briefing' },
  { segment: 'dashboard', label: 'Dashboard' },
  { segment: 'study', label: 'Study' },
  { segment: 'mock', label: 'Mock' },
  { segment: 'browse', label: 'Question Bank' },
  { segment: 'stories', label: 'Stories' },
];

export interface SessionTabsProps {
  slug: string;
}

export function SessionTabs({ slug }: SessionTabsProps) {
  const pathname = usePathname();
  const base = `/interview-prep/${slug}`;

  return (
    <nav
      aria-label="Session sections"
      className="flex flex-wrap gap-1 border-b border-border"
    >
      {TABS.map(({ segment, label }) => {
        const href = `${base}/${segment}`;
        const active = pathname === href;
        return (
          <Link
            key={segment}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-t-md px-4 py-2 text-sm font-medium transition-colors',
              'border-b-2 -mb-px',
              active
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
