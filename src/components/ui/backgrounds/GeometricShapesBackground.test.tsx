import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import { GeometricShapesBackground } from './GeometricShapesBackground';

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  arc: vi.fn(),
  stroke: vi.fn(),
  fill: vi.fn(),
  fillRect: vi.fn(),
  roundRect: vi.fn(),
  scale: vi.fn(),
  globalAlpha: 1,
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 1,
  lineCap: 'butt' as CanvasLineCap,
  canvas: { width: 800, height: 600 },
};

beforeEach(() => {
  vi.clearAllMocks();

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    mockContext as never
  );
});

describe('GeometricShapesBackground', () => {
  it('renders a canvas element', () => {
    const { container } = render(<GeometricShapesBackground />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toBeInTheDocument();
  });

  it('canvas fills the parent container absolutely', () => {
    const { container } = render(<GeometricShapesBackground />);
    const canvas = container.querySelector('canvas');

    expect(canvas).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
    });
  });

  it('renders with default props without errors', () => {
    expect(() => render(<GeometricShapesBackground />)).not.toThrow();
  });

  describe('shapeType prop', () => {
    it.each(['mixed', 'triangles', 'hexagons', 'circles', 'code'] as const)(
      'renders without errors for shapeType="%s"',
      shapeType => {
        expect(() =>
          render(<GeometricShapesBackground shapeType={shapeType} />)
        ).not.toThrow();
      }
    );
  });

  describe('count prop', () => {
    it('accepts custom count', () => {
      expect(() =>
        render(<GeometricShapesBackground count={5} />)
      ).not.toThrow();
    });

    it('renders with zero count', () => {
      expect(() =>
        render(<GeometricShapesBackground count={0} />)
      ).not.toThrow();
    });

    it('renders with large count', () => {
      expect(() =>
        render(<GeometricShapesBackground count={100} />)
      ).not.toThrow();
    });
  });

  describe('color prop', () => {
    it('accepts custom color string', () => {
      expect(() =>
        render(<GeometricShapesBackground color="rgba(255, 0, 0, 0.5)" />)
      ).not.toThrow();
    });
  });

  describe('glassmorphism prop', () => {
    it('renders with glassmorphism enabled (default)', () => {
      expect(() =>
        render(<GeometricShapesBackground glassmorphism={true} />)
      ).not.toThrow();
    });

    it('renders with glassmorphism disabled', () => {
      expect(() =>
        render(<GeometricShapesBackground glassmorphism={false} />)
      ).not.toThrow();
    });
  });

  it('obtains a 2d rendering context from the canvas', () => {
    render(<GeometricShapesBackground />);

    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
  });

  it('does not crash when getContext returns null', () => {
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);

    expect(() => render(<GeometricShapesBackground />)).not.toThrow();
  });

  it('wraps canvas in a pointer-events-none container', () => {
    const { container } = render(<GeometricShapesBackground />);
    const wrapper = container.firstElementChild;

    expect(wrapper).toHaveClass('pointer-events-none');
  });

  describe('reduced motion', () => {
    it('renders without errors when prefers-reduced-motion is set', () => {
      // The setup.ts mocks matchMedia with matches: false by default.
      // Override to simulate reduced motion preference.
      vi.spyOn(window, 'matchMedia').mockImplementation((query: string) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }));

      expect(() => render(<GeometricShapesBackground />)).not.toThrow();
    });
  });
});
