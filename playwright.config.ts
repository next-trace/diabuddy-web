import { defineConfig, devices } from '@playwright/test';

// Test web-server: production mode (next build && next start) to avoid the
// dev-mode on-demand compile penalty that landed with the Next 16 + React 19
// upgrade. Dev-mode cold-start went from ~5s/route on Next 15 to ~15-20s/route
// on Next 16, blowing past the 60s test timeout for any test that navigates
// after login. Building once + running production server is faster end-to-end
// AND deterministic.
export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: {
    timeout: 20_000
  },
  fullyParallel: true,
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
      // build → start. CI cost: +30-60s for the build, then every test
      // runs against pre-compiled routes. No more dev-mode compile timeouts.
      command:
        'USER_API_BASE_URL=http://127.0.0.1:18080 pnpm exec next build && ' +
        'USER_API_BASE_URL=http://127.0.0.1:18080 pnpm exec next start -p 3001',
      url: 'http://127.0.0.1:3001',
      reuseExistingServer: true,
      timeout: 300_000
    }
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
