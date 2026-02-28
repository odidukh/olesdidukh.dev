import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env['CI'];

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 2, // Always retry to handle hydration timing
  ...(isCI ? { workers: 1 } : {}),
  reporter: isCI ? 'github' : 'html',
  timeout: 60000, // Increase default timeout to 60s
  expect: {
    timeout: 10000, // Increase expect timeout to 10s
  },
  use: {
    baseURL: 'http://localhost:3001',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    // Wait for network idle to ensure hydration completes
    navigationTimeout: 30000,
    actionTimeout: 15000,
    colorScheme: 'light',
    contextOptions: {
      reducedMotion: 'reduce',
    },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'npm run dev -- --port 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !isCI,
    timeout: 120000,
  },
});
