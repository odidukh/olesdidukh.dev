import type { Meta, StoryObj } from '@storybook/nextjs';
import { ContactForm } from './ContactForm';

const meta = {
  title: 'Sections/ContactForm',
  component: ContactForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A comprehensive contact form with project details selection. Includes form validation, honeypot spam protection, and animated feedback states. Users can select project type, budget range, and timeline using interactive badges.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="w-full max-w-2xl p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContactForm>;

export default meta;
type Story = StoryObj<typeof meta>;

// Default State
export const Default: Story = {
  args: {},
};

// In Container Context
export const InContainerContext: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="bg-muted/30 p-8 rounded-lg">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Get in Touch</h2>
            <p className="text-muted-foreground">
              Have a project in mind? Let&apos;s discuss how we can work
              together.
            </p>
          </div>
          <Story />
        </div>
      </div>
    ),
  ],
};

// Full Width
export const FullWidth: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="w-full max-w-4xl p-8">
        <Story />
      </div>
    ),
  ],
};
