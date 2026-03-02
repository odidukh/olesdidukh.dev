import type { Meta, StoryObj } from '@storybook/nextjs';
import { Timeline } from './Timeline';

const meta = {
  title: 'Sections/Timeline',
  component: Timeline,
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'An interactive career timeline component displaying work experience and education history. Features alternating left/right layout on desktop, animated entry effects, technology badges, and achievement highlights. Uses Framer Motion for scroll-triggered animations.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default timeline showing full career history with alternating layout
 */
export const Default: Story = {
  args: {},
};

/**
 * Mobile view with single-column layout
 */
export const MobileView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
    docs: {
      description: {
        story:
          'On mobile devices, the timeline displays in a single column with icons aligned to the left.',
      },
    },
  },
};

/**
 * Tablet view showing responsive behavior
 */
export const TabletView: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
    docs: {
      description: {
        story:
          'Tablet view transitions between mobile and desktop layouts based on screen width.',
      },
    },
  },
};

/**
 * Large desktop view with full alternating layout
 */
export const LargeDesktop: Story = {
  args: {},
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
    docs: {
      description: {
        story:
          'On larger screens, timeline items alternate between left and right sides of the central line.',
      },
    },
  },
};

/**
 * Dark mode appearance
 */
export const DarkMode: Story = {
  args: {},
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story:
          'Timeline adapts to dark mode with appropriate color adjustments for cards, badges, and text.',
      },
    },
  },
  decorators: [
    Story => (
      <div className="dark max-w-6xl mx-auto py-12 bg-background min-h-screen">
        <Story />
      </div>
    ),
  ],
};

/**
 * With section header context
 */
export const WithHeader: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Professional Journey
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Over 8 years of experience building exceptional web applications,
            from junior developer to senior engineer leading teams and
            architecting solutions.
          </p>
        </div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Timeline component shown with a typical section header as it appears on the Experience page.',
      },
    },
  },
};

/**
 * Compact container for embedded use
 */
export const CompactView: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-4xl mx-auto py-8">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Timeline in a narrower container, useful for embedding in sidebars or smaller sections.',
      },
    },
  },
};

// =============================================================================
// ALTERNATIVE VISUAL DESIGNS
// =============================================================================

/**
 * Minimal Design - Clean, subtle aesthetics with reduced visual weight
 */
export const MinimalDesign: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12">
        <style>{`
          .minimal-timeline [class*="border-mocha"] {
            border-color: hsl(var(--border)) !important;
          }
          .minimal-timeline [class*="bg-mocha"] {
            background-color: hsl(var(--muted)) !important;
          }
          .minimal-timeline [class*="text-mocha"] {
            color: hsl(var(--muted-foreground)) !important;
          }
          .minimal-timeline .absolute.w-0\\.5 {
            background: linear-gradient(to bottom, hsl(var(--border)), hsl(var(--border))) !important;
          }
          .minimal-timeline [class*="rounded-full"][class*="border-4"] {
            border-color: hsl(var(--border)) !important;
            background-color: hsl(var(--background)) !important;
          }
          .minimal-timeline [class*="CardContent"] {
            padding: 1rem !important;
          }
        `}</style>
        <div className="minimal-timeline">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'A minimal, clean design with muted colors and reduced visual weight. Ideal for professional, understated portfolios.',
      },
    },
  },
};

/**
 * Gradient Accent Design - Vibrant gradient accents and colorful badges
 */
export const GradientAccentDesign: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12">
        <style>{`
          .gradient-timeline .absolute.w-0\\.5 {
            background: linear-gradient(
              to bottom,
              #ec4899,
              #8b5cf6,
              #3b82f6,
              #10b981
            ) !important;
            width: 4px !important;
          }
          .gradient-timeline [class*="rounded-full"][class*="border-4"] {
            border-width: 3px !important;
            border-image: linear-gradient(135deg, #ec4899, #8b5cf6) 1 !important;
            border-style: solid !important;
            background: linear-gradient(135deg, #fdf2f8, #f5f3ff) !important;
          }
          .gradient-timeline .dark [class*="rounded-full"][class*="border-4"] {
            background: linear-gradient(135deg, #4a044e, #2e1065) !important;
          }
          .gradient-timeline [class*="rounded-full"][class*="border-4"] svg {
            color: #8b5cf6 !important;
          }
          .gradient-timeline [class*="text-success"] {
            background: linear-gradient(90deg, #10b981, #059669);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}</style>
        <div className="gradient-timeline">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'A vibrant design featuring gradient accents on the timeline and icons. Perfect for creative portfolios.',
      },
    },
  },
};

/**
 * Elevated Cards Design - Cards with prominent shadows and hover effects
 */
export const ElevatedCardsDesign: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12">
        <style>{`
          .elevated-timeline [class*="Card"] {
            box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.15),
                        0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
            border: none !important;
            transition: all 0.3s ease !important;
          }
          .elevated-timeline [class*="Card"]:hover {
            box-shadow: 0 20px 60px -15px rgba(0, 0, 0, 0.2),
                        0 8px 12px -4px rgba(0, 0, 0, 0.08) !important;
            transform: translateY(-4px) !important;
          }
          .elevated-timeline [class*="rounded-full"][class*="border-4"] {
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }
        `}</style>
        <div className="elevated-timeline">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Cards with prominent shadows creating depth and elevation. Enhanced hover states for interactivity.',
      },
    },
  },
};

/**
 * Dotted Line Design - Playful dotted timeline with rounded elements
 */
export const DottedLineDesign: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12">
        <style>{`
          .dotted-timeline .absolute.w-0\\.5 {
            background: repeating-linear-gradient(
              to bottom,
              hsl(var(--mocha-500)),
              hsl(var(--mocha-500)) 8px,
              transparent 8px,
              transparent 16px
            ) !important;
            width: 3px !important;
          }
          .dotted-timeline [class*="rounded-full"][class*="border-4"] {
            border-radius: 12px !important;
            border-width: 3px !important;
          }
          .dotted-timeline [class*="Card"] {
            border-radius: 16px !important;
          }
          .dotted-timeline [class*="Badge"] {
            border-radius: 20px !important;
          }
        `}</style>
        <div className="dotted-timeline">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'A playful design with dotted timeline and extra-rounded elements for a friendly, approachable look.',
      },
    },
  },
};

/**
 * Glassmorphism Design - Frosted glass effect on cards
 */
export const GlassmorphismDesign: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12 relative">
        {/* Background blobs for glass effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse" />
        </div>
        <style>{`
          .glass-timeline [class*="Card"] {
            background: rgba(255, 255, 255, 0.7) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            border: 1px solid rgba(255, 255, 255, 0.3) !important;
          }
          .dark .glass-timeline [class*="Card"] {
            background: rgba(0, 0, 0, 0.5) !important;
            border: 1px solid rgba(255, 255, 255, 0.1) !important;
          }
          .glass-timeline [class*="rounded-full"][class*="border-4"] {
            background: rgba(255, 255, 255, 0.8) !important;
            backdrop-filter: blur(8px) !important;
          }
          .glass-timeline .absolute.w-0\\.5 {
            background: linear-gradient(
              to bottom,
              rgba(139, 92, 246, 0.5),
              rgba(236, 72, 153, 0.5)
            ) !important;
          }
        `}</style>
        <div className="glass-timeline relative z-10">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Modern glassmorphism design with frosted glass cards and colorful background blobs.',
      },
    },
  },
};

/**
 * Neon Glow Design - Cyberpunk-inspired with glowing accents
 */
export const NeonGlowDesign: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="dark max-w-6xl mx-auto py-12 bg-slate-950 min-h-screen rounded-lg">
        <style>{`
          .neon-timeline .absolute.w-0\\.5 {
            background: #0ff !important;
            box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff !important;
            width: 2px !important;
          }
          .neon-timeline [class*="rounded-full"][class*="border-4"] {
            border-color: #0ff !important;
            box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, inset 0 0 10px rgba(0, 255, 255, 0.2) !important;
            background: rgba(0, 255, 255, 0.1) !important;
          }
          .neon-timeline [class*="rounded-full"][class*="border-4"] svg {
            color: #0ff !important;
            filter: drop-shadow(0 0 4px #0ff);
          }
          .neon-timeline [class*="Card"] {
            background: rgba(15, 23, 42, 0.8) !important;
            border: 1px solid rgba(0, 255, 255, 0.3) !important;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.1) !important;
          }
          .neon-timeline [class*="Card"]:hover {
            border-color: rgba(0, 255, 255, 0.6) !important;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.2) !important;
          }
          .neon-timeline h4 {
            color: #fff !important;
          }
          .neon-timeline [class*="text-success"] {
            color: #0f0 !important;
            text-shadow: 0 0 8px #0f0;
          }
        `}</style>
        <div className="neon-timeline">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story:
          'Cyberpunk-inspired design with neon cyan glow effects. Best viewed in dark mode.',
      },
    },
  },
};

/**
 * Bordered Cards Design - Strong borders with accent colors
 */
export const BorderedCardsDesign: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12">
        <style>{`
          .bordered-timeline [class*="Card"] {
            border-width: 2px !important;
            border-left-width: 4px !important;
            border-left-color: hsl(var(--mocha-500)) !important;
            border-radius: 4px !important;
            box-shadow: none !important;
          }
          .bordered-timeline [class*="Card"]:hover {
            border-left-color: hsl(var(--navy-500)) !important;
          }
          .bordered-timeline [class*="rounded-full"][class*="border-4"] {
            border-radius: 4px !important;
          }
          .bordered-timeline .absolute.w-0\\.5 {
            width: 2px !important;
            background: hsl(var(--border)) !important;
          }
        `}</style>
        <div className="bordered-timeline">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Strong left-border accent design with squared-off corners for a more structured, corporate look.',
      },
    },
  },
};

/**
 * Pastel Theme Design - Soft, pastel color palette
 */
export const PastelThemeDesign: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 rounded-lg p-8">
        <style>{`
          .pastel-timeline .absolute.w-0\\.5 {
            background: linear-gradient(
              to bottom,
              #f9a8d4,
              #c4b5fd,
              #93c5fd,
              #86efac
            ) !important;
            width: 3px !important;
          }
          .pastel-timeline [class*="rounded-full"][class*="border-4"] {
            border-color: #c4b5fd !important;
            background: white !important;
          }
          .pastel-timeline [class*="rounded-full"][class*="border-4"] svg {
            color: #8b5cf6 !important;
          }
          .pastel-timeline [class*="Card"] {
            background: white !important;
            border-color: #e9d5ff !important;
          }
          .pastel-timeline [class*="Badge"][class*="default"] {
            background: #ddd6fe !important;
            color: #6d28d9 !important;
          }
          .pastel-timeline [class*="Badge"][class*="secondary"] {
            background: #fbcfe8 !important;
            color: #be185d !important;
          }
          .pastel-timeline [class*="Badge"][class*="outline"] {
            border-color: #c4b5fd !important;
            color: #7c3aed !important;
          }
        `}</style>
        <div className="pastel-timeline">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Soft pastel color palette creating a gentle, approachable aesthetic.',
      },
    },
  },
};

/**
 * Adaptive Theme Design - Gradient Accent in light mode, Neon Glow in dark mode
 */
export const AdaptiveThemeDesign: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12">
        <style>{`
          /* ===== LIGHT THEME - Gradient Accent with Round Icons ===== */
          .adaptive-timeline .absolute.w-0\\.5 {
            background: linear-gradient(
              to bottom,
              #ec4899,
              #8b5cf6,
              #3b82f6,
              #10b981
            ) !important;
            width: 4px !important;
            border-radius: 2px !important;
          }

          .adaptive-timeline [class*="rounded-full"][class*="border-4"] {
            border: 3px solid transparent !important;
            background:
              linear-gradient(white, white) padding-box,
              linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6) border-box !important;
            box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3) !important;
          }

          .adaptive-timeline [class*="rounded-full"][class*="border-4"] svg {
            color: #8b5cf6 !important;
          }

          .adaptive-timeline [class*="Card"] {
            border: 1px solid rgba(139, 92, 246, 0.2) !important;
            box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1) !important;
            transition: all 0.3s ease !important;
          }

          .adaptive-timeline [class*="Card"]:hover {
            border-color: rgba(139, 92, 246, 0.4) !important;
            box-shadow: 0 8px 30px rgba(139, 92, 246, 0.15) !important;
            transform: translateY(-2px) !important;
          }

          .adaptive-timeline [class*="text-success"] {
            background: linear-gradient(90deg, #10b981, #059669);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .adaptive-timeline [class*="Badge"][class*="default"] {
            background: linear-gradient(135deg, #8b5cf6, #6366f1) !important;
            border: none !important;
          }

          .adaptive-timeline [class*="Badge"][class*="outline"] {
            border-color: #8b5cf6 !important;
            color: #7c3aed !important;
          }

          /* ===== DARK THEME - Neon Glow ===== */
          .dark .adaptive-timeline .absolute.w-0\\.5 {
            background: #0ff !important;
            box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff !important;
            width: 2px !important;
          }

          .dark .adaptive-timeline [class*="rounded-full"][class*="border-4"] {
            border: 3px solid #0ff !important;
            background: rgba(0, 255, 255, 0.1) !important;
            box-shadow: 0 0 15px #0ff, 0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 15px rgba(0, 255, 255, 0.2) !important;
          }

          .dark .adaptive-timeline [class*="rounded-full"][class*="border-4"] svg {
            color: #0ff !important;
            filter: drop-shadow(0 0 6px #0ff);
          }

          .dark .adaptive-timeline [class*="Card"] {
            background: rgba(15, 23, 42, 0.9) !important;
            border: 1px solid rgba(0, 255, 255, 0.3) !important;
            box-shadow: 0 0 20px rgba(0, 255, 255, 0.1) !important;
          }

          .dark .adaptive-timeline [class*="Card"]:hover {
            border-color: rgba(0, 255, 255, 0.6) !important;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.2), 0 0 60px rgba(0, 255, 255, 0.1) !important;
            transform: translateY(-2px) !important;
          }

          .dark .adaptive-timeline h4 {
            color: #fff !important;
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
          }

          .dark .adaptive-timeline [class*="text-mocha"] {
            color: #67e8f9 !important;
          }

          .dark .adaptive-timeline [class*="text-success"] {
            color: #0f0 !important;
            text-shadow: 0 0 8px #0f0;
            background: none !important;
            -webkit-text-fill-color: #0f0 !important;
          }

          .dark .adaptive-timeline [class*="Badge"][class*="default"] {
            background: rgba(0, 255, 255, 0.2) !important;
            border: 1px solid #0ff !important;
            color: #0ff !important;
            box-shadow: 0 0 10px rgba(0, 255, 255, 0.3) !important;
          }

          .dark .adaptive-timeline [class*="Badge"][class*="secondary"] {
            background: rgba(0, 255, 0, 0.1) !important;
            border: 1px solid rgba(0, 255, 0, 0.5) !important;
            color: #0f0 !important;
          }

          .dark .adaptive-timeline [class*="Badge"][class*="outline"] {
            border-color: #0ff !important;
            color: #0ff !important;
          }

          .dark .adaptive-timeline [class*="text-muted-foreground"] {
            color: rgba(255, 255, 255, 0.7) !important;
          }
        `}</style>
        <div className="adaptive-timeline">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Adaptive design that switches between Gradient Accent (light) and Neon Glow (dark) based on the current theme. Toggle dark mode to see the transformation.',
      },
    },
  },
};

/**
 * Adaptive Theme Design - Dark Mode Preview
 */
export const AdaptiveThemeDesignDark: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="dark bg-slate-950 rounded-lg">
        <div className="max-w-6xl mx-auto py-12">
          <style>{`
            /* ===== LIGHT THEME - Gradient Accent with Round Icons ===== */
            .adaptive-timeline .absolute.w-0\\.5 {
              background: linear-gradient(
                to bottom,
                #ec4899,
                #8b5cf6,
                #3b82f6,
                #10b981
              ) !important;
              width: 4px !important;
              border-radius: 2px !important;
            }

            .adaptive-timeline [class*="rounded-full"][class*="border-4"] {
              border: 3px solid transparent !important;
              background:
                linear-gradient(white, white) padding-box,
                linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6) border-box !important;
              box-shadow: 0 4px 15px rgba(139, 92, 246, 0.3) !important;
            }

            .adaptive-timeline [class*="rounded-full"][class*="border-4"] svg {
              color: #8b5cf6 !important;
            }

            .adaptive-timeline [class*="Card"] {
              border: 1px solid rgba(139, 92, 246, 0.2) !important;
              box-shadow: 0 4px 20px rgba(139, 92, 246, 0.1) !important;
              transition: all 0.3s ease !important;
            }

            .adaptive-timeline [class*="Card"]:hover {
              border-color: rgba(139, 92, 246, 0.4) !important;
              box-shadow: 0 8px 30px rgba(139, 92, 246, 0.15) !important;
              transform: translateY(-2px) !important;
            }

            .adaptive-timeline [class*="text-success"] {
              background: linear-gradient(90deg, #10b981, #059669);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }

            .adaptive-timeline [class*="Badge"][class*="default"] {
              background: linear-gradient(135deg, #8b5cf6, #6366f1) !important;
              border: none !important;
            }

            .adaptive-timeline [class*="Badge"][class*="outline"] {
              border-color: #8b5cf6 !important;
              color: #7c3aed !important;
            }

            /* ===== DARK THEME - Neon Glow ===== */
            .dark .adaptive-timeline .absolute.w-0\\.5 {
              background: #0ff !important;
              box-shadow: 0 0 10px #0ff, 0 0 20px #0ff, 0 0 40px #0ff !important;
              width: 2px !important;
            }

            .dark .adaptive-timeline [class*="rounded-full"][class*="border-4"] {
              border: 3px solid #0ff !important;
              background: rgba(0, 255, 255, 0.1) !important;
              box-shadow: 0 0 15px #0ff, 0 0 30px rgba(0, 255, 255, 0.5), inset 0 0 15px rgba(0, 255, 255, 0.2) !important;
            }

            .dark .adaptive-timeline [class*="rounded-full"][class*="border-4"] svg {
              color: #0ff !important;
              filter: drop-shadow(0 0 6px #0ff);
            }

            .dark .adaptive-timeline [class*="Card"] {
              background: rgba(15, 23, 42, 0.9) !important;
              border: 1px solid rgba(0, 255, 255, 0.3) !important;
              box-shadow: 0 0 20px rgba(0, 255, 255, 0.1) !important;
            }

            .dark .adaptive-timeline [class*="Card"]:hover {
              border-color: rgba(0, 255, 255, 0.6) !important;
              box-shadow: 0 0 30px rgba(0, 255, 255, 0.2), 0 0 60px rgba(0, 255, 255, 0.1) !important;
              transform: translateY(-2px) !important;
            }

            .dark .adaptive-timeline h4 {
              color: #fff !important;
              text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            }

            .dark .adaptive-timeline [class*="text-mocha"] {
              color: #67e8f9 !important;
            }

            .dark .adaptive-timeline [class*="text-success"] {
              color: #0f0 !important;
              text-shadow: 0 0 8px #0f0;
              background: none !important;
              -webkit-text-fill-color: #0f0 !important;
            }

            .dark .adaptive-timeline [class*="Badge"][class*="default"] {
              background: rgba(0, 255, 255, 0.2) !important;
              border: 1px solid #0ff !important;
              color: #0ff !important;
              box-shadow: 0 0 10px rgba(0, 255, 255, 0.3) !important;
            }

            .dark .adaptive-timeline [class*="Badge"][class*="secondary"] {
              background: rgba(0, 255, 0, 0.1) !important;
              border: 1px solid rgba(0, 255, 0, 0.5) !important;
              color: #0f0 !important;
            }

            .dark .adaptive-timeline [class*="Badge"][class*="outline"] {
              border-color: #0ff !important;
              color: #0ff !important;
            }

            .dark .adaptive-timeline [class*="text-muted-foreground"] {
              color: rgba(255, 255, 255, 0.7) !important;
            }
          `}</style>
          <div className="adaptive-timeline">
            <Story />
          </div>
        </div>
      </div>
    ),
  ],
  parameters: {
    backgrounds: { default: 'dark' },
    docs: {
      description: {
        story:
          'Dark mode preview of the Adaptive Theme Design showing the Neon Glow effect.',
      },
    },
  },
};

/**
 * Monochrome Design - Black and white with subtle grays
 */
export const MonochromeDesign: Story = {
  args: {},
  decorators: [
    Story => (
      <div className="max-w-6xl mx-auto py-12">
        <style>{`
          .mono-timeline .absolute.w-0\\.5 {
            background: #000 !important;
          }
          .mono-timeline [class*="rounded-full"][class*="border-4"] {
            border-color: #000 !important;
            background: #fff !important;
          }
          .mono-timeline [class*="rounded-full"][class*="border-4"] svg {
            color: #000 !important;
          }
          .mono-timeline [class*="text-mocha"] {
            color: #666 !important;
          }
          .mono-timeline [class*="bg-mocha"] {
            background: #333 !important;
          }
          .mono-timeline [class*="Badge"][class*="default"] {
            background: #000 !important;
            color: #fff !important;
          }
          .mono-timeline [class*="Badge"][class*="secondary"] {
            background: #f5f5f5 !important;
            color: #000 !important;
            border: 1px solid #000 !important;
          }
          .mono-timeline [class*="Badge"][class*="outline"] {
            border-color: #000 !important;
            color: #000 !important;
          }
          .mono-timeline [class*="text-success"] {
            color: #000 !important;
            font-weight: 600 !important;
          }
          .mono-timeline [class*="Card"] {
            border-color: #e5e5e5 !important;
          }
        `}</style>
        <div className="mono-timeline">
          <Story />
        </div>
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        story:
          'Classic monochrome design with black, white, and gray tones for a timeless, print-inspired look.',
      },
    },
  },
};
