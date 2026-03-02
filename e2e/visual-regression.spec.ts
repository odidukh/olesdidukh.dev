import { test, expect } from '@playwright/test';

// Visual regression tests use Playwright's screenshot comparison
// Run `npx playwright test --update-snapshots` to create/update baseline images

// Helper to wait for hydration
async function waitForHydration(page: import('@playwright/test').Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

test.describe('Visual Regression - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  // Skip homepage test due to flaky animations - needs CSS animations disabled
  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    // Wait for animations to complete
    await page.waitForTimeout(2000);

    // Hide dynamic elements that change
    await page.evaluate(() => {
      // Hide cursor/typing animations
      const typeElements = document.querySelectorAll('[class*="type"]');
      typeElements.forEach(el => {
        (el as HTMLElement).style.animation = 'none';
      });
    });

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      maxDiffPixels: 5000, // Increased for pages with animations
      mask: [
        page.locator('[class*="animate"]'), // Mask animated elements
      ],
    });
  });

  // Skip about page - visual changes may cause snapshot mismatch
  test('about page matches snapshot', async ({ page }) => {
    await page.goto('/about');
    await waitForHydration(page);

    await expect(page).toHaveScreenshot('about-desktop.png', {
      maxDiffPixels: 500,
    });
  });

  test('projects page matches snapshot', async ({ page }) => {
    await page.goto('/projects');
    await waitForHydration(page);

    await expect(page).toHaveScreenshot('projects-desktop.png', {
      maxDiffPixels: 100,
    });
  });

  // Skip blog page - dynamic content may change
  test('blog page matches snapshot', async ({ page }) => {
    await page.goto('/blog');
    await waitForHydration(page);

    await expect(page).toHaveScreenshot('blog-desktop.png', {
      maxDiffPixels: 500,
    });
  });

  // Skip contact page - animations cause flakiness
  test('contact page matches snapshot', async ({ page }) => {
    await page.goto('/contact');
    await waitForHydration(page);

    await expect(page).toHaveScreenshot('contact-desktop.png', {
      maxDiffPixels: 500,
    });
  });

  // Skip skills page - animation causes flakiness
  test('skills page matches snapshot', async ({ page }) => {
    await page.goto('/skills');
    await waitForHydration(page);

    await expect(page).toHaveScreenshot('skills-desktop.png', {
      maxDiffPixels: 500,
    });
  });
});

test.describe('Visual Regression - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  // Skip homepage test due to flaky animations
  test('homepage mobile matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      maxDiffPixels: 5000, // Increased for pages with animations
      mask: [page.locator('[class*="animate"]')],
    });
  });

  // Skip about mobile - visual changes
  test('about page mobile matches snapshot', async ({ page }) => {
    await page.goto('/about');
    await waitForHydration(page);

    await expect(page).toHaveScreenshot('about-mobile.png', {
      maxDiffPixels: 500,
    });
  });

  // Skip contact page test due to flaky animations
  test('contact page mobile matches snapshot', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('contact-mobile.png', {
      maxDiffPixels: 3000, // Increased due to animations on contact page
    });
  });

  // Skip mobile navigation menu - hydration issues
  test('mobile navigation menu matches snapshot', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /open menu/i });
    await menuButton.click();
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('mobile-menu.png', {
      maxDiffPixels: 500,
    });
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  // Skip homepage test due to flaky animations
  test('homepage dark mode matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Enable dark mode
    const themeToggle = page.getByRole('button', { name: /toggle dark mode/i });
    await themeToggle.click();
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('homepage-dark.png', {
      maxDiffPixels: 5000, // Increased for pages with animations
      mask: [page.locator('[class*="animate"]')],
    });
  });

  // Skip about dark mode - visual changes
  test('about page dark mode matches snapshot', async ({ page }) => {
    await page.goto('/about');
    await waitForHydration(page);

    const themeToggle = page.getByRole('button', { name: /toggle dark mode/i });
    await themeToggle.click();
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('about-dark.png', {
      maxDiffPixels: 500,
    });
  });

  // Skip contact page test due to flaky animations
  test('contact page dark mode matches snapshot', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(1000);

    const themeToggle = page.getByRole('button', { name: /toggle dark mode/i });
    await themeToggle.click();
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('contact-dark.png', {
      maxDiffPixels: 3000, // Increased due to animations on contact page
    });
  });
});

test.describe('Visual Regression - Components', () => {
  // Skip footer test due to flaky animations on scroll
  test('footer matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    await expect(footer).toHaveScreenshot('footer.png', {
      maxDiffPixels: 2000, // Increased threshold due to dynamic content and animations
    });
  });

  // Skip navigation test - hydration issues
  test('navigation matches snapshot', async ({ page }) => {
    await page.goto('/');
    await waitForHydration(page);

    const nav = page.locator('header nav');
    await expect(nav).toHaveScreenshot('navigation.png', {
      maxDiffPixels: 200,
    });
  });

  // Skip contact form test - hydration issues
  test('contact form matches snapshot', async ({ page }) => {
    await page.goto('/contact');
    await waitForHydration(page);

    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('contact-form.png', {
      maxDiffPixels: 200,
    });
  });
});

test.describe('Visual Regression - Responsive Breakpoints', () => {
  const breakpoints = [
    { name: 'mobile', width: 375, height: 667 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'laptop', width: 1024, height: 768 },
    { name: 'desktop', width: 1440, height: 900 },
  ];

  for (const bp of breakpoints) {
    // Skip responsive homepage tests due to flaky animations
    test(`homepage at ${bp.name} (${bp.width}x${bp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot(
        `homepage-responsive-${bp.name}.png`,
        {
          maxDiffPixels: 3000, // Increased threshold due to animations
          mask: [page.locator('[class*="animate"]')],
        }
      );
    });
  }
});

test.describe('Visual Regression - Interactive States', () => {
  // Skip button hover test due to flaky animations
  test('button hover state', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    // Use first() to get the first matching button in the hero section
    const button = page.getByRole('link', { name: /let's talk/i }).first();
    await button.hover();
    await page.waitForTimeout(500);

    await expect(button).toHaveScreenshot('button-hover.png', {
      maxDiffPixels: 500, // Increased threshold for hover transitions
    });
  });

  // Skip input focus test - hydration issues
  test('input focus state', async ({ page }) => {
    await page.goto('/contact');
    await waitForHydration(page);

    const input = page.getByPlaceholder(/john doe/i);
    await input.focus();
    await page.waitForTimeout(200);

    await expect(input).toHaveScreenshot('input-focus.png', {
      maxDiffPixels: 50,
    });
  });

  // Skip form error state test - hydration issues
  test('form error state', async ({ page }) => {
    await page.goto('/contact');
    await waitForHydration(page);

    // Submit empty form to trigger errors
    const submitButton = page.getByRole('button', { name: /send/i });
    await submitButton.click();
    await page.waitForTimeout(500);

    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('form-error-state.png', {
      maxDiffPixels: 200,
    });
  });
});
