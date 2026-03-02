import { describe, it, expect, vi, beforeEach } from 'vitest';
import { axe } from 'vitest-axe';
import { render, screen } from '@/test/test-utils';
import { Navigation } from './Navigation';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => '/'),
}));

// Mock the theme store
vi.mock('@/stores', () => ({
  useThemeStore: vi.fn(() => ({
    resolvedTheme: 'light',
    toggleTheme: vi.fn(),
  })),
}));

describe('Navigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the logo with correct text', () => {
    render(<Navigation />);

    expect(screen.getByText('Oles Didukh')).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Navigation />);

    const expectedLinks = [
      'About',
      'Experience',
      // 'Projects',
      'Skills',
      'Uses',
      'Blog',
      'Contact',
    ];

    expectedLinks.forEach(linkText => {
      expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument();
    });
  });

  it('renders social links on desktop', () => {
    render(<Navigation />);

    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument();
  });

  it('renders theme toggle button', () => {
    render(<Navigation />);

    expect(
      screen.getByRole('button', { name: /toggle dark mode/i })
    ).toBeInTheDocument();
  });

  it('renders mobile menu toggle button', () => {
    render(<Navigation />);

    expect(
      screen.getByRole('button', { name: /open menu/i })
    ).toBeInTheDocument();
  });

  it('toggles mobile menu when clicking menu button', async () => {
    const { user } = render(<Navigation />);

    const menuButton = screen.getByRole('button', { name: /open menu/i });

    // Mobile menu should be hidden initially
    expect(screen.queryByText('About')).toBeInTheDocument(); // Desktop links are always visible

    // Click to open mobile menu
    await user.click(menuButton);

    // Mobile navigation should now be visible
    const mobileNav = screen.getByRole('navigation');
    expect(mobileNav).toBeInTheDocument();
  });

  it('social links have correct hrefs and open in new tab', () => {
    render(<Navigation />);

    const githubLink = screen.getByRole('link', { name: /github/i });
    expect(githubLink).toHaveAttribute('href', 'https://github.com/odidukh');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toHaveAttribute(
      'href',
      'https://linkedin.com/in/oles-didukh'
    );
    expect(linkedinLink).toHaveAttribute('target', '_blank');
  });

  it('email link has correct mailto href', () => {
    render(<Navigation />);

    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:oles.didukh@gmail.com');
  });

  it('logo links to home page', () => {
    render(<Navigation />);

    const logoLink = screen.getByRole('link', { name: /oles didukh/i });
    expect(logoLink).toHaveAttribute('href', '/');
  });

  it('accepts additional className', () => {
    render(<Navigation className="custom-nav-class" />);

    const header = screen.getByRole('banner');
    expect(header).toHaveClass('custom-nav-class');
  });

  it('passes accessibility audit', async () => {
    const { container } = render(<Navigation />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has proper header landmark', () => {
    render(<Navigation />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('has proper navigation landmark', () => {
    render(<Navigation />);

    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});

describe('Navigation - Theme Toggle', () => {
  it('calls toggleTheme when theme button is clicked', async () => {
    const mockToggleTheme = vi.fn();
    const { useThemeStore } = await import('@/stores');
    vi.mocked(useThemeStore).mockReturnValue({
      resolvedTheme: 'light',
      toggleTheme: mockToggleTheme,
      mode: 'light',
      setMode: vi.fn(),
    });

    const { user } = render(<Navigation />);

    const themeButton = screen.getByRole('button', {
      name: /toggle dark mode/i,
    });
    await user.click(themeButton);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
