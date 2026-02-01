import { ALL_FILTER } from '@/constants';

export interface ProjectVideo {
  url: string;
  thumbnail?: string;
  type: 'local' | 'youtube' | 'vimeo';
  title?: string;
  duration?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: string;
  technologies: string[];
  image: string;
  images: string[];
  demoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
  year: number;
  duration: string;
  role: string;
  team?: string;
  client?: string;
  challenges: string[];
  solutions: string[];
  results: {
    metric: string;
    value: string;
  }[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  video?: ProjectVideo;
}

export const projectsData: Project[] = [
  {
    id: 'safebooks-financial-dashboard',
    title: 'Safebooks AI - Financial Dashboard',
    description:
      'Real-time financial dashboard serving 9 enterprise clients with advanced data visualization and 95+ Lighthouse scores.',
    longDescription:
      'Architected and developed a real-time financial dashboard platform for enterprise clients using Next.js 14 and React 18. The platform delivers complex data visualizations, interactive charts, and real-time financial insights while maintaining exceptional performance standards.',
    category: 'Enterprise',
    technologies: [
      'Next.js',
      'React',
      'TypeScript',
      'Zustand',
      'Material-UI',
      'Jest',
      'Webpack',
    ],
    image: '/images/projects/safebooks.png',
    images: [
      '/images/projects/safebooks.png',
      '/images/projects/safebooks.png',
      '/images/projects/safebooks.png',
    ],
    liveUrl: 'https://safebooks.ai',
    featured: true,
    year: 2024,
    duration: '15 months',
    role: 'Senior Front-End Engineer',
    team: '10+ developers',
    client: 'Safebooks AI',
    challenges: [
      'Complex real-time data visualization for financial metrics',
      'Achieving exceptional performance with large datasets',
      'Ensuring reliability through comprehensive testing',
    ],
    solutions: [
      'Implemented interactive charts with optimized rendering for real-time updates',
      'Applied aggressive performance optimization achieving 95+ Lighthouse scores',
      'Built comprehensive test suite with 85% coverage reducing UI bugs by 60%',
    ],
    results: [
      { metric: 'Lighthouse Score', value: '95+' },
      { metric: 'Load Time Reduction', value: '50%' },
      { metric: 'Test Coverage', value: '85%' },
      { metric: 'Enterprise Clients', value: '9' },
    ],
    testimonial: {
      text: 'Outstanding technical leadership and attention to performance optimization. The dashboard delivers exceptional user experience for our enterprise clients.',
      author: 'Engineering Manager',
      role: 'Safebooks AI',
    },
  },
  {
    id: 'emerline-enterprise-platform',
    title: 'Emerline - Enterprise Platform',
    description:
      'Front-end architecture for enterprise platform serving 1,000+ employees with scalable component library.',
    longDescription:
      'Led front-end architecture for a comprehensive enterprise platform, designing and implementing a scalable component library that dramatically improved development efficiency. Mentored junior developers and drove significant improvements in Core Web Vitals performance.',
    category: 'Enterprise',
    technologies: [
      'React',
      'TypeScript',
      'Redux',
      'JavaScript ES6+',
      'SASS',
      'Webpack',
      'Storybook',
    ],
    image: '/images/projects/ecommerce.png',
    images: [
      '/images/projects/ecommerce.png',
      '/images/projects/ecommerce.png',
      '/images/projects/ecommerce.png',
    ],
    featured: true,
    year: 2023,
    duration: '2+ years',
    role: 'Senior Front-End Developer',
    team: '8-12 developers',
    client: 'Emerline',
    challenges: [
      'Building scalable architecture for enterprise-level platform',
      'Reducing development time for new features',
      'Improving performance across the platform',
    ],
    solutions: [
      'Designed component library with React/TypeScript/Storybook for reusability',
      'Established coding standards and mentored 2 junior developers',
      'Implemented performance optimizations improving Core Web Vitals by 35%',
    ],
    results: [
      { metric: 'Employees Served', value: '1,000+' },
      { metric: 'Productivity Improvement', value: '30%' },
      { metric: 'Dev Time Reduction', value: '40%' },
      { metric: 'Core Web Vitals', value: '+35%' },
    ],
    testimonial: {
      text: 'Exceptional ability to translate complex requirements into elegant, maintainable solutions. The component library became the foundation for our entire platform.',
      author: 'Product Lead',
      role: 'Emerline',
    },
  },
  {
    id: 'inango-isp-platform',
    title: 'Inango Systems - ISP Web Platform',
    description:
      'React/Redux platform serving 50,000+ ISP customers with jQuery to React migration achieving 40% performance boost.',
    longDescription:
      'Enhanced ISP web platform using React/Redux, significantly improving user experience for over 50,000 customers. Led the migration from legacy jQuery application to modern React architecture, achieving substantial performance improvements and reduced maintenance overhead.',
    category: 'Web Application',
    technologies: [
      'React.js',
      'Redux',
      'React Native',
      'JavaScript',
      'HTML5',
      'CSS3',
    ],
    image: '/images/projects/healthcare.png',
    images: [
      '/images/projects/healthcare.png',
      '/images/projects/healthcare.png',
      '/images/projects/healthcare.png',
    ],
    featured: false,
    year: 2020,
    duration: '2 years',
    role: 'Middle Front-End Developer',
    team: '6-8 developers',
    client: 'Inango Systems',
    challenges: [
      'Migrating legacy jQuery codebase to modern React',
      'Improving UX for large customer base',
      'Delivering mobile MVP on tight deadline',
    ],
    solutions: [
      'Executed phased migration from jQuery to React maintaining stability',
      'Implemented React/Redux architecture improving UX by 25%',
      'Delivered React Native MVP 2 weeks ahead of schedule',
    ],
    results: [
      { metric: 'Customers Served', value: '50,000+' },
      { metric: 'Performance Boost', value: '40%' },
      { metric: 'Maintenance Reduction', value: '50%' },
      { metric: 'UX Improvement', value: '25%' },
    ],
  },
  {
    id: 'helios-client-applications',
    title: 'Helios Technologies - Client Web Applications',
    description:
      'Responsive web interfaces for 5 client projects with pixel-perfect Figma design implementation.',
    longDescription:
      'Developed responsive web interfaces for multiple client projects, focusing on pixel-perfect implementation of Figma designs. Built a strong foundation in modern front-end development while ensuring cross-browser compatibility and optimal user experience.',
    category: 'Web Application',
    technologies: [
      'JavaScript',
      'React',
      'HTML5',
      'CSS3',
      'Bootstrap',
      'Figma',
      'Git',
    ],
    image: '/images/projects/generic.png',
    images: [
      '/images/projects/generic.png',
      '/images/projects/generic.png',
      '/images/projects/generic.png',
    ],
    featured: false,
    year: 2018,
    duration: '9 months',
    role: 'Junior Front-End Developer',
    team: '5-7 developers',
    client: 'Helios Technologies',
    challenges: [
      'Implementing complex designs with pixel-perfect accuracy',
      'Ensuring cross-browser compatibility',
      'Building responsive interfaces for various devices',
    ],
    solutions: [
      'Developed systematic approach to Figma-to-code implementation',
      'Created cross-browser testing workflow for 15+ devices',
      'Built responsive components with Bootstrap and custom CSS',
    ],
    results: [
      { metric: 'Client Projects', value: '5' },
      { metric: 'Design Accuracy', value: 'Pixel-perfect' },
      { metric: 'Browser Support', value: '15+ devices' },
    ],
  },
  {
    id: 'personal-portfolio',
    title: 'Personal Portfolio Website',
    description:
      'Modern portfolio built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4 with 95+ Lighthouse target.',
    longDescription:
      'A high-performance personal portfolio showcasing 7+ years of front-end expertise. Built with cutting-edge technologies including Next.js 16 with App Router, React 19, TypeScript 5 in strict mode, and Tailwind CSS v4. Features Framer Motion animations, dark mode support, and comprehensive accessibility.',
    category: 'Personal Project',
    technologies: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'Framer Motion',
      'Radix UI',
      'Vercel',
    ],
    image: '/images/projects/generic.png',
    images: [
      '/images/projects/generic.png',
      '/images/projects/generic.png',
      '/images/projects/generic.png',
    ],
    githubUrl: 'https://github.com/odidukh/personal-website-v2',
    liveUrl: 'https://olesdidukh.dev',
    featured: true,
    year: 2025,
    duration: 'Ongoing',
    role: 'Solo Developer',
    challenges: [
      'Achieving top-tier Core Web Vitals performance',
      'Implementing modern design system with animations',
      'Ensuring comprehensive accessibility compliance',
    ],
    solutions: [
      'Applied performance optimization targeting 95+ Lighthouse scores',
      'Built design system with Tailwind CSS v4 and CSS custom properties',
      'Implemented Framer Motion animations respecting reduced-motion preferences',
    ],
    results: [
      { metric: 'Lighthouse Target', value: '95+' },
      { metric: 'LCP Target', value: '<1.5s' },
      { metric: 'INP Target', value: '<100ms' },
      { metric: 'CLS Target', value: '<0.05' },
    ],
    testimonial: {
      text: 'This portfolio represents the culmination of 7+ years of front-end expertise, showcasing modern best practices in performance, accessibility, and user experience.',
      author: 'Oles Didukh',
      role: 'Developer',
    },
  },
];

// Helper functions
export function getProjectBySlug(slug: string): Project | undefined {
  return projectsData.find(project => project.id === slug);
}

export function getFeaturedProjects(): Project[] {
  return projectsData.filter(project => project.featured);
}

export function getRelatedProjects(projectId: string, limit = 3): Project[] {
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

export function getProjectsByCategory(category: string): Project[] {
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
