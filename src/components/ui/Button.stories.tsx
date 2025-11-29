import type { Meta, StoryObj } from '@storybook/nextjs';
import { Mail, ArrowRight, Download } from 'lucide-react';
import { Button } from './Button';

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A versatile button component with multiple variants, sizes, and states. Supports loading states, icons, and can be rendered as a child component using the Slot pattern.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'destructive',
        'outline',
        'secondary',
        'ghost',
        'link',
        'gradient',
        'glow',
      ],
      description: 'The visual style of the button',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl', 'icon'],
      description: 'The size of the button',
    },
    loading: {
      control: 'boolean',
      description: 'Shows a loading spinner and disables the button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    asChild: {
      control: 'boolean',
      description: 'Render as a child component using Radix Slot',
    },
  },
  args: {
    onClick: () => {},
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default variants
export const Default: Story = {
  args: {
    children: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'Link Button',
  },
};

export const Gradient: Story = {
  args: {
    variant: 'gradient',
    children: 'Gradient',
  },
};

export const Glow: Story = {
  args: {
    variant: 'glow',
    children: 'Glow Effect',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large',
  },
};

export const IconButton: Story = {
  args: {
    size: 'icon',
    children: <Mail className="h-4 w-4" />,
    'aria-label': 'Send email',
  },
};

// States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Loading',
  },
};

export const LoadingWithText: Story = {
  args: {
    loading: true,
    loadingText: 'Submitting...',
    children: 'Submit',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Disabled',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    children: (
      <>
        <Mail className="mr-2 h-4 w-4" />
        Send Email
      </>
    ),
  },
};

export const WithRightIcon: Story = {
  args: {
    children: (
      <>
        Continue
        <ArrowRight className="ml-2 h-4 w-4" />
      </>
    ),
  },
};

export const DownloadButton: Story = {
  args: {
    variant: 'outline',
    children: (
      <>
        <Download className="mr-2 h-4 w-4" />
        Download Resume
      </>
    ),
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <Button variant="default">Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
      <Button variant="gradient">Gradient</Button>
      <Button variant="glow">Glow</Button>
    </div>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="xl">Extra Large</Button>
      <Button size="icon">
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  ),
};
