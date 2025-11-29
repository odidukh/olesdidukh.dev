import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { captureException } from '@/lib/sentry';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Pencil, Calendar, MapPin, Building2 } from 'lucide-react';
import { DeleteExperienceButton } from './components/DeleteExperienceButton';
import type { Experience } from '@/lib/supabase/types';

export const metadata = {
  title: 'Experience | Admin Dashboard',
};

async function getExperiences(): Promise<Experience[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });

  if (error) {
    captureException(error, {
      page: 'admin/experience',
      action: 'fetch_experiences',
    });
    return [];
  }

  return (data as Experience[]) || [];
}

export default async function ExperiencePage() {
  const experiences = await getExperiences();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Experience</h1>
          <p className="text-muted-foreground mt-1">
            Manage your work experience timeline
          </p>
        </div>
        <Link href="/admin/experience/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </Link>
      </div>

      {/* Experience List */}
      <div className="bg-card border border-border rounded-xl overflow-hidden">
        {experiences.length > 0 ? (
          <div className="divide-y divide-border">
            {experiences.map(exp => (
              <div
                key={exp.id}
                className="p-6 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        {exp.position}
                      </h3>
                      <Badge variant="secondary">{exp.type}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {exp.company}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        {exp.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {exp.duration}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {exp.description}
                    </p>
                    {exp.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {exp.technologies.slice(0, 5).map(tech => (
                          <Badge
                            key={tech}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tech}
                          </Badge>
                        ))}
                        {exp.technologies.length > 5 && (
                          <Badge variant="secondary" className="text-xs">
                            +{exp.technologies.length - 5} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link
                      href={`/admin/experience/${exp.id}`}
                      className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <DeleteExperienceButton
                      experienceId={exp.id}
                      company={exp.company}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">
              No experience yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Add your work experience
            </p>
            <Link href="/admin/experience/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Experience
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
