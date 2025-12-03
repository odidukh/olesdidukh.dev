import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Oles Didukh/);

    // Check navigation is present (this also verifies page loaded)
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');

    const desktopNav = page.locator('.hidden.lg\\:flex');

    // Navigate to About
    await desktopNav.getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Navigate to Projects
    await desktopNav.getByRole('link', { name: 'Projects' }).click();
    await expect(page).toHaveURL('/projects');

    // Navigate to Blog
    await desktopNav.getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL('/blog');

    // Navigate to Contact
    await desktopNav.getByRole('link', { name: 'Contact' }).click();
    await expect(page).toHaveURL('/contact');
  });

  test('skip link works', async ({ page }) => {
    await page.goto('/');

    // The skip link is initially visually hidden but present in the DOM
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeAttached();

    // Focus on skip link by pressing Tab
    await page.keyboard.press('Tab');

    // The skip link should be visible when focused (sr-only changes to not-sr-only on focus)
    await expect(skipLink).toBeVisible();

    // Press Enter to activate the skip link (instead of click which may fail for positioned elements)
    await page.keyboard.press('Enter');

    // Check that main content element exists and is visible
    await expect(page.locator('#main-content')).toBeVisible();
  });

  test('mobile menu works', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Open mobile menu
    const menuButton = page.getByRole('button', { name: /menu/i });
    await menuButton.click();

    // Check menu items are visible
    const mobileNav = page.locator('.lg\\:hidden.mt-4');
    await expect(mobileNav).toBeVisible();

    await expect(mobileNav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(
      mobileNav.getByRole('link', { name: 'Projects' })
    ).toBeVisible();
    await expect(mobileNav.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(
      mobileNav.getByRole('link', { name: 'Contact' })
    ).toBeVisible();
  });

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/');

    // Find and click theme toggle
    // Find and click theme toggle
    const themeToggle = page.getByRole('button', { name: 'Toggle dark mode' });
    await themeToggle.click();

    // Check that dark mode is applied
    await expect(page.locator('html')).toHaveClass(/dark/);

    // Toggle back
    await themeToggle.click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);
  });
});

test.describe('Page Accessibility', () => {
  test('homepage has no critical accessibility issues', async ({ page }) => {
    await page.goto('/');

    // Check main landmark exists
    await expect(page.locator('main#main-content')).toBeVisible();

    // Check navigation landmark exists
    await expect(page.getByRole('navigation')).toBeVisible();

    // Check footer landmark exists
    await expect(page.getByRole('contentinfo')).toBeVisible();
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/');

    // Get all images
    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // All images should have alt attribute (can be empty for decorative)
      expect(alt).not.toBeNull();
    }
  });
});
