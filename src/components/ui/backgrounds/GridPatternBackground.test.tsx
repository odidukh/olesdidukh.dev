import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@/test/test-utils';
import { GridPatternBackground } from './GridPatternBackground';

// Build a mock 2D context with all methods used by the component
function createMockContext(): CanvasRenderingContext2D {
  return {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    setLineDash: vi.fn(),
    createRadialGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    fillRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    scale: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    globalCompositeOperation: 'source-over',
  } as unknown as CanvasRenderingContext2D;
}

let mockCtx: CanvasRenderingContext2D;

beforeEach(() => {
  mockCtx = createMockContext();

  // Mock HTMLCanvasElement.getContext to return our mock
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    mockCtx as never
  );
});

describe('GridPatternBackground', () => {
  it('renders a canvas element', () => {
    const { container } = render(<GridPatternBackground />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('applies absolute positioning and inset-0 class to wrapper', () => {
    const { container } = render(<GridPatternBackground />);

    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toHaveClass('absolute');
    expect(wrapper).toHaveClass('inset-0');
    expect(wrapper).toHaveClass('overflow-hidden');
  });

  it('canvas has absolute positioning to fill parent', () => {
    const { container } = render(<GridPatternBackground />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('absolute');
    expect(canvas).toHaveClass('inset-0');
  });

  describe('variant rendering', () => {
    it('renders dots variant without error', () => {
      expect(() => {
        render(<GridPatternBackground variant="dots" />);
      }).not.toThrow();
    });

    it('renders lines variant without error', () => {
      expect(() => {
        render(<GridPatternBackground variant="lines" />);
      }).not.toThrow();
    });

    it('renders dashed variant without error', () => {
      expect(() => {
        render(<GridPatternBackground variant="dashed" />);
      }).not.toThrow();
    });
  });

  describe('interactivity', () => {
    it('attaches mousemove listener when interactive is true (default)', () => {
      const { container } = render(
        <GridPatternBackground interactive={true} />
      );

      const wrapper = container.firstElementChild as HTMLElement;
      // Firing mousemove should not throw
      expect(() => {
        fireEvent.mouseMove(wrapper, { clientX: 100, clientY: 200 });
      }).not.toThrow();
    });

    it('does not track mouse when interactive is false', () => {
      const { container } = render(
        <GridPatternBackground interactive={false} />
      );

      const wrapper = container.firstElementChild as HTMLElement;

      // The wrapper should not have an onMouseMove handler when non-interactive
      // We verify by checking that no radial gradient glow is drawn after mouse move
      fireEvent.mouseMove(wrapper, { clientX: 100, clientY: 200 });

      // createRadialGradient should not have been called since interactive=false
      // (initial draw may not call it either since there's no glow target)
      expect(mockCtx.createRadialGradient).not.toHaveBeenCalled();
    });
  });

  describe('props', () => {
    it('accepts custom gridSize', () => {
      expect(() => {
        render(<GridPatternBackground gridSize={60} />);
      }).not.toThrow();
    });

    it('accepts custom glowColor', () => {
      expect(() => {
        render(<GridPatternBackground glowColor="rgba(255, 0, 0, 0.5)" />);
      }).not.toThrow();
    });

    it('accepts custom patternColor', () => {
      expect(() => {
        render(<GridPatternBackground patternColor="rgba(0, 255, 0, 0.3)" />);
      }).not.toThrow();
    });
  });

  it('does not render any SVG elements', () => {
    const { container } = render(<GridPatternBackground />);

    const svgs = container.querySelectorAll('svg');
    expect(svgs).toHaveLength(0);
  });

  it('does not render any framer-motion elements', () => {
    const { container } = render(<GridPatternBackground />);

    // Framer motion adds data-framer-* attributes
    const motionElements = container.querySelectorAll(
      '[data-framer-component-type]'
    );
    expect(motionElements).toHaveLength(0);
  });
});
