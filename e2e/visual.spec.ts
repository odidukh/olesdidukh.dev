import { test, expect } from '@playwright/test';

const pages = [
  { name: 'homepage', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'experience', path: '/experience' },
  { name: 'projects', path: '/projects' },
  { name: 'skills', path: '/skills' },
  { name: 'blog', path: '/blog' },
  { name: 'contact', path: '/contact' },
  { name: 'guestbook', path: '/guestbook' },
];

test.describe('Visual Regression Testing', () => {
  for (const pageInfo of pages) {
    test(`Visual: ${pageInfo.name} (Light Mode)`, async ({ page }) => {
      // Go to the page
      await page.goto(pageInfo.path);

      // Force light mode (though it's default in config)
      await page.emulateMedia({ colorScheme: 'light' });

      // Wait for page resources to load
      await page.waitForLoadState('load');

      // Additional wait for React hydration and animations to settle
      await page.waitForTimeout(2000);

      // Hide specific dynamic elements like view counters if they fluctuate
      // Or we can just use the threshold.

      await expect(page).toHaveScreenshot(`${pageInfo.name}-light.png`, {
        fullPage: true,
        maxDiffPixels: 3000,
      });
    });

    test(`Visual: ${pageInfo.name} (Dark Mode)`, async ({ page }) => {
      // Go to the page
      await page.goto(pageInfo.path);

      // Force dark mode
      await page.emulateMedia({ colorScheme: 'dark' });

      // Wait for page resources to load
      await page.waitForLoadState('load');

      // Additional wait for theme switch and layout settling
      await page.waitForTimeout(2000);

      await expect(page).toHaveScreenshot(`${pageInfo.name}-dark.png`, {
        fullPage: true,
        maxDiffPixels: 3000,
      });
    });
  }

  test('Visual: Command Menu', async ({ page }) => {
    // Set viewport explicitly to ensure desktop layout
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto('/');
    await page.waitForLoadState('load');
    await page.waitForTimeout(1000);

    // Trigger command menu using keyboard shortcut (more reliable than finding the button)
    await page.keyboard.press('Meta+k');

    // Wait for the dialog input to appear
    const input = page.getByPlaceholder(/Type a command/i);
    await expect(input).toBeVisible({ timeout: 10000 });

    // Wait for transition to complete
    await page.waitForTimeout(1000);

    // Take a full-page screenshot instead of dialog element (portal visibility issues)
    await expect(page).toHaveScreenshot('command-menu.png', {
      maxDiffPixels: 500,
    });
  });
});
