import type { Meta, StoryObj } from '@storybook/nextjs';
import { Container } from './Container';
import { Card, CardContent } from './Card';

const meta = {
  title: 'UI/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A responsive container component for consistent page layouts. Supports multiple max-width sizes and padding options.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: [
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        'full',
        'content',
        'narrow',
        'wide',
      ],
      description: 'The maximum width of the container',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The horizontal padding',
    },
    paddingY: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'The vertical padding',
    },
    as: {
      control: 'select',
      options: ['div', 'section', 'main', 'article'],
      description: 'The HTML element to render',
    },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper to show container boundaries
const ContainerContent = ({ label }: { label: string }) => (
  <div className="bg-mocha-100 dark:bg-navy-800 p-4 rounded-lg border-2 border-dashed border-mocha-300 dark:border-navy-600">
    <p className="text-center text-sm text-muted-foreground">{label}</p>
  </div>
);

// Default
export const Default: Story = {
  args: {
    children: (
      <ContainerContent label="Default Container (xl, max-w-screen-xl)" />
    ),
  },
};

// Size variants
export const Small: Story = {
  args: {
    size: 'sm',
    children: <ContainerContent label="Small (max-w-screen-sm, 640px)" />,
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: <ContainerContent label="Medium (max-w-screen-md, 768px)" />,
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: <ContainerContent label="Large (max-w-screen-lg, 1024px)" />,
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: (
      <ContainerContent label="Extra Large (max-w-screen-xl, 1280px)" />
    ),
  },
};

export const TwoXL: Story = {
  args: {
    size: '2xl',
    children: <ContainerContent label="2XL (max-w-screen-2xl, 1536px)" />,
  },
};

export const Full: Story = {
  args: {
    size: 'full',
    children: <ContainerContent label="Full Width (max-w-full)" />,
  },
};

export const Content: Story = {
  args: {
    size: 'content',
    children: (
      <ContainerContent label="Content (max-w-4xl, 896px) - optimized for reading" />
    ),
  },
};

export const Narrow: Story = {
  args: {
    size: 'narrow',
    children: (
      <ContainerContent label="Narrow (max-w-2xl, 672px) - for text-heavy content" />
    ),
  },
};

export const Wide: Story = {
  args: {
    size: 'wide',
    children: (
      <ContainerContent label="Wide (max-w-7xl, 1280px) - for dashboards" />
    ),
  },
};

// Padding variants
export const NoPadding: Story = {
  args: {
    padding: 'none',
    children: <ContainerContent label="No horizontal padding" />,
  },
};

export const SmallPadding: Story = {
  args: {
    padding: 'sm',
    children: <ContainerContent label="Small padding (px-4 sm:px-6)" />,
  },
};

export const MediumPadding: Story = {
  args: {
    padding: 'md',
    children: (
      <ContainerContent label="Medium padding (px-4 sm:px-6 lg:px-8)" />
    ),
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'lg',
    children: (
      <ContainerContent label="Large padding (px-6 sm:px-8 lg:px-12)" />
    ),
  },
};

// Vertical padding
export const WithVerticalPadding: Story = {
  args: {
    paddingY: 'lg',
    children: <ContainerContent label="With vertical padding (py-12)" />,
  },
};

// Semantic HTML
export const AsSection: Story = {
  args: {
    as: 'section',
    paddingY: 'lg',
    children: (
      <div>
        <h2 className="text-2xl font-bold mb-4">Section Title</h2>
        <p className="text-muted-foreground">
          This container renders as a &lt;section&gt; element.
        </p>
      </div>
    ),
  },
};

export const AsMain: Story = {
  args: {
    as: 'main',
    paddingY: 'lg',
    children: (
      <div>
        <h1 className="text-3xl font-bold mb-4">Main Content</h1>
        <p className="text-muted-foreground">
          This container renders as a &lt;main&gt; element.
        </p>
      </div>
    ),
  },
};

// Real-world examples
export const BlogLayout: Story = {
  render: () => (
    <div className="min-h-screen bg-background">
      <Container size="content" paddingY="xl">
        <article className="prose dark:prose-invert">
          <h1>Blog Post Title</h1>
          <p className="lead">
            This is a blog post layout using the content size container,
            optimized for reading with a comfortable line length.
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris.
          </p>
        </article>
      </Container>
    </div>
  ),
};

export const DashboardLayout: Story = {
  render: () => (
    <div className="min-h-screen bg-muted/30">
      <Container size="wide" paddingY="lg">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Card 1</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Card 2</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">Card 3</p>
            </CardContent>
          </Card>
        </div>
      </Container>
    </div>
  ),
};

// All sizes comparison
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4 py-8">
      <Container size="sm">
        <ContainerContent label="sm (640px)" />
      </Container>
      <Container size="md">
        <ContainerContent label="md (768px)" />
      </Container>
      <Container size="lg">
        <ContainerContent label="lg (1024px)" />
      </Container>
      <Container size="xl">
        <ContainerContent label="xl (1280px)" />
      </Container>
      <Container size="2xl">
        <ContainerContent label="2xl (1536px)" />
      </Container>
    </div>
  ),
};
