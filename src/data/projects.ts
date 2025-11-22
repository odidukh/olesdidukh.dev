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
}

export const projectsData: Project[] = [
  {
    id: 'safebooks-ai',
    title: 'Safebooks AI Platform',
    description:
      'AI-powered bookkeeping platform with automated invoice processing and real-time financial insights.',
    longDescription:
      'Led the front-end development of a revolutionary AI-powered bookkeeping platform that automates financial workflows for small and medium businesses. The platform uses machine learning to process invoices, categorize expenses, and provide real-time financial insights.',
    category: 'SaaS',
    technologies: [
      'React',
      'TypeScript',
      'Next.js',
      'Redux',
      'Tailwind CSS',
      'AWS',
      'GraphQL',
    ],
    image: '/images/projects/safebooks.png',
    images: [
      '/images/projects/safebooks.png',
      '/images/projects/safebooks.png',
      '/images/projects/safebooks.png',
    ],
    demoUrl: 'https://demo.safebooks.ai',
    liveUrl: 'https://safebooks.ai',
    featured: true,
    year: 2024,
    duration: '8 months',
    role: 'Senior Front-End Engineer',
    team: '12 developers',
    client: 'Safebooks AI Inc.',
    challenges: [
      'Complex state management for real-time financial data',
      'Performance optimization for large datasets',
      'Implementing secure file upload and processing',
    ],
    solutions: [
      'Implemented Redux Toolkit with RTK Query for efficient data fetching',
      'Used virtualization and pagination for handling 100k+ transactions',
      'Built secure upload pipeline with AWS S3 and Lambda',
    ],
    results: [
      { metric: 'Performance', value: '40% faster load times' },
      { metric: 'User Growth', value: '10,000+ active users' },
      { metric: 'Processing Speed', value: '3x faster invoice processing' },
    ],
    testimonial: {
      text: 'Oles transformed our vision into reality. His technical expertise and attention to detail resulted in a platform that exceeded our expectations.',
      author: 'Sarah Johnson',
      role: 'CTO, Safebooks AI',
    },
  },
  {
    id: 'ecommerce-platform',
    title: 'E-Commerce Marketplace',
    description:
      'Multi-vendor marketplace with real-time inventory management and advanced search capabilities.',
    longDescription:
      'Developed a comprehensive e-commerce platform supporting multiple vendors, real-time inventory tracking, and AI-powered product recommendations. The platform handles thousands of concurrent users and millions of products.',
    category: 'E-Commerce',
    technologies: [
      'React',
      'TypeScript',
      'Node.js',
      'PostgreSQL',
      'Redis',
      'Docker',
      'Stripe',
    ],
    image: '/images/projects/ecommerce.png',
    images: [
      '/images/projects/ecommerce.png',
      '/images/projects/ecommerce.png',
      '/images/projects/ecommerce.png',
    ],
    githubUrl: 'https://github.com/odidukh/ecommerce-platform',
    featured: true,
    year: 2023,
    duration: '6 months',
    role: 'Lead Front-End Developer',
    team: '8 developers',
    challenges: [
      'Real-time inventory synchronization across vendors',
      'Complex filtering and search functionality',
      'Payment integration with multiple providers',
    ],
    solutions: [
      'Implemented WebSocket connections for real-time updates',
      'Built advanced search with Elasticsearch integration',
      'Created unified payment gateway abstraction',
    ],
    results: [
      { metric: 'Transaction Volume', value: '$2M+ monthly' },
      { metric: 'Page Load Speed', value: 'Under 2 seconds' },
      { metric: 'Conversion Rate', value: '3.5% improvement' },
    ],
  },
  {
    id: 'healthcare-portal',
    title: 'Healthcare Patient Portal',
    description:
      'HIPAA-compliant patient portal with telemedicine capabilities and appointment scheduling.',
    longDescription:
      'Built a secure healthcare portal enabling patients to schedule appointments, access medical records, and conduct video consultations with healthcare providers. Implemented strict security measures to ensure HIPAA compliance.',
    category: 'Web Application',
    technologies: [
      'React',
      'TypeScript',
      'Express.js',
      'MongoDB',
      'WebRTC',
      'JWT',
      'Socket.io',
    ],
    image: '/images/projects/healthcare.png',
    images: [
      '/images/projects/healthcare.png',
      '/images/projects/healthcare.png',
      '/images/projects/healthcare.png',
    ],
    featured: true,
    year: 2023,
    duration: '10 months',
    role: 'Senior Front-End Developer',
    team: '15 developers',
    challenges: [
      'HIPAA compliance and data security',
      'Real-time video consultation implementation',
      'Complex appointment scheduling logic',
    ],
    solutions: [
      'Implemented end-to-end encryption for all data',
      'Built WebRTC-based video system with fallbacks',
      'Created intelligent scheduling algorithm',
    ],
    results: [
      { metric: 'Patient Satisfaction', value: '95% rating' },
      {
        metric: 'Appointment Efficiency',
        value: '30% reduction in wait times',
      },
      { metric: 'Security Audits', value: '100% pass rate' },
    ],
  },
  {
    id: 'fintech-dashboard',
    title: 'FinTech Analytics Dashboard',
    description:
      'Real-time financial analytics dashboard with advanced charting and reporting capabilities.',
    longDescription:
      'Created a sophisticated financial analytics platform providing real-time market data, portfolio analysis, and automated trading insights for institutional investors.',
    category: 'SaaS',
    technologies: [
      'React',
      'TypeScript',
      'D3.js',
      'GraphQL',
      'PostgreSQL',
      'Redis',
      'AWS',
    ],
    image: '/images/projects/safebooks.png',
    images: [
      '/images/projects/safebooks.png',
      '/images/projects/safebooks.png',
      '/images/projects/safebooks.png',
    ],
    demoUrl: 'https://demo.fintech-dashboard.com',
    featured: false,
    year: 2022,
    duration: '4 months',
    role: 'Front-End Developer',
    team: '6 developers',
    challenges: [
      'Real-time data visualization of millions of data points',
      'Complex financial calculations on the client side',
      'Mobile responsiveness for data-heavy interfaces',
    ],
    solutions: [
      'Implemented efficient D3.js visualizations with canvas rendering',
      'Used Web Workers for heavy calculations',
      'Created adaptive layouts for different screen sizes',
    ],
    results: [
      { metric: 'Data Processing', value: '1M+ data points/second' },
      { metric: 'Response Time', value: 'Under 100ms' },
      { metric: 'User Retention', value: '85% monthly active users' },
    ],
  },
  {
    id: 'social-platform',
    title: 'Social Learning Platform',
    description:
      'Educational social network connecting students and teachers with interactive learning tools.',
    longDescription:
      'Developed a social learning platform that combines traditional educational tools with social networking features, enabling collaborative learning and knowledge sharing among students and educators.',
    category: 'Web Application',
    technologies: [
      'React',
      'Redux',
      'Node.js',
      'MongoDB',
      'Socket.io',
      'WebRTC',
      'AWS',
    ],
    image: '/images/projects/generic.png',
    images: [
      '/images/projects/generic.png',
      '/images/projects/generic.png',
      '/images/projects/generic.png',
    ],
    githubUrl: 'https://github.com/odidukh/social-learning',
    featured: false,
    year: 2022,
    duration: '5 months',
    role: 'Full Stack Developer',
    team: '4 developers',
    challenges: [
      'Real-time collaboration features',
      'Scalable video streaming for online classes',
      'Content moderation and safety',
    ],
    solutions: [
      'Built real-time whiteboard with Socket.io',
      'Implemented adaptive bitrate streaming',
      'Created AI-powered content moderation system',
    ],
    results: [
      { metric: 'Active Users', value: '50,000+ students' },
      { metric: 'Engagement Rate', value: '75% daily active users' },
      { metric: 'Content Created', value: '100,000+ resources' },
    ],
  },
  {
    id: 'mobile-fitness',
    title: 'Fitness Tracker Mobile App',
    description:
      'Cross-platform mobile application for fitness tracking with AI-powered workout recommendations.',
    longDescription:
      'Built a React Native fitness application featuring workout tracking, nutrition logging, and AI-powered personalized fitness plans based on user goals and progress.',
    category: 'Mobile App',
    technologies: [
      'React Native',
      'TypeScript',
      'Redux',
      'Firebase',
      'TensorFlow.js',
    ],
    image: '/images/projects/generic.png',
    images: [
      '/images/projects/generic.png',
      '/images/projects/generic.png',
      '/images/projects/generic.png',
    ],
    featured: false,
    year: 2021,
    duration: '3 months',
    role: 'Mobile Developer',
    team: '3 developers',
    challenges: [
      'Cross-platform compatibility',
      'Offline functionality',
      'AI model integration in mobile environment',
    ],
    solutions: [
      'Used React Native for true cross-platform development',
      'Implemented offline-first architecture with sync',
      'Optimized TensorFlow.js models for mobile',
    ],
    results: [
      { metric: 'Downloads', value: '100,000+' },
      { metric: 'App Store Rating', value: '4.8 stars' },
      { metric: 'User Retention', value: '60% after 30 days' },
    ],
  },
  {
    id: 'cms-platform',
    title: 'Headless CMS Platform',
    description:
      'Modern headless CMS with visual editor and multi-channel content delivery.',
    longDescription:
      'Developed a headless CMS platform that allows content creators to manage and distribute content across multiple channels with a intuitive visual editor and powerful API.',
    category: 'SaaS',
    technologies: [
      'React',
      'TypeScript',
      'GraphQL',
      'Node.js',
      'PostgreSQL',
      'Docker',
    ],
    image: '/images/projects/generic.png',
    images: [
      '/images/projects/generic.png',
      '/images/projects/generic.png',
      '/images/projects/generic.png',
    ],
    githubUrl: 'https://github.com/odidukh/headless-cms',
    featured: false,
    year: 2021,
    duration: '6 months',
    role: 'Lead Developer',
    team: '5 developers',
    challenges: [
      'Visual drag-and-drop editor implementation',
      'Multi-tenant architecture',
      'API performance optimization',
    ],
    solutions: [
      'Built custom drag-and-drop engine with React DnD',
      'Implemented row-level security in PostgreSQL',
      'Used caching and CDN for API optimization',
    ],
    results: [
      { metric: 'API Response Time', value: 'Under 50ms' },
      { metric: 'Content Delivery', value: '1B+ API calls/month' },
      { metric: 'Customer Sites', value: '1,000+ websites' },
    ],
  },
  {
    id: 'open-source-ui',
    title: 'React UI Component Library',
    description:
      'Open-source React component library with 50+ accessible, customizable components.',
    longDescription:
      'Created and maintain a popular open-source React component library focused on accessibility, performance, and developer experience. The library includes comprehensive documentation and testing.',
    category: 'Open Source',
    technologies: [
      'React',
      'TypeScript',
      'Storybook',
      'Jest',
      'Rollup',
      'CSS-in-JS',
    ],
    image: '/images/projects/ui-library.png',
    images: [
      '/images/projects/ui-library.png',
      '/images/projects/ui-library.png',
      '/images/projects/ui-library.png',
    ],
    githubUrl: 'https://github.com/odidukh/react-ui-library',
    demoUrl: 'https://ui-library-demo.vercel.app',
    featured: true,
    year: 2023,
    duration: 'Ongoing',
    role: 'Creator & Maintainer',
    challenges: [
      'Ensuring accessibility compliance',
      'Supporting multiple styling solutions',
      'Maintaining backward compatibility',
    ],
    solutions: [
      'Automated accessibility testing with jest-axe',
      'CSS-in-JS with theming support',
      'Semantic versioning and migration guides',
    ],
    results: [
      { metric: 'GitHub Stars', value: '2,500+' },
      { metric: 'Weekly Downloads', value: '10,000+' },
      { metric: 'Contributors', value: '50+' },
    ],
  },
];
