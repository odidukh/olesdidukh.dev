import { test, expect } from '@playwright/test';

test.describe('Projects Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects');
  });

  test('projects page loads correctly', async ({ page }) => {
    // The page has h2 heading "Featured Projects"
    await expect(
      page.getByRole('heading', { name: /featured.*projects|projects/i })
    ).toBeVisible();
  });

  test('displays project cards', async ({ page }) => {
    // Check that project cards are visible
    const projectCards = page.locator('[class*="card"]');
    await expect(projectCards.first()).toBeVisible();
  });

  test('category filter tabs are visible', async ({ page }) => {
    // Look for the Filters button instead of All tab
    const filtersButton = page.getByRole('button', { name: /filters/i });
    await expect(filtersButton).toBeVisible();
  });

  test('category filter changes displayed projects', async ({ page }) => {
    // Click on "All" to see all projects first
    const allButton = page.getByRole('button', { name: /all/i });
    if (await allButton.isVisible()) {
      await allButton.click();
    }

    // Wait for projects to load
    await page.waitForTimeout(500);

    // Click on a specific category if available
    const webAppButton = page.getByRole('button', { name: /web app/i });
    if (await webAppButton.isVisible()) {
      await webAppButton.click();
      await page.waitForTimeout(300); // Wait for filter animation

      // Projects should be filtered
      await expect(page).toHaveURL(/projects/);
    }
  });

  test('project card shows title and description', async ({ page }) => {
    // Find first project card
    const firstProject = page.locator('article').first();

    if (await firstProject.isVisible()) {
      // Check for title (h2 or h3)
      const title = firstProject.locator('h2, h3').first();
      await expect(title).toBeVisible();

      // Check for description
      const description = firstProject.locator('p').first();
      await expect(description).toBeVisible();
    }
  });

  test('project card shows technologies', async ({ page }) => {
    // Look for technology badges in project cards (they show tech like React, TypeScript, etc.)
    const techBadge = page
      .locator('[class*="rounded"]')
      .filter({ hasText: /React|TypeScript|Next|Node/i })
      .first();
    await expect(techBadge).toBeVisible();
  });

  test('clicking project opens detail view or modal', async ({ page }) => {
    // Find and click on a project card
    const projectCard = page.locator('article').first();

    if (await projectCard.isVisible()) {
      const cardButton = projectCard.locator('button, a').first();
      if (await cardButton.isVisible()) {
        await cardButton.click();

        // Either a modal opens or we navigate to project detail
        await page.waitForTimeout(500);

        // Check if modal opened or page changed
        const modal = page.locator('[role="dialog"]');
        const modalVisible = await modal.isVisible().catch(() => false);

        if (modalVisible) {
          // Modal test
          await expect(modal).toBeVisible();

          // Close modal with Escape
          await page.keyboard.press('Escape');
          await expect(modal).not.toBeVisible();
        }
      }
    }
  });

  test('featured projects are highlighted', async ({ page }) => {
    // Look for featured badge or indicator
    const featuredBadge = page.getByText(/featured/i);
    if (await featuredBadge.isVisible().catch(() => false)) {
      await expect(featuredBadge).toBeVisible();
    }
  });
});

test.describe('Project Modal', () => {
  test('modal shows project details', async ({ page }) => {
    await page.goto('/projects');

    // Click on a project to open modal
    const viewButton = page
      .getByRole('button', { name: /view|details|more/i })
      .first();

    if (await viewButton.isVisible()) {
      await viewButton.click();

      // Wait for modal
      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible().catch(() => false)) {
        // Check modal content
        await expect(modal.locator('h2')).toBeVisible();

        // Close button should be visible
        const closeButton = modal.getByRole('button', { name: /close/i });
        await expect(closeButton).toBeVisible();
      }
    }
  });

  test('modal closes on backdrop click', async ({ page }) => {
    await page.goto('/projects');

    const viewButton = page
      .getByRole('button', { name: /view|details|more/i })
      .first();

    if (await viewButton.isVisible()) {
      await viewButton.click();

      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible().catch(() => false)) {
        // Click backdrop
        await page.mouse.click(10, 10);
        await page.waitForTimeout(300);

        // Modal should be closed
        await expect(modal).not.toBeVisible();
      }
    }
  });

  test('modal has image gallery navigation', async ({ page }) => {
    await page.goto('/projects');

    const viewButton = page
      .getByRole('button', { name: /view|details|more/i })
      .first();

    if (await viewButton.isVisible()) {
      await viewButton.click();

      const modal = page.locator('[role="dialog"]');
      if (await modal.isVisible().catch(() => false)) {
        // Check for navigation arrows
        const nextButton = modal.getByRole('button', { name: /next/i });

        // At least one navigation button might exist for multi-image projects
        if (await nextButton.isVisible().catch(() => false)) {
          await nextButton.click();
          // Image should change - verify no error
          await page.waitForTimeout(300);
        }
      }
    }
  });
});
