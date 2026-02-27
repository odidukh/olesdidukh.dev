'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
  trackView?: boolean;
}

export function ViewCounter({ slug, trackView = false }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    const fetchViews = async () => {
      try {
        const method = trackView ? 'POST' : 'GET';
        const response = await fetch(`/api/views/${slug}`, { method });

        if (response.ok) {
          const data = await response.json();
          setViews(data.views);
        }
      } catch (error) {
        console.error('Failed to update views:', error);
      }
    };

    fetchViews();
  }, [slug, trackView]);

  if (views === null) {
    return (
      <span className="inline-flex items-center gap-1.5 text-muted-foreground animate-pulse">
        <Eye className="w-4 h-4" />
        <span className="h-4 w-8 bg-muted rounded"></span>
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-muted-foreground"
      title={`${views} views`}
    >
      <Eye className="w-4 h-4" />
      <span>{views.toLocaleString()}</span>
    </span>
  );
}
