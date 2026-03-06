import { createClient } from '@/lib/supabase/server';
import type { GuestbookEntry } from '@/lib/supabase/types';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare } from 'lucide-react';
import { Card } from '@/components/ui/Card';

async function getEntries(): Promise<GuestbookEntry[]> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('guestbook_entries')
      .select('*')
      .order('created_at', { ascending: false })
      .returns<GuestbookEntry[]>();

    if (error) throw error;
    return data ?? [];
  } catch {
    return [];
  }
}

function EntryCard({ entry }: { entry: GuestbookEntry }) {
  const timeAgo = formatDistanceToNow(new Date(entry.created_at), {
    addSuffix: true,
  });

  return (
    <Card
      padding="none"
      className="group p-5 transition-all duration-200 hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        {entry.avatar_url ? (
          <Image
            src={entry.avatar_url}
            alt={entry.full_name}
            width={40}
            height={40}
            className="shrink-0 rounded-full ring-2 ring-border transition-all group-hover:ring-primary/30"
          />
        ) : (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
            {entry.full_name[0]?.toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-baseline gap-2">
            <span className="text-sm font-semibold text-foreground">
              {entry.full_name}
            </span>
            <span className="text-xs text-muted-foreground">{timeAgo}</span>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {entry.message}
          </p>
        </div>
      </div>
    </Card>
  );
}

export async function GuestbookList() {
  const entries = await getEntries();

  if (entries.length === 0) {
    return (
      <Card
        variant="dashed"
        padding="none"
        className="flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center"
      >
        <MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
        <p className="text-base font-medium text-muted-foreground">
          No messages yet
        </p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          Be the first to leave a message!
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {entries.length} {entries.length === 1 ? 'message' : 'messages'}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {entries.map(entry => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
}
