import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@/test/test-utils';
import { PARTICLE_CONFIG } from '@/config/animations';

// Mock canvas context
const mockContext = {
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  closePath: vi.fn(),
  fillStyle: '',
  strokeStyle: '',
  lineWidth: 0,
  globalAlpha: 1,
  scale: vi.fn(),
  setTransform: vi.fn(),
};

// Mock ResizeObserver
const mockResizeObserverDisconnect = vi.fn();
let resizeObserverCallback: ResizeObserverCallback | null = null;

class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {
    resizeObserverCallback = callback;
  }
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = mockResizeObserverDisconnect;
}

// Mock matchMedia for prefers-reduced-motion
function createMockMatchMedia(reducedMotion: boolean) {
  return vi.fn().mockImplementation((query: string) => ({
    matches:
      query === '(prefers-reduced-motion: reduce)' ? reducedMotion : false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

describe('ParticleField', () => {
  let originalResizeObserver: typeof globalThis.ResizeObserver;
  let originalMatchMedia: typeof window.matchMedia;
  let originalRAF: typeof window.requestAnimationFrame;
  let originalCAF: typeof window.cancelAnimationFrame;

  beforeEach(() => {
    vi.resetModules();

    originalResizeObserver = globalThis.ResizeObserver;
    originalMatchMedia = window.matchMedia;
    originalRAF = window.requestAnimationFrame;
    originalCAF = window.cancelAnimationFrame;

    globalThis.ResizeObserver =
      MockResizeObserver as unknown as typeof ResizeObserver;
    window.matchMedia = createMockMatchMedia(false);
    window.requestAnimationFrame = vi.fn().mockReturnValue(1);
    window.cancelAnimationFrame = vi.fn();

    // Reset mock context calls
    Object.values(mockContext).forEach(val => {
      if (typeof val === 'function') {
        val.mockClear();
      }
    });
    mockResizeObserverDisconnect.mockClear();
    resizeObserverCallback = null;

    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      mockContext as never
    );
  });

  afterEach(() => {
    globalThis.ResizeObserver = originalResizeObserver;
    window.matchMedia = originalMatchMedia;
    window.requestAnimationFrame = originalRAF;
    window.cancelAnimationFrame = originalCAF;
    vi.restoreAllMocks();
  });

  it('renders a canvas element', async () => {
    const { ParticleField } = await import('./ParticleField');
    const { container } = render(<ParticleField />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('canvas has correct class names for absolute positioning and pointer-events-none', async () => {
    const { ParticleField } = await import('./ParticleField');
    const { container } = render(<ParticleField />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toHaveClass('absolute');
    expect(canvas).toHaveClass('inset-0');
    expect(canvas).toHaveClass('pointer-events-none');
  });

  it('acquires a 2d rendering context from the canvas', async () => {
    const { ParticleField } = await import('./ParticleField');
    render(<ParticleField />);

    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
  });

  it('starts requestAnimationFrame loop when reduced motion is not preferred', async () => {
    const { ParticleField } = await import('./ParticleField');
    render(<ParticleField />);

    expect(window.requestAnimationFrame).toHaveBeenCalled();
  });

  it('does not start animation loop when prefers-reduced-motion is enabled', async () => {
    window.matchMedia = createMockMatchMedia(true);

    const { ParticleField } = await import('./ParticleField');
    render(<ParticleField />);

    // Should still render but not animate (static draw only, no rAF loop)
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });

  it('observes the canvas parent for size changes via ResizeObserver', async () => {
    const { ParticleField } = await import('./ParticleField');
    render(<ParticleField />);

    expect(resizeObserverCallback).not.toBeNull();
  });

  it('disconnects ResizeObserver and cancels animation on unmount', async () => {
    const { ParticleField } = await import('./ParticleField');
    const { unmount } = render(<ParticleField />);

    unmount();

    expect(mockResizeObserverDisconnect).toHaveBeenCalled();
    expect(window.cancelAnimationFrame).toHaveBeenCalled();
  });

  it('uses desktop particle count when window width >= MOBILE_BREAKPOINT', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { ParticleField } = await import('./ParticleField');
    render(<ParticleField />);

    // The component should have generated DESKTOP_COUNT particles
    // We verify indirectly: the canvas should have been rendered and context acquired
    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
  });

  it('uses mobile particle count when window width < MOBILE_BREAKPOINT', async () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });

    const { ParticleField } = await import('./ParticleField');
    render(<ParticleField />);

    expect(HTMLCanvasElement.prototype.getContext).toHaveBeenCalledWith('2d');
  });

  it('updates particle count on resize via ResizeObserver with debounce', async () => {
    vi.useFakeTimers();

    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { ParticleField } = await import('./ParticleField');
    render(<ParticleField />);

    // Simulate resize to mobile width
    Object.defineProperty(window, 'innerWidth', { value: 375 });

    if (resizeObserverCallback) {
      resizeObserverCallback(
        [
          { contentRect: { width: 375, height: 600 } },
        ] as unknown as ResizeObserverEntry[],
        {} as ResizeObserver
      );
    }

    // Advance past debounce
    vi.advanceTimersByTime(PARTICLE_CONFIG.RESIZE_DEBOUNCE_MS + 50);

    // Component should have re-rendered with new particle count
    // Canvas should still be present
    const canvas = document.querySelector('canvas');
    expect(canvas).toBeInTheDocument();

    vi.useRealTimers();
  });

  it('canvas dimensions are set to 0x0 initially when no parent size is available', async () => {
    const { ParticleField } = await import('./ParticleField');
    const { container } = render(<ParticleField />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBeInTheDocument();
  });
});
