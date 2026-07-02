import Link from 'next/link';
import {
  getCategories,
  getStories,
  getQuestions,
  getSessions,
} from '@/lib/interview-prep/data';
import { CalendarClock, HelpCircle, FolderTree, BookText } from 'lucide-react';

export const metadata = { title: 'Interview Prep | Admin Dashboard' };

export default async function InterviewPrepAdminPage() {
  const [categories, stories, questions, sessions] = await Promise.all([
    getCategories(),
    getStories(),
    getQuestions(),
    getSessions(),
  ]);

  const cards = [
    {
      title: 'Sessions',
      href: '/admin/interview-prep/sessions',
      count: sessions.length,
      icon: CalendarClock,
      desc: 'Interview briefings',
    },
    {
      title: 'Questions',
      href: '/admin/interview-prep/questions',
      count: questions.length,
      icon: HelpCircle,
      desc: 'Prep questions & tips',
    },
    {
      title: 'Categories',
      href: '/admin/interview-prep/categories',
      count: categories.length,
      icon: FolderTree,
      desc: 'Question grouping & weight',
    },
    {
      title: 'Stories',
      href: '/admin/interview-prep/stories',
      count: stories.length,
      icon: BookText,
      desc: 'STAR behavioral stories',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Interview Prep</h1>
        <p className="text-muted-foreground mt-1">Manage interview content</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {cards.map(card => (
          <Link
            key={card.href}
            href={card.href}
            className="bg-card border border-border rounded-xl p-6 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <card.icon className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold text-foreground">
                {card.count}
              </span>
            </div>
            <h2 className="mt-4 text-lg font-semibold text-foreground">
              {card.title}
            </h2>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
