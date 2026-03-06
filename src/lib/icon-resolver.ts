import {
  Code2,
  Palette,
  Settings,
  TrendingUp,
  Layers,
  Rocket,
  Target,
  Users,
  Award,
  Briefcase,
  Calendar,
  MapPin,
  Building2,
  Trophy,
  Star,
  Activity,
  BarChart3,
  BookOpen,
  Zap,
  Terminal,
  Package,
  Clock,
  ArrowRight,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  Code2,
  Palette,
  Settings,
  TrendingUp,
  Layers,
  Rocket,
  Target,
  Users,
  Award,
  Briefcase,
  Calendar,
  MapPin,
  Building2,
  Trophy,
  Star,
  Activity,
  BarChart3,
  BookOpen,
  Zap,
  Terminal,
  Package,
  Clock,
  ArrowRight,
  ExternalLink,
};

/**
 * Resolve a Lucide icon string name to its component.
 * Returns undefined if the icon name is not found or is null/undefined.
 */
export function resolveIcon(
  name: string | null | undefined
): LucideIcon | undefined {
  if (!name) return undefined;
  return iconMap[name];
}
