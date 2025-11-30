import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
} from './Card';

describe('Card', () => {
  describe('Card component', () => {
    it('renders children', () => {
      render(<Card>Card content</Card>);
      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies default variant classes', () => {
      render(<Card data-testid="card">Content</Card>);
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('rounded-xl', 'shadow-sm');
    });

    it('applies elevated variant', () => {
      render(
        <Card variant="elevated" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('shadow-lg');
    });

    it('applies ghost variant', () => {
      render(
        <Card variant="ghost" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('border-0', 'shadow-none');
    });

    it('applies bordered variant', () => {
      render(
        <Card variant="bordered" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('shadow-none');
    });

    it('applies interactive variant', () => {
      render(
        <Card variant="interactive" data-testid="card">
          Content
        </Card>
      );
      const card = screen.getByTestId('card');
      expect(card).toHaveClass('cursor-pointer');
    });

    it('applies padding none', () => {
      render(
        <Card padding="none" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('p-0');
    });

    it('applies padding sm', () => {
      render(
        <Card padding="sm" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('p-4');
    });

    it('applies padding lg', () => {
      render(
        <Card padding="lg" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('p-8');
    });

    it('forwards ref', () => {
      let cardRef: HTMLDivElement | null = null;
      render(
        <Card
          ref={el => {
            cardRef = el;
          }}
        >
          Content
        </Card>
      );
      expect(cardRef).toBeInstanceOf(HTMLDivElement);
    });

    it('accepts custom className', () => {
      render(
        <Card className="custom-class" data-testid="card">
          Content
        </Card>
      );
      expect(screen.getByTestId('card')).toHaveClass('custom-class');
    });
  });

  describe('CardHeader', () => {
    it('renders children', () => {
      render(<CardHeader>Header content</CardHeader>);
      expect(screen.getByText('Header content')).toBeInTheDocument();
    });

    it('applies flex layout classes', () => {
      render(<CardHeader data-testid="header">Content</CardHeader>);
      expect(screen.getByTestId('header')).toHaveClass('flex', 'flex-col');
    });

    it('forwards ref', () => {
      let headerRef: HTMLDivElement | null = null;
      render(
        <CardHeader
          ref={el => {
            headerRef = el;
          }}
        >
          Content
        </CardHeader>
      );
      expect(headerRef).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('CardTitle', () => {
    it('renders as h3 element', () => {
      render(<CardTitle>Title</CardTitle>);
      const title = screen.getByRole('heading', { level: 3 });
      expect(title).toHaveTextContent('Title');
    });

    it('applies title styles', () => {
      render(<CardTitle data-testid="title">Title</CardTitle>);
      expect(screen.getByTestId('title')).toHaveClass(
        'font-semibold',
        'text-xl'
      );
    });

    it('forwards ref', () => {
      let titleRef: HTMLHeadingElement | null = null;
      render(
        <CardTitle
          ref={el => {
            titleRef = el as HTMLHeadingElement;
          }}
        >
          Title
        </CardTitle>
      );
      expect(titleRef).toBeInstanceOf(HTMLHeadingElement);
    });
  });

  describe('CardDescription', () => {
    it('renders children', () => {
      render(<CardDescription>Description text</CardDescription>);
      expect(screen.getByText('Description text')).toBeInTheDocument();
    });

    it('applies muted text styles', () => {
      render(<CardDescription data-testid="desc">Text</CardDescription>);
      expect(screen.getByTestId('desc')).toHaveClass(
        'text-sm',
        'text-muted-foreground'
      );
    });
  });

  describe('CardContent', () => {
    it('renders children', () => {
      render(<CardContent>Main content</CardContent>);
      expect(screen.getByText('Main content')).toBeInTheDocument();
    });

    it('accepts custom className', () => {
      render(
        <CardContent className="mt-4" data-testid="content">
          Content
        </CardContent>
      );
      expect(screen.getByTestId('content')).toHaveClass('mt-4');
    });
  });

  describe('CardFooter', () => {
    it('renders children', () => {
      render(<CardFooter>Footer content</CardFooter>);
      expect(screen.getByText('Footer content')).toBeInTheDocument();
    });

    it('applies flex layout', () => {
      render(<CardFooter data-testid="footer">Content</CardFooter>);
      expect(screen.getByTestId('footer')).toHaveClass('flex', 'items-center');
    });
  });

  describe('CardImage', () => {
    it('renders with default video aspect ratio', () => {
      render(<CardImage data-testid="image" />);
      expect(screen.getByTestId('image')).toHaveClass('aspect-video');
    });

    it('renders square aspect ratio', () => {
      render(<CardImage aspectRatio="square" data-testid="image" />);
      expect(screen.getByTestId('image')).toHaveClass('aspect-square');
    });

    it('renders portrait aspect ratio', () => {
      render(<CardImage aspectRatio="portrait" data-testid="image" />);
      expect(screen.getByTestId('image')).toHaveClass('aspect-[3/4]');
    });

    it('renders wide aspect ratio', () => {
      render(<CardImage aspectRatio="wide" data-testid="image" />);
      expect(screen.getByTestId('image')).toHaveClass('aspect-[21/9]');
    });

    it('shows fallback when no src provided', () => {
      render(<CardImage />);
      expect(screen.getByText('No image')).toBeInTheDocument();
    });

    it('renders image when src is provided', () => {
      render(<CardImage src="/test.jpg" alt="Test image" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Test image');
    });

    it('uses default alt text when not provided', () => {
      render(<CardImage src="/test.jpg" />);
      const img = screen.getByRole('img');
      expect(img).toHaveAttribute('alt', 'Card image');
    });
  });

  describe('Compound component usage', () => {
    it('renders complete card structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Project Title</CardTitle>
            <CardDescription>Project description</CardDescription>
          </CardHeader>
          <CardContent>Main content here</CardContent>
          <CardFooter>Footer actions</CardFooter>
        </Card>
      );

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent(
        'Project Title'
      );
      expect(screen.getByText('Project description')).toBeInTheDocument();
      expect(screen.getByText('Main content here')).toBeInTheDocument();
      expect(screen.getByText('Footer actions')).toBeInTheDocument();
    });
  });
});
