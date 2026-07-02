import Link from 'next/link';
import { getStories } from '@/lib/interview-prep/data';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Pencil } from 'lucide-react';
import { DeleteStoryButton } from './components/DeleteStoryButton';

export const metadata = {
  title: 'Stories | Admin Dashboard',
};

export default async function StoriesPage() {
  const stories = await getStories();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Stories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your STAR behavioral stories
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/interview-prep/stories/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Story
            </Button>
          </Link>
        </div>
      </div>

      {/* Stories Table */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {stories.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Title
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Company
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Tags
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">
                    Order
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stories.map(story => (
                  <tr key={story.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">
                        {story.title}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {story.company || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{story.tags.length}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">
                        {story.sort_order}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/interview-prep/stories/${story.id}`}
                          className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <DeleteStoryButton
                          storyId={story.id}
                          storyTitle={story.title}
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
              No stories yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Get started by adding your first story
            </p>
            <Link href="/admin/interview-prep/stories/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Story
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
