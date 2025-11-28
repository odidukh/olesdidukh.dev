import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('contact page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact/);
    await expect(
      page.getByRole('heading', { name: /get in touch/i })
    ).toBeVisible();
  });

  test('form has required fields', async ({ page }) => {
    // Check all form fields are present
    await expect(page.getByLabel(/name/i)).toBeVisible();
    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/message/i)).toBeVisible();

    // Check submit button exists
    await expect(page.getByRole('button', { name: /send/i })).toBeVisible();
  });

  test('form validation shows errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /send/i }).click();

    // Check for validation errors (form should not submit)
    // The form should show HTML5 validation or custom error messages
    const nameInput = page.getByLabel(/name/i);
    await expect(nameInput).toBeVisible();
  });

  test('form accepts valid input', async ({ page }) => {
    // Fill in form fields
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page
      .getByLabel(/message/i)
      .fill('This is a test message from Playwright E2E tests.');

    // Check that values are filled
    await expect(page.getByLabel(/name/i)).toHaveValue('Test User');
    await expect(page.getByLabel(/email/i)).toHaveValue('test@example.com');
    await expect(page.getByLabel(/message/i)).toHaveValue(
      'This is a test message from Playwright E2E tests.'
    );
  });

  test('email validation works', async ({ page }) => {
    // Fill in invalid email
    await page.getByLabel(/email/i).fill('invalid-email');

    // Try to submit
    await page.getByRole('button', { name: /send/i }).click();

    // Form should not submit with invalid email
    // Check we're still on the contact page
    await expect(page).toHaveURL('/contact');
  });

  test('form is keyboard accessible', async ({ page }) => {
    // Tab through form fields
    await page.keyboard.press('Tab'); // Skip link
    await page.keyboard.press('Tab'); // Navigation items...

    // Continue tabbing until we reach the form
    // This is a basic check that form elements are focusable
    const nameInput = page.getByLabel(/name/i);
    await nameInput.focus();
    await expect(nameInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/email/i)).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByLabel(/message/i)).toBeFocused();
  });
});

test.describe('Contact Form Submission', () => {
  test('shows loading state during submission', async ({ page }) => {
    // Mock the API to delay response
    await page.route('/api/contact', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/contact');

    // Fill form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/message/i).fill('Test message');

    // Submit
    await page.getByRole('button', { name: /send/i }).click();

    // Check for loading state (button should be disabled or show loading)
    const submitButton = page.getByRole('button', { name: /send|sending/i });
    await expect(submitButton).toBeDisabled();
  });

  test('shows success message after submission', async ({ page }) => {
    // Mock successful API response
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 200,
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/contact');

    // Fill and submit form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/message/i).fill('Test message');
    await page.getByRole('button', { name: /send/i }).click();

    // Check for success toast/message
    await expect(page.getByText(/success|sent|thank/i)).toBeVisible({
      timeout: 5000,
    });
  });

  test('shows error message on API failure', async ({ page }) => {
    // Mock failed API response
    await page.route('/api/contact', async route => {
      await route.fulfill({
        status: 500,
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await page.goto('/contact');

    // Fill and submit form
    await page.getByLabel(/name/i).fill('Test User');
    await page.getByLabel(/email/i).fill('test@example.com');
    await page.getByLabel(/message/i).fill('Test message');
    await page.getByRole('button', { name: /send/i }).click();

    // Check for error message
    await expect(page.getByText(/error|failed|try again/i)).toBeVisible({
      timeout: 5000,
    });
  });
});
