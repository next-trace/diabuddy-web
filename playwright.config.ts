import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  // 60s / 15s — Next.js dev cold-start takes 5-10s for first route compile
  // on a GitHub Actions runner; the old 30s/5s budget was under that floor.
  timeout: 60_000,
  expect: {
    timeout: 15_000
  },
  fullyParallel: true,
  // One retry absorbs the occasional dev-server compile stall; CI is again
  // blocking (continue-on-error removed from the workflow).
  retries: 1,
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
