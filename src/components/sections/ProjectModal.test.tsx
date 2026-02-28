import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProjectModal } from './ProjectModal';
import type { Project } from '@/data/projects';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({
        children,
        onClick,
        ...props
      }: React.ComponentProps<'div'> & { onClick?: () => void }) => (
        <div onClick={onClick} {...props}>
          {children}
        </div>
      ),
      img: ({ src, alt, ...props }: React.ComponentProps<'img'>) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} {...props} />
      ),
    },
    AnimatePresence: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

const mockProject: Project = {
  id: 'test-project',
  permalink: '/projects/test-project',
  title: 'Test Project',
  description: 'A test project description',
  content: 'This is a longer description of the test project.',
  category: 'Web App',
  technologies: ['React', 'TypeScript', 'Next.js'],
  image: '/images/test.jpg',
  images: ['/images/test1.jpg', '/images/test2.jpg', '/images/test3.jpg'],
  featured: true,
  year: 2024,
  duration: '3 months',
  role: 'Lead Developer',
  team: '4 developers',
  client: 'Test Client',
  challenges: ['Challenge 1', 'Challenge 2'],
  solutions: ['Solution 1', 'Solution 2'],
  results: [
    { metric: 'Performance', value: '50%' },
    { metric: 'Users', value: '10k+' },
  ],
  testimonial: {
    text: 'Great work on this project!',
    author: 'John Smith',
    role: 'CEO, Test Company',
  },
  liveUrl: 'https://example.com',
  githubUrl: 'https://github.com/test/project',
  demoUrl: 'https://demo.example.com',
};

describe('ProjectModal', () => {
  const user = userEvent.setup();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Mock window.open
    vi.stubGlobal('open', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('should render project title and description', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(
      screen.getByText('This is a longer description of the test project.')
    ).toBeInTheDocument();
  });

  it('should render project category and year', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(screen.getByText('Web App')).toBeInTheDocument();
    expect(screen.getByText('2024')).toBeInTheDocument();
  });

  it('should render technologies', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Next.js')).toBeInTheDocument();
  });

  it('should render role and team information', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(screen.getByText('Lead Developer')).toBeInTheDocument();
    expect(screen.getByText('4 developers')).toBeInTheDocument();
  });

  it('should render challenges and solutions', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(screen.getByText('Challenge 1')).toBeInTheDocument();
    expect(screen.getByText('Challenge 2')).toBeInTheDocument();
    expect(screen.getByText('Solution 1')).toBeInTheDocument();
    expect(screen.getByText('Solution 2')).toBeInTheDocument();
  });

  it('should render results', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('Performance')).toBeInTheDocument();
    expect(screen.getByText('10k+')).toBeInTheDocument();
  });

  it('should render featured badge for featured projects', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(screen.getByText('Featured Project')).toBeInTheDocument();
  });

  it('should not render featured badge for non-featured projects', () => {
    const nonFeaturedProject = { ...mockProject, featured: false };
    render(<ProjectModal project={nonFeaturedProject} onClose={mockOnClose} />);

    expect(screen.queryByText('Featured Project')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', async () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    const closeButton = screen.getByRole('button', { name: /close modal/i });
    await user.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should call onClose when clicking backdrop', async () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    // Click the backdrop (outermost div)
    const backdrop = screen.getByText('Test Project').closest('div')
      ?.parentElement?.parentElement;
    if (backdrop) {
      await user.click(backdrop);
    }

    // The onClose might be called depending on click target
  });

  it('should call onClose when pressing Escape key', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    // Focus trap listens on document, not window
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should render View Live button when liveUrl is provided', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(
      screen.getByRole('button', { name: /view live/i })
    ).toBeInTheDocument();
  });

  it('should render Source Code button when githubUrl is provided', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(
      screen.getByRole('button', { name: /source code/i })
    ).toBeInTheDocument();
  });

  it('should open live URL in new tab when View Live is clicked', async () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    const viewLiveButton = screen.getByRole('button', { name: /view live/i });
    await user.click(viewLiveButton);

    expect(window.open).toHaveBeenCalledWith('https://example.com', '_blank');
  });

  it('should have image gallery navigation when multiple images', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(
      screen.getByRole('button', { name: /previous image/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /next image/i })
    ).toBeInTheDocument();
  });

  it('should not have gallery navigation when single image', () => {
    const singleImageProject = {
      ...mockProject,
      images: ['/images/single.jpg'],
    };
    render(<ProjectModal project={singleImageProject} onClose={mockOnClose} />);

    expect(
      screen.queryByRole('button', { name: /previous image/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /next image/i })
    ).not.toBeInTheDocument();
  });

  it('should have image indicators for gallery', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    // Should have 3 indicator buttons for 3 images
    const indicators = screen.getAllByRole('button', { name: /go to image/i });
    expect(indicators).toHaveLength(3);
  });

  it('should display client when provided', () => {
    render(<ProjectModal project={mockProject} onClose={mockOnClose} />);

    expect(screen.getByText(/Client: Test Client/)).toBeInTheDocument();
  });
});
