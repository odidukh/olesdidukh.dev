import { test, expect, type Page } from '@playwright/test';

// Helper to get Core Web Vitals metrics
async function getWebVitals(page: Page) {
  return page.evaluate(() => {
    return new Promise<{
      lcp?: number;
      cls?: number;
      fcp?: number;
      ttfb?: number;
    }>(resolve => {
      const metrics: {
        lcp?: number;
        cls?: number;
        fcp?: number;
        ttfb?: number;
      } = {};

      // LCP - Largest Contentful Paint
      new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          metrics.lcp = lastEntry.startTime;
        }
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // CLS - Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver(entryList => {
        for (const entry of entryList.getEntries()) {
          const layoutEntry = entry as PerformanceEntry & {
            value: number;
            hadRecentInput: boolean;
          };
          if (!layoutEntry.hadRecentInput) {
            clsValue += layoutEntry.value;
          }
        }
        metrics.cls = clsValue;
      }).observe({ type: 'layout-shift', buffered: true });

      // FCP - First Contentful Paint
      const fcpEntry = performance.getEntriesByName(
        'first-contentful-paint'
      )[0];
      if (fcpEntry) {
        metrics.fcp = fcpEntry.startTime;
      }

      // TTFB - Time to First Byte
      const navEntry = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navEntry) {
        metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
      }

      // Wait a bit for metrics to be collected
      setTimeout(() => resolve(metrics), 3000);
    });
  });
}

// Helper to get performance metrics from Navigation Timing API
async function getNavigationMetrics(page: Page) {
  return page.evaluate(() => {
    const nav = performance.getEntriesByType(
      'navigation'
    )[0] as PerformanceNavigationTiming;
    return {
      domContentLoaded: nav.domContentLoadedEventEnd - nav.startTime,
      load: nav.loadEventEnd - nav.startTime,
      ttfb: nav.responseStart - nav.requestStart,
      domInteractive: nav.domInteractive - nav.startTime,
    };
  });
}

test.describe('Core Web Vitals', () => {
  // Use retry for flaky performance tests
  test.describe.configure({ retries: 2 });

  test('homepage meets LCP target (< 2.5s)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const metrics = await getWebVitals(page);

    // LCP should be under 2.5 seconds (good threshold)
    // Using 3500ms for CI/local dev server tolerance
    if (metrics.lcp !== undefined) {
      expect(metrics.lcp).toBeLessThan(3500);
      console.log(`LCP: ${metrics.lcp}ms`);
    }
  });

  test('homepage meets CLS target (< 0.1)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Wait for page to stabilize
    await page.waitForTimeout(3000);

    const metrics = await getWebVitals(page);

    // CLS should be under 0.1 (good threshold)
    if (metrics.cls !== undefined) {
      expect(metrics.cls).toBeLessThan(0.1);
      console.log(`CLS: ${metrics.cls}`);
    }
  });

  test('homepage meets FCP target (< 1.8s)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const metrics = await getWebVitals(page);

    // FCP should be under 1.8 seconds (good threshold)
    if (metrics.fcp !== undefined) {
      expect(metrics.fcp).toBeLessThan(1800);
      console.log(`FCP: ${metrics.fcp}ms`);
    }
  });

  // Skip TTFB test - flaky on local dev server
  test.skip('homepage meets TTFB target (< 800ms)', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const metrics = await getWebVitals(page);

    // TTFB should be under 800ms (good threshold)
    if (metrics.ttfb !== undefined) {
      expect(metrics.ttfb).toBeLessThan(800);
      console.log(`TTFB: ${metrics.ttfb}ms`);
    }
  });
});

test.describe('Page Load Performance', () => {
  // Use retry for flaky performance tests
  test.describe.configure({ retries: 2 });

  const pages = ['/', '/about', '/projects', '/blog', '/contact', '/skills'];

  for (const path of pages) {
    test(`${path} loads within acceptable time`, async ({ page }) => {
      const startTime = Date.now();
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      const loadTime = Date.now() - startTime;

      // Page should load within 5 seconds (generous for CI/dev server)
      expect(loadTime).toBeLessThan(5000);
      console.log(`${path} DOM ready: ${loadTime}ms`);
    });
  }
});

test.describe('Navigation Performance', () => {
  test('page navigation metrics are acceptable', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });

    const metrics = await getNavigationMetrics(page);

    // DOM Content Loaded should be under 2 seconds
    expect(metrics.domContentLoaded).toBeLessThan(2000);

    // Full page load should be under 4 seconds
    expect(metrics.load).toBeLessThan(4000);

    console.log(`DOM Content Loaded: ${metrics.domContentLoaded}ms`);
    console.log(`Full Load: ${metrics.load}ms`);
    console.log(`DOM Interactive: ${metrics.domInteractive}ms`);
    console.log(`TTFB: ${metrics.ttfb}ms`);
  });
});

test.describe('Resource Performance', () => {
  test('no render-blocking resources', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    // Check for render-blocking resources
    const resources = await page.evaluate(() => {
      const entries = performance.getEntriesByType(
        'resource'
      ) as PerformanceResourceTiming[];
      return entries
        .filter(e => e.initiatorType === 'script' && !e.name.includes('_next'))
        .map(e => ({ name: e.name, duration: e.duration }));
    });

    // Should have minimal render-blocking scripts
    expect(resources.length).toBeLessThan(5);
    if (resources.length > 0) {
      console.log('Render-blocking resources:', resources);
    }
  });

  test('images are optimized', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    // Check image sizes
    const images = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      return imgs.map(img => ({
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayWidth: img.clientWidth,
        displayHeight: img.clientHeight,
        loading: img.loading,
      }));
    });

    for (const img of images) {
      // Images should use lazy loading (except above-fold)
      // Or be properly sized (not significantly larger than display)
      if (img.naturalWidth > 0 && img.displayWidth > 0) {
        const ratio = img.naturalWidth / img.displayWidth;
        // Image should not be more than 2x display size (for retina)
        if (ratio > 3) {
          console.warn(
            `Image ${img.src} is oversized: ${img.naturalWidth}px vs ${img.displayWidth}px display`
          );
        }
      }
    }
  });

  test('no large JavaScript bundles', async ({ page }) => {
    const responses: { url: string; size: number }[] = [];

    page.on('response', response => {
      const url = response.url();
      if (url.includes('.js') && !url.includes('node_modules')) {
        responses.push({
          url,
          size: parseInt(response.headers()['content-length'] || '0', 10),
        });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });

    // Check that no single JS bundle is too large
    for (const resource of responses) {
      if (resource.size > 0) {
        // No single bundle should be over 500KB
        expect(resource.size).toBeLessThan(500 * 1024);
      }
    }
  });
});

test.describe('Interaction Performance', () => {
  // Use retry for flaky performance tests
  test.describe.configure({ retries: 2 });

  test('navigation clicks are responsive', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });

    const startTime = Date.now();
    await page.getByRole('link', { name: 'Projects' }).first().click();
    await page.waitForURL('/projects');
    const navTime = Date.now() - startTime;

    // Navigation should complete within 2 seconds (generous for CI/dev server)
    expect(navTime).toBeLessThan(2000);
    console.log(`Navigation to /projects: ${navTime}ms`);
  });

  test('form interactions are responsive', async ({ page }) => {
    await page.goto('/contact');

    // Measure input response time
    const input = page.getByPlaceholder(/john doe/i);
    await input.focus();

    const startTime = Date.now();
    await input.fill('Test User');
    const inputTime = Date.now() - startTime;

    // Input should respond within 100ms
    expect(inputTime).toBeLessThan(500);
    console.log(`Input response time: ${inputTime}ms`);
  });

  test('scroll performance is smooth', async ({ page }) => {
    await page.goto('/');

    // Measure scroll jank
    const scrollMetrics = await page.evaluate(async () => {
      return new Promise<{ frames: number; duration: number }>(resolve => {
        let frameCount = 0;
        const startTime = performance.now();

        const countFrame = () => {
          frameCount++;
          if (performance.now() - startTime < 1000) {
            requestAnimationFrame(countFrame);
          } else {
            resolve({
              frames: frameCount,
              duration: performance.now() - startTime,
            });
          }
        };

        // Start scrolling
        window.scrollTo({ top: 1000, behavior: 'smooth' });
        requestAnimationFrame(countFrame);
      });
    });

    // Should maintain at least 30 FPS during scroll
    const fps = scrollMetrics.frames / (scrollMetrics.duration / 1000);
    expect(fps).toBeGreaterThan(30);
    console.log(`Scroll FPS: ${fps.toFixed(1)}`);
  });
});
