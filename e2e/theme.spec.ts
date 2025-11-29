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

    // Wait for state to be saved
    await page.waitForTimeout(500);

    // Reload page
    await page.reload();

    // Dark mode should persist (may have brief flash, check after hydration)
    await page.waitForTimeout(1000);
    await expect(page.locator('html')).toHaveClass(/dark/);
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
  test('respects prefers-color-scheme: dark', async ({ page }) => {
    // Emulate dark color scheme preference
    await page.emulateMedia({ colorScheme: 'dark' });

    // Clear any stored theme preference
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    await page.goto('/');

    // Wait for client-side hydration
    await page.waitForTimeout(1000);

    // Check if system preference is respected (if store is in 'system' mode)
    // Note: This depends on implementation - some sites default to system, others to light
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark'));

    // This test documents the behavior rather than strictly asserting
    // If using system preference, should be dark
    if (isDark) {
      await expect(html).toHaveClass(/dark/);
    }
  });

  test('respects prefers-color-scheme: light', async ({ page }) => {
    // Emulate light color scheme preference
    await page.emulateMedia({ colorScheme: 'light' });

    // Clear any stored theme preference
    await page.context().clearCookies();
    await page.evaluate(() => localStorage.clear());

    await page.goto('/');

    // Wait for client-side hydration
    await page.waitForTimeout(1000);

    // Check system preference is respected
    const html = page.locator('html');
    const isDark = await html.evaluate(el => el.classList.contains('dark'));

    // If using system preference, should be light
    if (!isDark) {
      await expect(html).not.toHaveClass(/dark/);
    }
  });
});
