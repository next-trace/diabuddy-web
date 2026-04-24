import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  expect: {
    timeout: 5_000
  },
  fullyParallel: true,
  retries: 0,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:3001',
    trace: 'on-first-retry'
  },
  webServer: [
    {
      command: 'node ./e2e/mock-backend.cjs',
      url: 'http://127.0.0.1:18080/healthz',
      reuseExistingServer: true,
      timeout: 120_000
    },
    {
      command: 'USER_API_BASE_URL=http://127.0.0.1:18080 pnpm exec next dev -p 3001',
      url: 'http://127.0.0.1:3001',
      reuseExistingServer: true,
      timeout: 120_000
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
