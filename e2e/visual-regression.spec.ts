import { test, expect } from '@playwright/test';

// Visual regression tests use Playwright's screenshot comparison
// Run `npx playwright test --update-snapshots` to create/update baseline images

test.describe('Visual Regression - Desktop', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('homepage matches snapshot', async ({ page }) => {
    await page.goto('/');
    // Wait for animations to complete
    await page.waitForTimeout(1000);

    // Hide dynamic elements that change
    await page.evaluate(() => {
      // Hide cursor/typing animations
      const typeElements = document.querySelectorAll('[class*="type"]');
      typeElements.forEach(el => {
        (el as HTMLElement).style.animation = 'none';
      });
    });

    await expect(page).toHaveScreenshot('homepage-desktop.png', {
      maxDiffPixels: 100,
      mask: [
        page.locator('[class*="animate"]'), // Mask animated elements
      ],
    });
  });

  test('about page matches snapshot', async ({ page }) => {
    await page.goto('/about');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('about-desktop.png', {
      maxDiffPixels: 100,
    });
  });

  test('projects page matches snapshot', async ({ page }) => {
    await page.goto('/projects');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('projects-desktop.png', {
      maxDiffPixels: 100,
    });
  });

  test('blog page matches snapshot', async ({ page }) => {
    await page.goto('/blog');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('blog-desktop.png', {
      maxDiffPixels: 100,
    });
  });

  test('contact page matches snapshot', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('contact-desktop.png', {
      maxDiffPixels: 100,
    });
  });

  test('skills page matches snapshot', async ({ page }) => {
    await page.goto('/skills');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('skills-desktop.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression - Mobile', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('homepage mobile matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot('homepage-mobile.png', {
      maxDiffPixels: 100,
      mask: [page.locator('[class*="animate"]')],
    });
  });

  test('about page mobile matches snapshot', async ({ page }) => {
    await page.goto('/about');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('about-mobile.png', {
      maxDiffPixels: 100,
    });
  });

  test('contact page mobile matches snapshot', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(500);

    await expect(page).toHaveScreenshot('contact-mobile.png', {
      maxDiffPixels: 100,
    });
  });

  test('mobile navigation menu matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('mobile-menu.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression - Dark Mode', () => {
  test.use({ viewport: { width: 1280, height: 720 } });

  test('homepage dark mode matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Enable dark mode
    const themeToggle = page.getByRole('button', { name: /theme/i });
    await themeToggle.click();
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('homepage-dark.png', {
      maxDiffPixels: 100,
      mask: [page.locator('[class*="animate"]')],
    });
  });

  test('about page dark mode matches snapshot', async ({ page }) => {
    await page.goto('/about');
    await page.waitForTimeout(500);

    const themeToggle = page.getByRole('button', { name: /theme/i });
    await themeToggle.click();
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('about-dark.png', {
      maxDiffPixels: 100,
    });
  });

  test('contact page dark mode matches snapshot', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(500);

    const themeToggle = page.getByRole('button', { name: /theme/i });
    await themeToggle.click();
    await page.waitForTimeout(300);

    await expect(page).toHaveScreenshot('contact-dark.png', {
      maxDiffPixels: 100,
    });
  });
});

test.describe('Visual Regression - Components', () => {
  test('footer matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    // Scroll to footer
    const footer = page.locator('footer');
    await footer.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);

    await expect(footer).toHaveScreenshot('footer.png', {
      maxDiffPixels: 50,
    });
  });

  test('navigation matches snapshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    const nav = page.locator('nav').first();
    await expect(nav).toHaveScreenshot('navigation.png', {
      maxDiffPixels: 50,
    });
  });

  test('contact form matches snapshot', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(500);

    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('contact-form.png', {
      maxDiffPixels: 50,
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
    test(`homepage at ${bp.name} (${bp.width}x${bp.height})`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: bp.width, height: bp.height });
      await page.goto('/');
      await page.waitForTimeout(500);

      await expect(page).toHaveScreenshot(`homepage-${bp.name}.png`, {
        maxDiffPixels: 100,
        mask: [page.locator('[class*="animate"]')],
      });
    });
  }
});

test.describe('Visual Regression - Interactive States', () => {
  test('button hover state', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    const button = page.getByRole('link', { name: /view my work/i });
    await button.hover();
    await page.waitForTimeout(200);

    await expect(button).toHaveScreenshot('button-hover.png', {
      maxDiffPixels: 20,
    });
  });

  test('input focus state', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(500);

    const input = page.getByPlaceholder(/john doe/i);
    await input.focus();
    await page.waitForTimeout(200);

    await expect(input).toHaveScreenshot('input-focus.png', {
      maxDiffPixels: 20,
    });
  });

  test('form error state', async ({ page }) => {
    await page.goto('/contact');
    await page.waitForTimeout(500);

    // Submit empty form to trigger errors
    const submitButton = page.getByRole('button', { name: /send/i });
    await submitButton.click();
    await page.waitForTimeout(500);

    const form = page.locator('form').first();
    await expect(form).toHaveScreenshot('form-error-state.png', {
      maxDiffPixels: 100,
    });
  });
});
