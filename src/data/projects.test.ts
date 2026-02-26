import { describe, it, expect } from 'vitest';
import {
  projectsData,
  getProjectBySlug,
  getFeaturedProjects,
  getRelatedProjects,
  getAllProjectSlugs,
  getProjectsByCategory,
  projectCategories,
  getTestimonials,
} from './projects';
import { ALL_FILTER } from '@/constants';

describe('projectsData', () => {
  it('contains projects', () => {
    expect(projectsData.length).toBeGreaterThan(0);
  });

  it('each project has required fields', () => {
    projectsData.forEach(project => {
      expect(project.id).toBeDefined();
      expect(project.title).toBeDefined();
      expect(project.description).toBeDefined();
      expect(project.longDescription).toBeDefined();
      expect(project.category).toBeDefined();
      expect(project.technologies).toBeDefined();
      expect(Array.isArray(project.technologies)).toBe(true);
      expect(project.image).toBeDefined();
      expect(project.featured).toBeDefined();
      expect(project.year).toBeDefined();
      expect(project.role).toBeDefined();
      expect(project.challenges).toBeDefined();
      expect(project.solutions).toBeDefined();
      expect(project.results).toBeDefined();
    });
  });

  it('each project has unique id', () => {
    const ids = projectsData.map(p => p.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });
});

describe('getProjectBySlug', () => {
  it('returns project for valid slug', () => {
    const project = getProjectBySlug('safebooks-financial-dashboard');

    expect(project).toBeDefined();
    expect(project?.id).toBe('safebooks-financial-dashboard');
    expect(project?.title).toBe('Safebooks AI - Financial Dashboard');
  });

  it('returns undefined for invalid slug', () => {
    const project = getProjectBySlug('non-existent-project');

    expect(project).toBeUndefined();
  });

  it('is case-sensitive', () => {
    const project = getProjectBySlug('SAFEBOOKS-FINANCIAL-DASHBOARD');

    expect(project).toBeUndefined();
  });
});

describe('getFeaturedProjects', () => {
  it('returns only featured projects', () => {
    const featured = getFeaturedProjects();

    expect(featured.length).toBeGreaterThan(0);
    featured.forEach(project => {
      expect(project.featured).toBe(true);
    });
  });

  it('returns fewer projects than total', () => {
    const featured = getFeaturedProjects();

    expect(featured.length).toBeLessThanOrEqual(projectsData.length);
  });
});

describe('getRelatedProjects', () => {
  it('returns related projects for valid id', () => {
    const related = getRelatedProjects('safebooks-financial-dashboard', 3);

    expect(related.length).toBeLessThanOrEqual(3);
    related.forEach(project => {
      expect(project.id).not.toBe('safebooks-financial-dashboard');
    });
  });

  it('returns empty array for invalid id', () => {
    const related = getRelatedProjects('non-existent', 3);

    expect(related).toEqual([]);
  });

  it('respects limit parameter', () => {
    const related1 = getRelatedProjects('safebooks-financial-dashboard', 1);
    const related2 = getRelatedProjects('safebooks-financial-dashboard', 2);

    expect(related1.length).toBeLessThanOrEqual(1);
    expect(related2.length).toBeLessThanOrEqual(2);
  });

  it('returns projects with matching category or technologies', () => {
    const currentProject = getProjectBySlug('safebooks-financial-dashboard');
    const related = getRelatedProjects('safebooks-financial-dashboard', 5);

    related.forEach(project => {
      const sameCategory = project.category === currentProject?.category;
      const sharedTech = project.technologies.some(tech =>
        currentProject?.technologies.includes(tech)
      );
      expect(sameCategory || sharedTech).toBe(true);
    });
  });
});

describe('getAllProjectSlugs', () => {
  it('returns all project slugs', () => {
    const slugs = getAllProjectSlugs();

    expect(slugs.length).toBe(projectsData.length);
    expect(slugs).toContain('safebooks-financial-dashboard');
    expect(slugs).toContain('emerline-enterprise-platform');
  });

  it('returns array of strings', () => {
    const slugs = getAllProjectSlugs();

    slugs.forEach(slug => {
      expect(typeof slug).toBe('string');
    });
  });
});

describe('getProjectsByCategory', () => {
  it('returns all projects for ALL_FILTER category', () => {
    const projects = getProjectsByCategory(ALL_FILTER);

    expect(projects.length).toBe(projectsData.length);
  });

  it('filters projects by category', () => {
    const enterpriseProjects = getProjectsByCategory('Enterprise');

    expect(enterpriseProjects.length).toBeGreaterThan(0);
    enterpriseProjects.forEach(project => {
      expect(project.category).toBe('Enterprise');
    });
  });

  it('returns empty array for non-existent category', () => {
    const projects = getProjectsByCategory('NonExistentCategory');

    expect(projects).toEqual([]);
  });
});

describe('projectCategories', () => {
  it('includes ALL_FILTER as first category', () => {
    expect(projectCategories[0]).toBe(ALL_FILTER);
  });

  it('includes all unique categories from projects', () => {
    const uniqueCategories = new Set(projectsData.map(p => p.category));

    uniqueCategories.forEach(category => {
      expect(projectCategories).toContain(category);
    });
  });

  it('has no duplicate categories', () => {
    const uniqueCategories = new Set(projectCategories);
    expect(uniqueCategories.size).toBe(projectCategories.length);
  });
});

describe('getTestimonials', () => {
  it('returns testimonials with project info', () => {
    const testimonials = getTestimonials();

    expect(testimonials.length).toBeGreaterThan(0);
    testimonials.forEach(testimonial => {
      expect(testimonial.text).toBeDefined();
      expect(testimonial.author).toBeDefined();
      expect(testimonial.role).toBeDefined();
      expect(testimonial.projectId).toBeDefined();
      expect(testimonial.projectTitle).toBeDefined();
    });
  });

  it('only includes projects with testimonials', () => {
    const testimonials = getTestimonials();
    const projectsWithTestimonials = projectsData.filter(p => p.testimonial);

    expect(testimonials.length).toBe(projectsWithTestimonials.length);
  });

  it('maps testimonial data correctly', () => {
    const testimonials = getTestimonials();
    const safebooksTestimonial = testimonials.find(
      t => t.projectId === 'safebooks-financial-dashboard'
    );

    expect(safebooksTestimonial).toBeDefined();
    expect(safebooksTestimonial?.author).toBe('Engineering Manager');
    expect(safebooksTestimonial?.projectTitle).toBe(
      'Safebooks AI - Financial Dashboard'
    );
  });
});
