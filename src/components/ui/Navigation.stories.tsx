import type { Meta, StoryObj } from '@storybook/nextjs';
import { Navigation } from './Navigation';

const meta = {
  title: 'UI/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main navigation component for the website. Features a responsive design with mobile menu, theme toggle, and social links. Includes scroll-triggered background blur effect.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="min-h-[200vh]">
        <Story />
        <div className="pt-20 px-8">
          <p className="text-muted-foreground">
            Scroll down to see the navigation background blur effect.
          </p>
          <div className="mt-8 space-y-4">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="p-4 bg-muted rounded-lg">
                <h3 className="font-semibold">Section {i + 1}</h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default State
export const Default: Story = {
  args: {},
};

// With Custom Class
export const WithCustomClass: Story = {
  args: {
    className: 'border-b border-border',
  },
};

// Mobile View
export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  decorators: [
    Story => (
      <div className="min-h-screen">
        <Story />
        <div className="pt-20 px-4">
          <p className="text-muted-foreground text-sm">
            Click the menu button to open the mobile navigation.
          </p>
        </div>
      </div>
    ),
  ],
};

// Tablet View
export const TabletView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  decorators: [
    Story => (
      <div className="min-h-screen">
        <Story />
        <div className="pt-20 px-6">
          <p className="text-muted-foreground">
            Tablet view shows social links but uses mobile menu for navigation.
          </p>
        </div>
      </div>
    ),
  ],
};
