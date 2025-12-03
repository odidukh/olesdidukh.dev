import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact');
  });

  test('contact page loads correctly', async ({ page }) => {
    await expect(page).toHaveTitle(/Contact Oles Didukh/i);
    // The page has heading "Let's Build Something Amazing Together"
    await expect(
      page.getByRole('heading', { name: /build something|amazing together/i })
    ).toBeVisible();
  });

  test('form has required fields', async ({ page }) => {
    // Check all form fields are present (using placeholder text since labels aren't connected to inputs via htmlFor)
    await expect(page.getByPlaceholder(/john doe/i)).toBeVisible();
    await expect(page.getByPlaceholder(/john@example.com/i)).toBeVisible();
    await expect(
      page.getByPlaceholder(/tell me about your project/i)
    ).toBeVisible();

    // Check submit button exists
    await expect(
      page.getByRole('button', { name: /send message/i })
    ).toBeVisible();
  });

  test('form validation shows errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.getByRole('button', { name: /send message/i }).click();

    // Check for validation errors (form should show error messages)
    // The form uses custom validation, so check for error text
    const errorText = page.getByText(/required/i);
    await expect(errorText.first()).toBeVisible();
  });

  test('form accepts valid input', async ({ page }) => {
    // Fill in form fields using placeholders
    await page.getByPlaceholder(/john doe/i).fill('Test User');
    await page.getByPlaceholder(/john@example.com/i).fill('test@example.com');
    await page
      .getByPlaceholder(/tell me about your project/i)
      .fill('This is a test message from Playwright E2E tests.');

    // Check that values are filled
    await expect(page.getByPlaceholder(/john doe/i)).toHaveValue('Test User');
    await expect(page.getByPlaceholder(/john@example.com/i)).toHaveValue(
      'test@example.com'
    );
    await expect(
      page.getByPlaceholder(/tell me about your project/i)
    ).toHaveValue('This is a test message from Playwright E2E tests.');
  });

  test('email validation works', async ({ page }) => {
    // Fill in invalid email
    await page.getByPlaceholder(/john@example.com/i).fill('invalid-email');
    // Fill in other required fields
    await page.getByPlaceholder(/john doe/i).fill('Test User');
    await page
      .getByPlaceholder(/tell me about your project/i)
      .fill('Test message here');

    // Try to submit
    await page.getByRole('button', { name: /send message/i }).click();

    // Form should not submit with invalid email - check for error
    await expect(page.getByText(/valid email/i)).toBeVisible();
  });

  test('form is keyboard accessible', async ({ page }) => {
    // Focus on the name input directly
    const nameInput = page.getByPlaceholder(/john doe/i);
    await nameInput.focus();
    await expect(nameInput).toBeFocused();

    // Tab to email
    await page.keyboard.press('Tab');
    await expect(page.getByPlaceholder(/john@example.com/i)).toBeFocused();
  });
});

test.describe('Contact Form Submission', () => {
  test('shows loading state during submission', async ({ page }) => {
    // Mock the API to delay response
    await page.route('**/api/contact', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/contact');

    // Fill form with valid data using placeholders
    await page.getByPlaceholder(/john doe/i).fill('Test User');
    await page.getByPlaceholder(/john@example.com/i).fill('test@example.com');
    await page
      .getByPlaceholder(/tell me about your project/i)
      .fill('Test message with enough characters');

    // Submit
    await page.getByRole('button', { name: /send message/i }).click();

    // Check for loading state (button should be disabled or show loading)
    const submitButton = page.getByRole('button', {
      name: /send|sending message/i,
    });
    await expect(submitButton).toBeDisabled();
  });

  test('shows success message after submission', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/contact', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ success: true }),
      });
    });

    await page.goto('/contact');

    // Fill and submit form with valid data using placeholders
    await page.getByPlaceholder(/john doe/i).fill('Test User');
    await page.getByPlaceholder(/john@example.com/i).fill('test@example.com');
    await page
      .getByPlaceholder(/tell me about your project/i)
      .fill('Test message with enough characters');
    await page.getByRole('button', { name: /send message/i }).click();

    // Check for success toast message "Message sent successfully!"
    await expect(
      page.getByText('Message sent successfully!', { exact: true })
    ).toBeVisible({
      timeout: 5000,
    });
  });

  test('shows error message on API failure', async ({ page }) => {
    // Mock failed API response
    await page.route('**/api/contact', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' }),
      });
    });

    await page.goto('/contact');

    // Fill and submit form with valid data using placeholders
    await page.getByPlaceholder(/john doe/i).fill('Test User');
    await page.getByPlaceholder(/john@example.com/i).fill('test@example.com');
    await page
      .getByPlaceholder(/tell me about your project/i)
      .fill('Test message with enough characters');
    await page.getByRole('button', { name: /send message/i }).click();

    // Check for error toast message "Failed to send message"
    await expect(page.getByText(/failed to send message/i)).toBeVisible({
      timeout: 5000,
    });
  });
});
