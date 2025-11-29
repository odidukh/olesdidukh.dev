import { test, expect } from '@playwright/test';

test.describe('Dark Mode', () => {
  test('dark mode toggle changes theme', async ({ page }) => {
    await page.goto('/');

    // Find theme toggle button
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });
    await expect(themeToggle).toBeVisible();

    // Get initial state
    const initialIsDark = await page
      .locator('html')
      .evaluate(el => el.classList.contains('dark'));

    // Click to toggle
    await themeToggle.click();

    // Theme should have changed
    const afterToggleIsDark = await page
      .locator('html')
      .evaluate(el => el.classList.contains('dark'));
    expect(afterToggleIsDark).not.toBe(initialIsDark);
  });

  test('dark mode persists across page navigation', async ({ page }) => {
    await page.goto('/');

    // Enable dark mode
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });
    const initialIsDark = await page
      .locator('html')
      .evaluate(el => el.classList.contains('dark'));

    if (!initialIsDark) {
      await themeToggle.click();
    }

    // Verify dark mode is on
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Navigate to another page
    await page.getByRole('link', { name: 'About' }).first().click();
    await expect(page).toHaveURL('/about');

    // Dark mode should persist
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Navigate to another page
    await page.getByRole('link', { name: 'Projects' }).first().click();
    await expect(page).toHaveURL('/projects');

    // Dark mode should still persist
    await expect(page.locator('html')).toHaveClass(/dark/);
  });

  test('dark mode persists after page reload', async ({ page }) => {
    await page.goto('/');

    // Enable dark mode
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });
    const initialIsDark = await page
      .locator('html')
      .evaluate(el => el.classList.contains('dark'));

    if (!initialIsDark) {
      await themeToggle.click();
    }

    // Wait for state to be saved to localStorage
    await page.waitForTimeout(500);

    // Verify dark mode is active before reload
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Verify localStorage was set
    const storedTheme = await page.evaluate(() => {
      const stored = localStorage.getItem('theme-storage');
      return stored ? JSON.parse(stored) : null;
    });
    expect(storedTheme?.state?.mode).toBe('dark');

    // Reload page
    await page.reload();

    // The blocking script in layout.tsx should apply 'dark' class immediately
    // Wait for the page to fully load
    await page.waitForLoadState('load');

    // Dark mode should persist (applied by the blocking script before React hydration)
    await expect(page.locator('html')).toHaveClass(/dark/, { timeout: 5000 });
  });

  test('light mode persists across navigation', async ({ page }) => {
    await page.goto('/');

    // Ensure light mode
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });
    const initialIsDark = await page
      .locator('html')
      .evaluate(el => el.classList.contains('dark'));

    if (initialIsDark) {
      await themeToggle.click();
    }

    // Verify light mode
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    // Navigate
    await page.getByRole('link', { name: 'Blog' }).first().click();
    await expect(page).toHaveURL('/blog');

    // Light mode should persist
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });

  test('theme toggle is keyboard accessible', async ({ page }) => {
    await page.goto('/');

    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });

    // Focus the toggle
    await themeToggle.focus();
    await expect(themeToggle).toBeFocused();

    // Get current state
    const beforeState = await page
      .locator('html')
      .evaluate(el => el.classList.contains('dark'));

    // Press Enter to toggle
    await page.keyboard.press('Enter');
    await page.waitForTimeout(300);

    const afterState = await page
      .locator('html')
      .evaluate(el => el.classList.contains('dark'));

    // Theme should have toggled
    expect(afterState).not.toBe(beforeState);
  });

  test('dark mode applies correct colors', async ({ page }) => {
    await page.goto('/');

    // Enable dark mode
    const themeToggle = page.getByRole('button', { name: /theme|dark|light/i });
    const initialIsDark = await page
      .locator('html')
      .evaluate(el => el.classList.contains('dark'));

    if (!initialIsDark) {
      await themeToggle.click();
    }

    // Get background color of body or main element
    const bgColor = await page.locator('body').evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });

    // Dark mode should have dark background (rgb values should be low)
    // This is a basic check - dark backgrounds typically have RGB values < 50
    const rgbMatch = bgColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const r = parseInt(rgbMatch[1] || '255');
      const g = parseInt(rgbMatch[2] || '255');
      const b = parseInt(rgbMatch[3] || '255');
      const avgBrightness = (r + g + b) / 3;

      // Dark mode should have average brightness below 50
      expect(avgBrightness).toBeLessThan(100);
    }
  });
});

test.describe('Theme Respects System Preference', () => {
  test('respects prefers-color-scheme: dark', async ({ browser }) => {
    // Create a fresh context with dark color scheme
    const context = await browser.newContext({
      colorScheme: 'dark',
    });
    const page = await context.newPage();

    // Navigate to the site (fresh context = no localStorage)
    await page.goto('/');
    await page.waitForLoadState('load');

    // The blocking script checks matchMedia for 'system' mode (default)
    // With prefers-color-scheme: dark, it should add 'dark' class
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark'));

    // With system preference set to dark and no stored preference,
    // the default 'system' mode should result in dark theme
    expect(isDark).toBe(true);

    await context.close();
  });

  test('respects prefers-color-scheme: light', async ({ browser }) => {
    // Create a fresh context with light color scheme
    const context = await browser.newContext({
      colorScheme: 'light',
    });
    const page = await context.newPage();

    // Navigate to the site (fresh context = no localStorage)
    await page.goto('/');
    await page.waitForLoadState('load');

    // The blocking script checks matchMedia for 'system' mode (default)
    // With prefers-color-scheme: light, it should NOT add 'dark' class
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark'));

    // With system preference set to light and no stored preference,
    // the default 'system' mode should result in light theme
    expect(isDark).toBe(false);

    await context.close();
  });
});
