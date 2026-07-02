import { test, expect } from '@playwright/test';

test.describe('interview-prep access gate', () => {
  test('redirects an unauthenticated visitor to the login page', async ({
    page,
  }) => {
    await page.goto('/interview-prep');
    await expect(page).toHaveURL(/\/login/);
    await expect(page).toHaveURL(
      /redirect=%2Finterview-prep|redirect=\/interview-prep/
    );
  });
});

// Authenticated flows require an admin session; no E2E auth harness exists yet
// (deferred, per spec §8). These mirror the skipped admin E2E convention.
test.describe('interview-prep platform (authenticated)', () => {
  test.skip('hub matches its visual snapshot', async ({ page }) => {
    await page.goto('/interview-prep');
    await expect(page).toHaveScreenshot('interview-prep-hub.png', {
      fullPage: true,
    });
  });

  test.skip('dashboard matches its visual snapshot', async ({ page }) => {
    await page.goto('/interview-prep/houston-frontend/dashboard');
    await expect(page).toHaveScreenshot('interview-prep-dashboard.png', {
      fullPage: true,
    });
  });

  test.skip('adds a custom question end to end', async ({ page }) => {
    await page.goto('/interview-prep/houston-frontend/browse');
    await page.getByRole('button', { name: /add custom question/i }).click();
    await page.getByLabel('Question').fill('Explain hydration');
    await page.getByRole('button', { name: /^add question$/i }).click();
    await expect(page.getByText('Explain hydration')).toBeVisible();
  });
});
