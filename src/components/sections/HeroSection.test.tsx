import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { HeroSection } from './HeroSection';

// Mock framer-motion
vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion');
  return {
    ...actual,
    motion: {
      div: ({ children, ...props }: React.ComponentProps<'div'>) => (
        <div {...props}>{children}</div>
      ),
      p: ({ children, ...props }: React.ComponentProps<'p'>) => (
        <p {...props}>{children}</p>
      ),
      section: ({ children, ...props }: React.ComponentProps<'section'>) => (
        <section {...props}>{children}</section>
      ),
    },
    useScroll: () => ({ scrollY: { get: () => 0 } }),
    useTransform: () => ({ get: () => 0 }),
    useMotionValue: () => ({ set: vi.fn(), get: () => 0 }),
    useSpring: () => ({ get: () => 0 }),
  };
});

// Mock child components that might cause issues
vi.mock('../ui/TypeAnimation', () => ({
  TypeAnimation: ({ sequence }: { sequence: (string | number)[] }) => (
    <span>{sequence[0]}</span>
  ),
}));

vi.mock('../ui/backgrounds/SunsetCodeRainBackground', () => ({
  SunsetCodeRainBackground: () => (
    <div data-testid="sunset-code-rain-background" />
  ),
}));

vi.mock('../ui/ResumeDownloadButton', () => ({
  ResumeDownloadButton: ({
    children,
    ...props
  }: React.ComponentProps<'button'>) => (
    <button {...props}>{children || 'Download Resume'}</button>
  ),
}));

// Mock next/link
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe('HeroSection', () => {
  it('should render the greeting badge', () => {
    render(<HeroSection />);

    expect(
      screen.getByText(/available for new opportunities/i)
    ).toBeInTheDocument();
  });

  it('should render the main heading with name', () => {
    render(<HeroSection />);

    expect(screen.getByText(/Hi, I'm/i)).toBeInTheDocument();
    expect(screen.getByText('Oles')).toBeInTheDocument();
  });

  it('should render the tagline with type animation', () => {
    render(<HeroSection />);

    expect(screen.getByText(/I build/i)).toBeInTheDocument();
    expect(screen.getByText(/exceptional web apps/i)).toBeInTheDocument();
  });

  it('should render the description with experience', () => {
    render(<HeroSection />);

    // There are multiple "Senior Front-End Engineer" texts (description + code block)
    const matches = screen.getAllByText(/Senior Front-End Engineer/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
    // The "7+ years" text is in a span
    expect(screen.getByText('7+ years')).toBeInTheDocument();
  });

  // it('should render the View My Work CTA button', () => {
  //   render(<HeroSection />);
  //
  //   const viewWorkLink = screen.getByRole('link', { name: /view my work/i });
  //   expect(viewWorkLink).toBeInTheDocument();
  //   expect(viewWorkLink).toHaveAttribute('href', '/projects');
  // });

  it('should render the Download Resume button', () => {
    render(<HeroSection />);

    expect(
      screen.getByRole('button', { name: /download resume/i })
    ).toBeInTheDocument();
  });

  it('should render social links', () => {
    render(<HeroSection />);

    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/odidukh'
    );
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/oles-didukh'
    );
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
      'href',
      'mailto:oles.didukh@gmail.com'
    );
  });

  it('should render experience stats', () => {
    render(<HeroSection />);

    expect(screen.getByText('7+')).toBeInTheDocument();
    expect(screen.getByText('Years Experience')).toBeInTheDocument();
    expect(screen.getByText('60K+')).toBeInTheDocument();
    expect(screen.getByText('Users Impacted')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
  });

  it('should render the code block with developer info', () => {
    render(<HeroSection />);

    expect(screen.getByText('portfolio.tsx')).toBeInTheDocument();
    expect(screen.getByText(/"Oles Didukh"/)).toBeInTheDocument();
    expect(screen.getByText(/"Senior Front-End Engineer"/)).toBeInTheDocument();
  });

  it('should render skills in the code block', () => {
    render(<HeroSection />);

    expect(screen.getByText(/"React"/)).toBeInTheDocument();
    expect(screen.getByText(/"TypeScript"/)).toBeInTheDocument();
    expect(screen.getByText(/"Next.js"/)).toBeInTheDocument();
    expect(screen.getByText(/"Node.js"/)).toBeInTheDocument();
    expect(screen.getByText(/"AWS"/)).toBeInTheDocument();
  });

  it('should render the scroll indicator', () => {
    render(<HeroSection />);

    expect(screen.getByText(/scroll/i)).toBeInTheDocument();
  });

  it('should have proper accessibility attributes on social links', () => {
    render(<HeroSection />);

    const githubLink = screen.getByRole('link', { name: /github/i });
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });

    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(linkedinLink).toHaveAttribute('target', '_blank');
    expect(linkedinLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render background elements', () => {
    render(<HeroSection />);

    expect(
      screen.getByTestId('sunset-code-rain-background')
    ).toBeInTheDocument();
  });

  it('should render technologies mentioned', () => {
    render(<HeroSection />);

    expect(screen.getByText(/React, TypeScript/i)).toBeInTheDocument();
    expect(screen.getByText(/modern web technologies/i)).toBeInTheDocument();
  });
});
