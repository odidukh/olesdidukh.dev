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

      // Wait for everything to settle
      await page.waitForLoadState('networkidle');

      // Additional wait for any dynamic content or subtle animations that might be settling
      await page.waitForTimeout(2000);

      // Hide specific dynamic elements like view counters if they fluctuate
      // Or we can just use the threshold.

      await expect(page).toHaveScreenshot(`${pageInfo.name}-light.png`, {
        fullPage: true,
      });
    });

    test(`Visual: ${pageInfo.name} (Dark Mode)`, async ({ page }) => {
      // Go to the page
      await page.goto(pageInfo.path);

      // Force dark mode
      await page.emulateMedia({ colorScheme: 'dark' });

      // Wait for everything to settle
      await page.waitForLoadState('networkidle');

      // Additional wait for theme switch and layout settling
      await page.waitForTimeout(2000);

      await expect(page).toHaveScreenshot(`${pageInfo.name}-dark.png`, {
        fullPage: true,
      });
    });
  }

  test('Visual: Command Menu', async ({ page }) => {
    // Set viewport explicitly to ensure desktop layout
    await page.setViewportSize({ width: 1280, height: 800 });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Trigger command menu by clicking the Search button
    const searchButton = page.getByRole('button', { name: /search/i });
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    // Wait for the dialog input to appear
    const input = page.getByPlaceholder(/Type a command/i);
    await expect(input).toBeAttached({ timeout: 10000 });

    // Focus and wait for transition
    await input.focus();
    await page.waitForTimeout(2000);

    // Take screenshot of the dialog container
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveScreenshot('command-menu.png');
  });
});
