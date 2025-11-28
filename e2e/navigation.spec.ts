import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('homepage loads correctly', async ({ page }) => {
    await page.goto('/');

    // Check page title
    await expect(page).toHaveTitle(/Oles Didukh/);

    // Check hero content is visible
    await expect(page.getByText('Senior Front-End')).toBeVisible();
    await expect(page.getByText('Engineer')).toBeVisible();
  });

  test('navigation links work', async ({ page }) => {
    await page.goto('/');

    // Navigate to About
    await page.getByRole('link', { name: 'About' }).first().click();
    await expect(page).toHaveURL('/about');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    // Navigate to Projects
    await page.getByRole('link', { name: 'Projects' }).first().click();
    await expect(page).toHaveURL('/projects');

    // Navigate to Blog
    await page.getByRole('link', { name: 'Blog' }).first().click();
    await expect(page).toHaveURL('/blog');

    // Navigate to Contact
    await page.getByRole('link', { name: 'Contact' }).first().click();
    await expect(page).toHaveURL('/contact');
  });

  test('skip link works', async ({ page }) => {
    await page.goto('/');

    // Focus on skip link by pressing Tab
    await page.keyboard.press('Tab');

    // Check skip link is visible when focused
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();

    // Click skip link
    await skipLink.click();

    // Check that focus moved to main content
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
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('dark mode toggle works', async ({ page }) => {
    await page.goto('/');

    // Find and click theme toggle
    const themeToggle = page.getByRole('button', { name: /theme/i });
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
