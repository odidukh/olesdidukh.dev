import type { Meta, StoryObj } from '@storybook/nextjs';
import { Mail, Search as SearchIcon, Eye, Lock, User } from 'lucide-react';
import { Input } from './Input';
import { Label } from './Label';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A flexible input component with support for different sizes, validation states, and optional icons.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: 'The validation state variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg', 'xl'],
      description: 'The size of the input',
    },
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
      description: 'The HTML input type',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables the input',
    },
    error: {
      control: 'boolean',
      description: 'Shows error state',
    },
    success: {
      control: 'boolean',
      description: 'Shows success state',
    },
  },
  decorators: [
    Story => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// Basic inputs
export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: args => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input {...args} id="email" placeholder="Enter your email" />
    </div>
  ),
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'name@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Search: Story = {
  args: {
    type: 'search',
    placeholder: 'Search...',
  },
};

// Sizes
export const Small: Story = {
  args: {
    size: 'sm',
    placeholder: 'Small input',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    placeholder: 'Medium input (default)',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    placeholder: 'Large input',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    placeholder: 'Extra large input',
  },
};

// Validation states
export const Error: Story = {
  args: {
    error: true,
    placeholder: 'Invalid input',
    defaultValue: 'Invalid email',
  },
};

export const Success: Story = {
  args: {
    success: true,
    placeholder: 'Valid input',
    defaultValue: 'Valid email',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    placeholder: 'Warning state',
    defaultValue: 'Needs attention',
  },
};

// With icons
export const WithLeftIcon: Story = {
  args: {
    leftIcon: <Mail className="h-4 w-4" />,
    placeholder: 'Email address',
    type: 'email',
  },
};

export const WithRightIcon: Story = {
  args: {
    rightIcon: <Eye className="h-4 w-4" />,
    placeholder: 'Password',
    type: 'password',
  },
};

export const SearchWithIcon: Story = {
  args: {
    leftIcon: <SearchIcon className="h-4 w-4" />,
    placeholder: 'Search...',
    type: 'search',
  },
};

export const PasswordWithIcon: Story = {
  args: {
    leftIcon: <Lock className="h-4 w-4" />,
    rightIcon: <Eye className="h-4 w-4" />,
    placeholder: 'Enter password',
    type: 'password',
  },
};

// States
export const Disabled: Story = {
  args: {
    disabled: true,
    placeholder: 'Disabled input',
    defaultValue: 'Cannot edit',
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    defaultValue: 'Read only value',
  },
};

// Form field example
export const FormField: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          leftIcon={<User className="h-4 w-4" />}
          placeholder="Enter username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email-field">Email</Label>
        <Input
          id="email-field"
          type="email"
          leftIcon={<Mail className="h-4 w-4" />}
          placeholder="name@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-field">Password</Label>
        <Input
          id="password-field"
          type="password"
          leftIcon={<Lock className="h-4 w-4" />}
          placeholder="Enter password"
        />
      </div>
    </div>
  ),
};

// All sizes showcase
export const AllSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Input size="sm" placeholder="Small" />
      <Input size="md" placeholder="Medium (default)" />
      <Input size="lg" placeholder="Large" />
      <Input size="xl" placeholder="Extra Large" />
    </div>
  ),
};

// All states showcase
export const AllStates: Story = {
  render: () => (
    <div className="space-y-4">
      <Input placeholder="Default state" />
      <Input error placeholder="Error state" defaultValue="Invalid" />
      <Input success placeholder="Success state" defaultValue="Valid" />
      <Input variant="warning" placeholder="Warning state" />
      <Input disabled placeholder="Disabled state" defaultValue="Disabled" />
    </div>
  ),
};
