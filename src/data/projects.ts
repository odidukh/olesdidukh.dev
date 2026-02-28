// eslint-disable-next-line no-restricted-imports
import { projects } from '../../.velite';
import { ALL_FILTER } from '@/constants';

// eslint-disable-next-line no-restricted-imports
export type { Project } from '../../.velite';
// eslint-disable-next-line no-restricted-imports
import type { Project as TProject } from '../../.velite';

export type ProjectVideo = NonNullable<TProject['video']>;

export const projectsData = projects.sort((a, b) => b.year - a.year);

export function getProjectBySlug(slug: string) {
  return projectsData.find(project => project.id === slug);
}

export function getFeaturedProjects() {
  return projectsData.filter(project => project.featured);
}

export function getRelatedProjects(projectId: string, limit = 3) {
  const currentProject = getProjectBySlug(projectId);
  if (!currentProject) return [];

  return projectsData
    .filter(project => project.id !== projectId)
    .filter(
      project =>
        project.category === currentProject.category ||
        project.technologies.some(tech =>
          currentProject.technologies.includes(tech)
        )
    )
    .slice(0, limit);
}

export function getAllProjectSlugs(): string[] {
  return projectsData.map(project => project.id);
}

export function getProjectsByCategory(category: string) {
  if (category === ALL_FILTER) return projectsData;
  return projectsData.filter(project => project.category === category);
}

export const projectCategories = [
  ALL_FILTER,
  ...new Set(projectsData.map(project => project.category)),
];

export interface TestimonialWithProject {
  text: string;
  author: string;
  role: string;
  projectId: string;
  projectTitle: string;
}

export function getTestimonials(): TestimonialWithProject[] {
  return projectsData
    .filter(project => project.testimonial)
    .map(project => ({
      text: project.testimonial!.text,
      author: project.testimonial!.author,
      role: project.testimonial!.role,
      projectId: project.id,
      projectTitle: project.title,
    }));
}
