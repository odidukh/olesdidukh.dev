import type { Meta, StoryObj } from '@storybook/nextjs';
import { HeroSection } from './HeroSection';

const meta = {
  title: 'Sections/HeroSection',
  component: HeroSection,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'The main hero section of the website. Features animated text, particle effects, floating icons, parallax scrolling, and call-to-action buttons. Includes mouse-tracking parallax effects and scroll-based opacity transitions.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="min-h-[200vh]">
        <Story />
        <div className="px-8 py-20 bg-muted/30">
          <p className="text-center text-muted-foreground">
            Scroll to see the parallax and fade effects
          </p>
        </div>
      </div>
    ),
  ],
} satisfies Meta<typeof HeroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default State
export const Default: Story = {
  args: {},
};

// Mobile View
export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

// Tablet View
export const TabletView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

// Without Scroll Container
export const StaticView: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="min-h-screen">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Static view without additional scroll content to show initial state.',
      },
    },
  },
};
