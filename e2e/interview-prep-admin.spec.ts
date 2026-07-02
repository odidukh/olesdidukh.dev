import { test, expect } from '@playwright/test';

// Authenticated round-trip (create/edit/delete a category) is deferred to
// manual verification: no admin-login fixture exists in this suite yet
// (see e2e/interview-prep.spec.ts and e2e/admin.spec.ts, both of which
// skip authenticated flows for the same reason).
test.describe('interview-prep admin access', () => {
  test('unauthenticated visit to the hub redirects away from admin', async ({
    page,
  }) => {
    await page.goto('/admin/interview-prep');
    await expect(page).toHaveURL(/\/login|\/$/);
  });
});
