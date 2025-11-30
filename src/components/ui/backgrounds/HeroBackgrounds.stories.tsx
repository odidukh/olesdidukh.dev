import type { Meta, StoryObj } from '@storybook/nextjs';
import * as React from 'react';
import { GridPatternBackground } from './GridPatternBackground';
import { GradientMeshBackground } from './GradientMeshBackground';
import { GeometricShapesBackground } from './GeometricShapesBackground';
import { NoiseTextureBackground } from './NoiseTextureBackground';
import { WaveAuroraBackground } from './WaveAuroraBackground';
import { CodeRainBackground } from './CodeRainBackground';
import { TopographicBackground } from './TopographicBackground';
import { SpotlightBackground } from './SpotlightBackground';
import { SunsetCodeRainBackground } from './SunsetCodeRainBackground';

// Wrapper component to display backgrounds properly
function BackgroundWrapper({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden border border-border">
      {children}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
        <h2 className="text-3xl font-bold mb-2">{title}</h2>
        <p className="text-muted-foreground text-center max-w-md px-4">
          {description}
        </p>
      </div>
    </div>
  );
}

const meta = {
  title: 'Backgrounds/Hero Backgrounds',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Alternative background patterns for the HeroSection. Each pattern offers a unique visual style while maintaining performance and accessibility.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Grid Pattern
export const GridPattern: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">1. Grid Pattern Background</h1>
      <p className="text-muted-foreground mb-4">
        A subtle dot or line grid that reacts to mouse position with localized
        glow effects. Clean, minimal, and very &quot;developer aesthetic&quot;.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BackgroundWrapper
          title="Dots"
          description="Dot grid with interactive glow"
        >
          <GridPatternBackground variant="dots" interactive />
        </BackgroundWrapper>

        <BackgroundWrapper title="Lines" description="Line grid pattern">
          <GridPatternBackground variant="lines" interactive />
        </BackgroundWrapper>

        <BackgroundWrapper title="Dashed" description="Dashed line grid">
          <GridPatternBackground variant="dashed" interactive />
        </BackgroundWrapper>
      </div>
    </div>
  ),
};

// 2. Gradient Mesh
export const GradientMesh: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">2. Gradient Mesh Background</h1>
      <p className="text-muted-foreground mb-4">
        Fluid, organic gradients that slowly morph and shift colors. Similar to
        Apple&apos;s mesh gradients or Stripe&apos;s backgrounds.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BackgroundWrapper
          title="Mocha"
          description="Brand color scheme with warm tones"
        >
          <GradientMeshBackground colorScheme="mocha" />
        </BackgroundWrapper>

        <BackgroundWrapper title="Navy" description="Professional blue tones">
          <GradientMeshBackground colorScheme="navy" />
        </BackgroundWrapper>

        <BackgroundWrapper title="Sunset" description="Warm sunset gradient">
          <GradientMeshBackground colorScheme="sunset" />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Aurora"
          description="Northern lights inspired"
        >
          <GradientMeshBackground colorScheme="aurora" />
        </BackgroundWrapper>
      </div>
    </div>
  ),
};

// 3. Geometric Shapes
export const GeometricShapes: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">3. Geometric Shapes Background</h1>
      <p className="text-muted-foreground mb-4">
        Floating triangles, hexagons, or polygons with glassmorphism effects.
        More structured than particles.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BackgroundWrapper
          title="Mixed Shapes"
          description="Triangles, hexagons, and circles"
        >
          <GeometricShapesBackground shapeType="mixed" glassmorphism />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Code Symbols"
          description="Brackets, tags, and slashes"
        >
          <GeometricShapesBackground shapeType="code" glassmorphism />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Hexagons"
          description="Tech-inspired hexagon pattern"
        >
          <GeometricShapesBackground shapeType="hexagons" count={20} />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="No Glass Effect"
          description="Clean shapes without blur"
        >
          <GeometricShapesBackground
            shapeType="triangles"
            glassmorphism={false}
          />
        </BackgroundWrapper>
      </div>
    </div>
  ),
};

// 4. Noise Texture
export const NoiseTexture: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">4. Noise/Grain Texture Background</h1>
      <p className="text-muted-foreground mb-4">
        Subtle noise overlay with gradient background. Adds tactile quality
        while being performant.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BackgroundWrapper
          title="Light Grain"
          description="Subtle texture overlay"
        >
          <NoiseTextureBackground grainIntensity="light" noiseOpacity={0.1} />
        </BackgroundWrapper>

        <BackgroundWrapper title="Medium Grain" description="Balanced texture">
          <NoiseTextureBackground grainIntensity="medium" animated />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Heavy Grain"
          description="Pronounced film grain effect"
        >
          <NoiseTextureBackground grainIntensity="heavy" noiseOpacity={0.25} />
        </BackgroundWrapper>
      </div>
    </div>
  ),
};

// 5. Wave/Aurora
export const WaveAurora: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">5. Wave/Aurora Background</h1>
      <p className="text-muted-foreground mb-4">
        Animated waves or aurora borealis-style flowing gradients. Elegant and
        modern.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BackgroundWrapper
          title="Waves (Bottom)"
          description="Animated wave pattern"
        >
          <WaveAuroraBackground
            variant="waves"
            position="bottom"
            colorScheme="mocha"
          />
        </BackgroundWrapper>

        <BackgroundWrapper title="Aurora" description="Northern lights effect">
          <WaveAuroraBackground variant="aurora" colorScheme="northern" />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Ribbons"
          description="Flowing ribbon gradients"
        >
          <WaveAuroraBackground variant="ribbons" colorScheme="sunset" />
        </BackgroundWrapper>

        <BackgroundWrapper title="Ocean Waves" description="Blue wave pattern">
          <WaveAuroraBackground
            variant="waves"
            colorScheme="ocean"
            position="full"
          />
        </BackgroundWrapper>
      </div>
    </div>
  ),
};

// 6. Code Rain
export const CodeRain: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">6. Code Rain Background</h1>
      <p className="text-muted-foreground mb-4">
        Subtle falling code characters or symbols. Fits the developer theme
        perfectly.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BackgroundWrapper
          title="Code Keywords"
          description="JavaScript/TypeScript keywords"
        >
          <CodeRainBackground charset="code" columns={15} />
        </BackgroundWrapper>

        <BackgroundWrapper title="Binary" description="Classic 0s and 1s">
          <CodeRainBackground
            charset="binary"
            columns={25}
            color="rgba(0, 200, 100, 0.5)"
          />
        </BackgroundWrapper>

        <BackgroundWrapper title="Hex" description="Hexadecimal characters">
          <CodeRainBackground
            charset="hex"
            columns={20}
            color="rgba(100, 150, 255, 0.5)"
          />
        </BackgroundWrapper>

        <BackgroundWrapper title="Symbols" description="Programming symbols">
          <CodeRainBackground charset="symbols" columns={18} />
        </BackgroundWrapper>
      </div>
    </div>
  ),
};

// 7. Topographic
export const Topographic: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">7. Topographic/Contour Background</h1>
      <p className="text-muted-foreground mb-4">
        Layered contour map-style lines. Unique and sophisticated.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BackgroundWrapper
          title="Animated Contours"
          description="Drawing animation effect"
        >
          <TopographicBackground layers={10} animated />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Static"
          description="No animation, clean look"
        >
          <TopographicBackground
            layers={8}
            animated={false}
            lineOpacity={0.2}
          />
        </BackgroundWrapper>

        <BackgroundWrapper title="Dense" description="More contour layers">
          <TopographicBackground layers={15} lineOpacity={0.1} />
        </BackgroundWrapper>

        <BackgroundWrapper title="Colored" description="Brand color contours">
          <TopographicBackground
            layers={8}
            lineColor="rgb(164, 120, 100)"
            lineOpacity={0.25}
          />
        </BackgroundWrapper>
      </div>
    </div>
  ),
};

// 8. Spotlight
export const Spotlight: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">8. Spotlight Background</h1>
      <p className="text-muted-foreground mb-4">
        Dark background with animated spotlight beams or a grid that illuminates
        on hover. Dramatic effect.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BackgroundWrapper
          title="Single Spotlight"
          description="Mouse-following spotlight"
        >
          <SpotlightBackground variant="single" followMouse />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Dual Spotlight"
          description="Two animated spotlights"
        >
          <SpotlightBackground variant="dual" />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Grid"
          description="Grid with spotlight effect"
        >
          <SpotlightBackground variant="grid" gridSize={60} />
        </BackgroundWrapper>

        <BackgroundWrapper title="Sweep" description="Sweeping spotlight beams">
          <SpotlightBackground variant="sweep" />
        </BackgroundWrapper>
      </div>
    </div>
  ),
};

// All Backgrounds Overview
export const AllBackgrounds: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold mb-2">All Hero Background Options</h1>
      <p className="text-muted-foreground mb-8">
        Overview of all 8 background patterns. Click on individual stories for
        more variants and options.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <BackgroundWrapper
          title="1. Grid Pattern"
          description="Interactive dot/line grid"
        >
          <GridPatternBackground variant="dots" interactive />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="2. Gradient Mesh"
          description="Fluid organic gradients"
        >
          <GradientMeshBackground colorScheme="mocha" />
        </BackgroundWrapper>

        <BackgroundWrapper title="3. Geometric" description="Floating shapes">
          <GeometricShapesBackground shapeType="code" />
        </BackgroundWrapper>

        <BackgroundWrapper title="4. Noise Texture" description="Grain overlay">
          <NoiseTextureBackground grainIntensity="medium" />
        </BackgroundWrapper>

        <BackgroundWrapper title="5. Wave/Aurora" description="Animated waves">
          <WaveAuroraBackground variant="waves" colorScheme="mocha" />
        </BackgroundWrapper>

        <BackgroundWrapper title="6. Code Rain" description="Falling code">
          <CodeRainBackground charset="code" columns={12} />
        </BackgroundWrapper>

        <BackgroundWrapper title="7. Topographic" description="Contour lines">
          <TopographicBackground layers={8} />
        </BackgroundWrapper>

        <BackgroundWrapper title="8. Spotlight" description="Dynamic lighting">
          <SpotlightBackground variant="single" />
        </BackgroundWrapper>
      </div>
    </div>
  ),
};

// Combined: Sunset + Code Rain (User's Choice)
export const SunsetCodeRain: Story = {
  render: () => (
    <div className="space-y-8 p-8">
      <h1 className="text-2xl font-bold">Sunset Gradient + Code Rain</h1>
      <p className="text-muted-foreground mb-4">
        Combined effect: Warm sunset gradient mesh with falling code keywords.
        Perfect for a developer portfolio with a warm, creative feel.
      </p>

      <div className="grid grid-cols-1 gap-4">
        <BackgroundWrapper
          title="Sunset Code Rain"
          description="Default settings - warm gradient with code keywords"
        >
          <SunsetCodeRainBackground />
        </BackgroundWrapper>
      </div>

      <h2 className="text-xl font-semibold mt-8">Variations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <BackgroundWrapper
          title="Dense Rain"
          description="More columns, faster animation"
        >
          <SunsetCodeRainBackground columns={25} rainSpeed={1.5} />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Subtle"
          description="Lower opacity, slower animation"
        >
          <SunsetCodeRainBackground
            columns={12}
            rainOpacity={0.3}
            rainSpeed={0.7}
          />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Fast Gradient"
          description="Faster morphing gradients"
        >
          <SunsetCodeRainBackground gradientSpeed={2} />
        </BackgroundWrapper>

        <BackgroundWrapper
          title="Minimal"
          description="Few columns, very subtle"
        >
          <SunsetCodeRainBackground columns={8} rainOpacity={0.25} />
        </BackgroundWrapper>
      </div>
    </div>
  ),
};
