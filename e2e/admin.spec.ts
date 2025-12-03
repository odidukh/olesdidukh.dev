import { test, expect } from '@playwright/test';

/**
 * Admin E2E tests
 *
 * Note: These tests require authentication. In a real CI/CD environment,
 * you would set up test credentials via environment variables and a
 * beforeEach hook to log in programmatically.
 *
 * For local testing, ensure you have valid ADMIN_EMAIL set in .env.local
 * and are logged into Supabase before running these tests.
 */

test.describe('Admin Authentication', () => {
  test.skip('unauthenticated user is redirected to login', async ({ page }) => {
    // Clear any existing session
    await page.context().clearCookies();

    await page.goto('/admin');

    // Should redirect to login
    await expect(page).toHaveURL(/login/);
  });

  test.skip('login page loads correctly', async ({ page }) => {
    await page.goto('/login');

    // Check login form elements
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(
      page.getByRole('button', { name: /sign in|login/i })
    ).toBeVisible();
  });

  test.skip('login form validates required fields', async ({ page }) => {
    await page.goto('/login');

    // Try to submit empty form
    await page.getByRole('button', { name: /sign in|login/i }).click();

    // Should show validation or stay on page
    await expect(page).toHaveURL(/login/);
  });

  test.skip('login shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill in invalid credentials
    await page.getByLabel(/email/i).fill('invalid@example.com');
    await page.getByLabel(/password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in|login/i }).click();

    // Should show error message
    await expect(page.getByText(/invalid|error|incorrect|failed/i)).toBeVisible(
      {
        timeout: 5000,
      }
    );
  });
});

test.describe('Admin Dashboard', () => {
  // Skip these tests by default as they require auth
  // To run: set up test credentials in environment
  test.skip('admin dashboard loads when authenticated', async ({ page }) => {
    // This test would require programmatic login setup
    // Example: await loginAsAdmin(page);

    await page.goto('/admin');

    await expect(page).toHaveTitle(/Admin/);
    await expect(
      page.getByRole('heading', { name: /dashboard/i })
    ).toBeVisible();
  });

  test.skip('admin sidebar shows all sections', async ({ page }) => {
    await page.goto('/admin');

    // Check sidebar links
    await expect(page.getByRole('link', { name: /blog/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /projects/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /experience/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /skills/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /messages/i })).toBeVisible();
  });
});

test.describe('Admin Blog CRUD', () => {
  test.skip('blog list page shows posts', async ({ page }) => {
    await page.goto('/admin/blog');

    // Should show list of blog posts
    await expect(page.getByRole('heading', { name: /blog/i })).toBeVisible();

    // Should have "New Post" button
    await expect(
      page.getByRole('link', { name: /new|create|add/i })
    ).toBeVisible();
  });

  test.skip('can navigate to create new blog post', async ({ page }) => {
    await page.goto('/admin/blog');

    await page.getByRole('link', { name: /new|create|add/i }).click();

    await expect(page).toHaveURL(/admin\/blog\/new/);

    // Check form fields
    await expect(page.getByLabel(/title/i)).toBeVisible();
    await expect(page.getByLabel(/content/i)).toBeVisible();
  });

  test.skip('blog form validates required fields', async ({ page }) => {
    await page.goto('/admin/blog/new');

    // Try to submit empty form
    await page.getByRole('button', { name: /save|publish|create/i }).click();

    // Should show validation errors
    await expect(page).toHaveURL(/admin\/blog\/new/);
  });
});

test.describe('Admin Projects CRUD', () => {
  test.skip('projects list page shows projects', async ({ page }) => {
    await page.goto('/admin/projects');

    await expect(
      page.getByRole('heading', { name: /projects/i })
    ).toBeVisible();

    // Should have "New Project" button
    await expect(
      page.getByRole('link', { name: /new|create|add/i })
    ).toBeVisible();
  });

  test.skip('can navigate to create new project', async ({ page }) => {
    await page.goto('/admin/projects');

    await page.getByRole('link', { name: /new|create|add/i }).click();

    await expect(page).toHaveURL(/admin\/projects\/new/);

    // Check form fields
    await expect(page.getByLabel(/title/i)).toBeVisible();
    await expect(page.getByLabel(/description/i)).toBeVisible();
  });
});

test.describe('Admin Messages', () => {
  test.skip('messages page shows contact submissions', async ({ page }) => {
    await page.goto('/admin/messages');

    await expect(
      page.getByRole('heading', { name: /messages/i })
    ).toBeVisible();
  });
});
