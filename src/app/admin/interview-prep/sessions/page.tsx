import Link from 'next/link';
import { getSessions } from '@/lib/interview-prep/data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Pencil } from 'lucide-react';
import { DeleteSessionButton } from './components/DeleteSessionButton';
import type { InterviewSession } from '@/lib/supabase/types';

export const metadata = {
  title: 'Sessions | Admin Dashboard',
};

const statusVariant: Record<
  InterviewSession['status'],
  'default' | 'success' | 'secondary'
> = {
  upcoming: 'default',
  done: 'success',
  archived: 'secondary',
};

export default async function SessionsPage() {
  const sessions = await getSessions();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Sessions</h1>
          <p className="text-muted-foreground mt-1">
            Manage your interview sessions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/interview-prep/sessions/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Session
            </Button>
          </Link>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {sessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Company · Role
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Round
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Scheduled
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sessions.map(s => (
                  <tr key={s.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        {s.company} · {s.role}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {s.round}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant[s.status]} size="sm">
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {s.scheduled_at
                          ? new Date(s.scheduled_at).toLocaleString()
                          : '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/interview-prep/sessions/${s.id}`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteSessionButton
                          sessionId={s.id}
                          sessionLabel={`${s.company} · ${s.round}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No sessions yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first session
            </p>
            <Link href="/admin/interview-prep/sessions/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Session
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
