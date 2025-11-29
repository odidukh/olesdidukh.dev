import type { Meta, StoryObj } from '@storybook/nextjs';
import { Check, Star, Zap } from 'lucide-react';
import { Badge } from './Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A badge component for displaying status, labels, or tags. Supports multiple color variants, sizes, and optional icons or remove buttons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'default',
        'secondary',
        'destructive',
        'outline',
        'success',
        'warning',
        'info',
        'mocha',
        'navy',
        'ghost',
      ],
      description: 'The color variant of the badge',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'The size of the badge',
    },
    rounded: {
      control: 'select',
      options: ['full', 'lg', 'md', 'sm'],
      description: 'The border radius of the badge',
    },
  },
  args: {
    children: 'Badge',
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default variants
export const Default: Story = {
  args: {
    children: 'Default',
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
    children: 'Error',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};

export const Mocha: Story = {
  args: {
    variant: 'mocha',
    children: 'Mocha',
  },
};

export const Navy: Story = {
  args: {
    variant: 'navy',
    children: 'Navy',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Ghost',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

// Rounded variants
export const RoundedFull: Story = {
  args: {
    rounded: 'full',
    children: 'Rounded Full',
  },
};

export const RoundedLg: Story = {
  args: {
    rounded: 'lg',
    children: 'Rounded LG',
  },
};

export const RoundedMd: Story = {
  args: {
    rounded: 'md',
    children: 'Rounded MD',
  },
};

export const RoundedSm: Story = {
  args: {
    rounded: 'sm',
    children: 'Rounded SM',
  },
};

// With icon
export const WithIcon: Story = {
  args: {
    variant: 'success',
    icon: <Check className="h-3 w-3" />,
    children: 'Completed',
  },
};

export const WithStarIcon: Story = {
  args: {
    variant: 'warning',
    icon: <Star className="h-3 w-3" />,
    children: 'Featured',
  },
};

export const WithZapIcon: Story = {
  args: {
    variant: 'mocha',
    icon: <Zap className="h-3 w-3" />,
    children: 'New',
  },
};

// Removable badge
export const Removable: Story = {
  args: {
    variant: 'secondary',
    children: 'React',
    onRemove: () => {},
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="mocha">Mocha</Badge>
      <Badge variant="navy">Navy</Badge>
      <Badge variant="ghost">Ghost</Badge>
    </div>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="sm">Small</Badge>
      <Badge size="md">Medium</Badge>
      <Badge size="lg">Large</Badge>
    </div>
  ),
};

// Technology tags example
export const TechnologyTags: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="mocha">React</Badge>
      <Badge variant="navy">TypeScript</Badge>
      <Badge variant="secondary">Next.js</Badge>
      <Badge variant="outline">Tailwind CSS</Badge>
      <Badge variant="ghost">Framer Motion</Badge>
    </div>
  ),
};

// Status badges example
export const StatusBadges: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" icon={<Check className="h-3 w-3" />}>
        Published
      </Badge>
      <Badge variant="warning">Draft</Badge>
      <Badge variant="info">In Review</Badge>
      <Badge variant="destructive">Archived</Badge>
    </div>
  ),
};
