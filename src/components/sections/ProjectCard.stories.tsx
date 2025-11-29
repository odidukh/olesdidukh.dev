import type { Meta, StoryObj } from '@storybook/nextjs';
import { ProjectCard } from './ProjectCard';
import type { Project } from '@/data/projects';

// Mock project data for stories
const mockProject: Project = {
  id: 'demo-project',
  title: 'Demo Project',
  description:
    'A demonstration project showcasing modern web development practices.',
  longDescription: 'This is a detailed description of the demo project...',
  category: 'Web App',
  technologies: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL'],
  image: 'https://placehold.co/600x400/1a1a2e/ffffff?text=Project',
  images: [],
  githubUrl: 'https://github.com/example/demo',
  liveUrl: 'https://demo.example.com',
  featured: false,
  year: 2024,
  duration: '4 months',
  role: 'Lead Developer',
  team: '5 developers',
  challenges: ['Complex state management'],
  solutions: ['Implemented Redux Toolkit'],
  results: [
    { metric: 'Performance', value: '+40%' },
    { metric: 'Load Time', value: '-60%' },
  ],
};

const featuredProject: Project = {
  ...mockProject,
  id: 'featured-project',
  title: 'Featured Project',
  description: 'An award-winning featured project with exceptional results.',
  featured: true,
  category: 'SaaS',
  technologies: [
    'React',
    'TypeScript',
    'Node.js',
    'PostgreSQL',
    'AWS',
    'Docker',
    'GraphQL',
  ],
};

const minimalProject: Project = {
  id: 'minimal-project',
  title: 'Minimal Project',
  description: 'A project with minimal information.',
  longDescription: 'A detailed description of this minimal project.',
  category: 'Web App',
  technologies: ['JavaScript'],
  image: 'https://placehold.co/600x400/1a1a2e/ffffff?text=Minimal',
  images: [],
  featured: false,
  year: 2024,
  duration: '2 months',
  role: 'Developer',
  challenges: ['Simple challenge'],
  solutions: ['Simple solution'],
  results: [],
};

const meta = {
  title: 'Sections/ProjectCard',
  component: ProjectCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A card component for displaying project information. Supports grid and list view modes with hover animations and quick action buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    viewMode: {
      control: 'radio',
      options: ['grid', 'list'],
      description: 'Display mode for the card',
    },
    index: {
      control: { type: 'number', min: 0, max: 10 },
      description: 'Index for staggered animation delay',
    },
  },
  args: {
    index: 0,
  },
  decorators: [
    Story => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ProjectCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// Grid View Stories
export const GridView: Story = {
  args: {
    project: mockProject,
    viewMode: 'grid',
  },
};

export const GridViewFeatured: Story = {
  args: {
    project: featuredProject,
    viewMode: 'grid',
  },
};

export const GridViewMinimal: Story = {
  args: {
    project: minimalProject,
    viewMode: 'grid',
  },
};

// List View Stories
export const ListView: Story = {
  args: {
    project: mockProject,
    viewMode: 'list',
  },
  decorators: [
    Story => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
};

export const ListViewFeatured: Story = {
  args: {
    project: featuredProject,
    viewMode: 'list',
  },
  decorators: [
    Story => (
      <div className="w-[800px]">
        <Story />
      </div>
    ),
  ],
};

// Multiple Cards Grid
export const GridShowcase: Story = {
  args: {
    project: mockProject,
    viewMode: 'grid',
  },
  decorators: [
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-[1200px]">
        <ProjectCard project={mockProject} index={0} viewMode="grid" />
        <ProjectCard project={featuredProject} index={1} viewMode="grid" />
        <ProjectCard project={minimalProject} index={2} viewMode="grid" />
      </div>
    ),
  ],
};

// Multiple Cards List
export const ListShowcase: Story = {
  args: {
    project: mockProject,
    viewMode: 'list',
  },
  decorators: [
    () => (
      <div className="space-y-4 w-[800px]">
        <ProjectCard project={mockProject} index={0} viewMode="list" />
        <ProjectCard project={featuredProject} index={1} viewMode="list" />
        <ProjectCard project={minimalProject} index={2} viewMode="list" />
      </div>
    ),
  ],
};
