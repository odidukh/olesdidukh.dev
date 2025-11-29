import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
} from './Card';
import { Button } from './Button';
import { Badge } from './Badge';

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible card component using the compound component pattern. Includes Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, and CardImage sub-components.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'ghost', 'bordered', 'interactive'],
      description: 'The visual style of the card',
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      description: 'The internal padding of the card',
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic card
export const Default: Story = {
  render: args => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with some text.</p>
      </CardContent>
    </Card>
  ),
};

export const Elevated: Story = {
  render: args => (
    <Card {...args} variant="elevated" className="w-[350px]">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>This card has an elevated shadow.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content with more prominent shadow.</p>
      </CardContent>
    </Card>
  ),
};

export const Interactive: Story = {
  render: args => (
    <Card {...args} variant="interactive" className="w-[350px]">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see the interaction effect.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card lifts up on hover.</p>
      </CardContent>
    </Card>
  ),
};

export const Ghost: Story = {
  render: args => (
    <Card {...args} variant="ghost" className="w-[350px]">
      <CardHeader>
        <CardTitle>Ghost Card</CardTitle>
        <CardDescription>No border or shadow.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Minimal styling for subtle layouts.</p>
      </CardContent>
    </Card>
  ),
};

export const Bordered: Story = {
  render: args => (
    <Card {...args} variant="bordered" className="w-[350px]">
      <CardHeader>
        <CardTitle>Bordered Card</CardTitle>
        <CardDescription>Border only, no shadow.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Clean bordered look.</p>
      </CardContent>
    </Card>
  ),
};

// With footer
export const WithFooter: Story = {
  render: args => (
    <Card {...args} className="w-[350px]">
      <CardHeader>
        <CardTitle>Card with Footer</CardTitle>
        <CardDescription>This card has action buttons.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Some content here...</p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm">
          Cancel
        </Button>
        <Button size="sm">Submit</Button>
      </CardFooter>
    </Card>
  ),
};

// With image
export const WithImage: Story = {
  render: args => (
    <Card {...args} padding="none" className="w-[350px]">
      <CardImage aspectRatio="video" />
      <div className="p-6">
        <CardHeader className="p-0">
          <CardTitle>Project Name</CardTitle>
          <CardDescription>A brief project description.</CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="flex gap-2">
            <Badge variant="mocha">React</Badge>
            <Badge variant="navy">TypeScript</Badge>
          </div>
        </CardContent>
      </div>
    </Card>
  ),
};

// Project card example
export const ProjectCard: Story = {
  render: args => (
    <Card {...args} variant="interactive" padding="none" className="w-[350px]">
      <CardImage aspectRatio="video" />
      <div className="p-6">
        <CardHeader className="p-0">
          <div className="flex items-center justify-between">
            <CardTitle>E-Commerce Platform</CardTitle>
            <Badge variant="success" size="sm">
              Live
            </Badge>
          </div>
          <CardDescription>
            A modern e-commerce solution with real-time inventory management.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" size="sm">
              Next.js
            </Badge>
            <Badge variant="outline" size="sm">
              Stripe
            </Badge>
            <Badge variant="outline" size="sm">
              PostgreSQL
            </Badge>
          </div>
        </CardContent>
        <CardFooter className="mt-4 gap-2">
          <Button variant="outline" size="sm">
            View Demo
          </Button>
          <Button size="sm">View Code</Button>
        </CardFooter>
      </div>
    </Card>
  ),
};

// Blog post card example
export const BlogPostCard: Story = {
  render: args => (
    <Card {...args} variant="interactive" className="w-[350px]">
      <CardHeader>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>March 15, 2024</span>
          <span>•</span>
          <span>5 min read</span>
        </div>
        <CardTitle>Understanding React Server Components</CardTitle>
        <CardDescription>
          A deep dive into React Server Components and how they change the way
          we build applications.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="mocha" size="sm">
            React
          </Badge>
          <Badge variant="secondary" size="sm">
            Next.js
          </Badge>
        </div>
      </CardContent>
    </Card>
  ),
};

// Padding variants
export const PaddingVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card padding="sm" className="w-[200px]">
        <CardContent>Small padding</CardContent>
      </Card>
      <Card padding="md" className="w-[200px]">
        <CardContent>Medium padding</CardContent>
      </Card>
      <Card padding="lg" className="w-[200px]">
        <CardContent>Large padding</CardContent>
      </Card>
      <Card padding="xl" className="w-[200px]">
        <CardContent>Extra large padding</CardContent>
      </Card>
    </div>
  ),
};

// Image aspect ratios
export const ImageAspectRatios: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Card padding="none" className="w-[200px]">
        <CardImage aspectRatio="square" />
        <div className="p-4">
          <CardDescription>Square (1:1)</CardDescription>
        </div>
      </Card>
      <Card padding="none" className="w-[200px]">
        <CardImage aspectRatio="video" />
        <div className="p-4">
          <CardDescription>Video (16:9)</CardDescription>
        </div>
      </Card>
      <Card padding="none" className="w-[200px]">
        <CardImage aspectRatio="wide" />
        <div className="p-4">
          <CardDescription>Wide (21:9)</CardDescription>
        </div>
      </Card>
      <Card padding="none" className="w-[150px]">
        <CardImage aspectRatio="portrait" />
        <div className="p-4">
          <CardDescription>Portrait (3:4)</CardDescription>
        </div>
      </Card>
    </div>
  ),
};
