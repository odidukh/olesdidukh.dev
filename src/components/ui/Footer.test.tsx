import { describe, it, expect, vi } from 'vitest';
import { axe } from 'vitest-axe';
import { render, screen } from '@/test/test-utils';
import { Footer } from './Footer';

// Mock the NewsletterForm component to avoid complex form testing
vi.mock('./NewsletterForm', () => ({
  NewsletterForm: () => (
    <div data-testid="newsletter-form">Newsletter Form</div>
  ),
}));

// Mock the ResumeDownloadLink component
vi.mock('./ResumeDownloadButton', () => ({
  ResumeDownloadLink: ({ children }: { children: React.ReactNode }) => (
    <a href="/resume.pdf" data-testid="resume-link">
      {children}
    </a>
  ),
}));

describe('Footer', () => {
  it('renders the brand name', () => {
    render(<Footer />);

    expect(screen.getByText('Oles Didukh')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Footer />);

    expect(
      screen.getByText(
        /Senior Front-End Engineer crafting exceptional digital experiences/i
      )
    ).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    render(<Footer />);

    const expectedLinks = [
      'About',
      'Experience',
      'Projects',
      'Skills',
      'Blog',
      'Contact',
    ];

    expectedLinks.forEach(linkText => {
      expect(screen.getByRole('link', { name: linkText })).toBeInTheDocument();
    });
  });

  it('renders resource links', () => {
    render(<Footer />);

    expect(
      screen.getByRole('link', { name: /case studies/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /testimonials/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /privacy policy/i })
    ).toBeInTheDocument();
  });

  it('renders tech stack badges', () => {
    render(<Footer />);

    const techStack = [
      'React',
      'TypeScript',
      'Next.js',
      'Tailwind CSS',
      'Node.js',
    ];

    techStack.forEach(tech => {
      expect(screen.getByText(tech)).toBeInTheDocument();
    });
  });

  it('renders social links', () => {
    render(<Footer />);

    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /threads/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument();
  });

  it('social links have correct hrefs and security attributes', () => {
    render(<Footer />);

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

    const threadsLink = screen.getByRole('link', { name: /threads/i });
    expect(threadsLink).toHaveAttribute(
      'href',
      'https://www.threads.com/@oles.o.didukh'
    );
    expect(threadsLink).toHaveAttribute('target', '_blank');
  });

  it('renders location information', () => {
    render(<Footer />);

    expect(screen.getByText('Vinnytsia, Ukraine')).toBeInTheDocument();
  });

  it('renders email contact', () => {
    render(<Footer />);

    const emailLink = screen.getByRole('link', {
      name: /oles\.didukh@gmail\.com/i,
    });
    expect(emailLink).toHaveAttribute('href', 'mailto:oles.didukh@gmail.com');
  });

  it('renders phone number', () => {
    render(<Footer />);

    expect(screen.getByText('+38 067 88 99 570')).toBeInTheDocument();
  });

  it('renders current year in copyright', () => {
    render(<Footer />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(new RegExp(`© ${currentYear} Oles Didukh`))
    ).toBeInTheDocument();
  });

  it('renders built with message', () => {
    render(<Footer />);

    expect(screen.getByText(/Built with/i)).toBeInTheDocument();
    expect(
      screen.getByText(/using Next.js & Tailwind CSS/i)
    ).toBeInTheDocument();
  });

  it('renders newsletter form', () => {
    render(<Footer />);

    expect(screen.getByTestId('newsletter-form')).toBeInTheDocument();
  });

  it('renders resume download link', () => {
    render(<Footer />);

    expect(screen.getByTestId('resume-link')).toBeInTheDocument();
    expect(screen.getByText('Resume')).toBeInTheDocument();
  });

  it('accepts additional className', () => {
    render(<Footer className="custom-footer-class" />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toHaveClass('custom-footer-class');
  });

  it('has proper footer landmark', () => {
    render(<Footer />);

    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('passes accessibility audit', async () => {
    const { container } = render(<Footer />);

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('renders section headings', () => {
    render(<Footer />);

    expect(screen.getByText('Navigation')).toBeInTheDocument();
    expect(screen.getByText('Resources')).toBeInTheDocument();
    expect(screen.getByText('Tech Stack')).toBeInTheDocument();
    expect(screen.getByText('Connect')).toBeInTheDocument();
    expect(screen.getByText('Stay Updated')).toBeInTheDocument();
  });
});
