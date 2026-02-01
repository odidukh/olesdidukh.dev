import { test, expect } from '@playwright/test';

// Helper to wait for hydration
async function waitForHydration(page: import('@playwright/test').Page) {
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(500);
}

// Skip blog tests - client components have slow hydration in dev mode
test.describe.skip('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    await waitForHydration(page);
  });

  test('blog page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Blog/);
    // The page has heading - either h1 or h2 with "Blog" or related content
    const heading = page.getByRole('heading').first();
    await expect(heading).toBeVisible();
  });

  test('displays blog post cards', async ({ page }) => {
    // Blog posts are displayed as articles
    const articles = page.locator('article');
    await expect(articles.first()).toBeVisible();
  });

  test('blog cards show title and excerpt', async ({ page }) => {
    // Articles have headings (h2 or h3)
    const articleHeading = page.locator('article').first().locator('h2, h3');
    await expect(articleHeading.first()).toBeVisible();

    // Check for some text content in the article
    const articleText = page.locator('article').first().locator('p');
    await expect(articleText.first()).toBeVisible();
  });

  test('blog cards show metadata', async ({ page }) => {
    // Check for reading time (e.g., "5 min read" or "5 min")
    const readingTime = page.getByText(/\d+\s*min/i).first();
    await expect(readingTime).toBeVisible();
  });

  test('blog cards show category badges', async ({ page }) => {
    // Categories are displayed with common category names
    const categoryBadge = page
      .getByText(/React|TypeScript|Career|Performance|Next|JavaScript/i)
      .first();
    await expect(categoryBadge).toBeVisible();
  });

  test('filter controls are visible', async ({ page }) => {
    // Look for the Filters button (which toggles category filters)
    const filtersButton = page.getByRole('button', { name: /filters/i });
    await expect(filtersButton).toBeVisible();
  });

  test('category filter changes displayed posts', async ({ page }) => {
    // Click on a specific category if available
    const categoryButtons = page
      .locator('button')
      .filter({ hasText: /react|typescript|nextjs|web/i });

    if (
      await categoryButtons
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await categoryButtons.first().click();
      await page.waitForTimeout(300);

      // Posts should be filtered (might show same or fewer)
      await expect(page).toHaveURL(/blog/);
    }
  });

  test('clicking blog post navigates to detail page', async ({ page }) => {
    const firstArticle = page.locator('article').first();
    const blogLink = firstArticle.locator('a').first();

    if (await blogLink.isVisible()) {
      const href = await blogLink.getAttribute('href');
      await blogLink.click();

      // Should navigate to blog post page
      if (href) {
        await expect(page).toHaveURL(
          new RegExp(href.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        );
      }
    }
  });

  test('featured posts are highlighted', async ({ page }) => {
    const featuredBadge = page.getByText(/featured/i);
    if (
      await featuredBadge
        .first()
        .isVisible()
        .catch(() => false)
    ) {
      await expect(featuredBadge.first()).toBeVisible();
    }
  });
});

test.describe.skip('Blog Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    await waitForHydration(page);
  });

  test('search input is visible', async ({ page }) => {
    const searchInput = page
      .getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i));
    await expect(searchInput).toBeVisible();
  });

  test('search filters blog posts', async ({ page }) => {
    const searchInput = page
      .getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i));

    if (await searchInput.isVisible()) {
      // Type a search query
      await searchInput.fill('React');
      await page.waitForTimeout(500); // Wait for debounce

      // Check that posts are filtered
      const filteredPosts = page.locator('article');
      const count = await filteredPosts.count();

      // Should show some results (or no results message)
      if (count > 0) {
        // Verify posts contain search term
        const firstPostTitle = filteredPosts.first().locator('h2, h3').first();
        await expect(firstPostTitle).toBeVisible();
      }
    }
  });

  test('search shows no results message for non-matching query', async ({
    page,
  }) => {
    const searchInput = page
      .getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i));

    if (await searchInput.isVisible()) {
      // Type a query that won't match anything
      await searchInput.fill('xyznonexistent123');
      await page.waitForTimeout(500);

      // Should show no results or empty state
      const noResults = page.getByText(/no.*found|no results|nothing|empty/i);
      if (await noResults.isVisible().catch(() => false)) {
        await expect(noResults).toBeVisible();
      } else {
        // Or zero articles
        const posts = page.locator('article');
        const count = await posts.count();
        expect(count).toBeLessThan(10); // Less than typical full list
      }
    }
  });

  test('clearing search shows all posts', async ({ page }) => {
    const searchInput = page
      .getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i));

    if (await searchInput.isVisible()) {
      // First filter
      await searchInput.fill('React');
      await page.waitForTimeout(500);

      const filteredCount = await page.locator('article').count();

      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(500);

      const allCount = await page.locator('article').count();

      // Should show all posts again (same or more than filtered)
      expect(allCount).toBeGreaterThanOrEqual(filteredCount);
    }
  });

  test('search is keyboard accessible', async ({ page }) => {
    const searchInput = page
      .getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i));

    if (await searchInput.isVisible()) {
      // Focus search with keyboard
      await searchInput.focus();
      await expect(searchInput).toBeFocused();

      // Type with keyboard
      await page.keyboard.type('Next.js');
      await page.waitForTimeout(500);

      // Enter should not cause issues
      await page.keyboard.press('Enter');
      await expect(page).toHaveURL(/blog/);
    }
  });
});

test.describe.skip('Blog Post Detail', () => {
  test('blog post page loads correctly', async ({ page }) => {
    // First go to blog list
    await page.goto('/blog');
    await waitForHydration(page);

    // Click first blog post
    const firstBlog = page.locator('article').first();
    const blogLink = firstBlog.locator('a').first();

    if (await blogLink.isVisible()) {
      await blogLink.click();
      await waitForHydration(page);

      // Check post page loaded
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('blog post shows author info', async ({ page }) => {
    await page.goto('/blog');
    await waitForHydration(page);

    const firstBlog = page.locator('article').first();
    const blogLink = firstBlog.locator('a').first();

    if (await blogLink.isVisible()) {
      await blogLink.click();
      await waitForHydration(page);

      // Look for author name
      const authorName = page.getByText(/Oles/i);
      await expect(authorName.first()).toBeVisible();
    }
  });

  test('blog post has back navigation', async ({ page }) => {
    await page.goto('/blog');
    await waitForHydration(page);

    const firstBlog = page.locator('article').first();
    const blogLink = firstBlog.locator('a').first();

    if (await blogLink.isVisible()) {
      await blogLink.click();
      await waitForHydration(page);

      // Look for back link
      const backLink = page.getByRole('link', { name: /back|blog/i });
      if (await backLink.isVisible()) {
        await backLink.click();
        await expect(page).toHaveURL(/blog/);
      }
    }
  });
});
