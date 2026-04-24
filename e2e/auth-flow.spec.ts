import { test, expect } from '@playwright/test';

test('redirects anonymous users from dashboard to login', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});

test('logs in through api route and lands on dashboard', async ({ page }) => {
  await page.route('**/api/auth/login', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'set-cookie': 'db_session=1; Path=/; Max-Age=604800; HttpOnly; SameSite=Lax, db_csrf=test-csrf; Path=/; Max-Age=604800; SameSite=Lax'
      },
      body: JSON.stringify({ ok: true })
    });
  });

  await page.goto('/login');
  await page.getByLabel('Email').fill('john@example.com');
  await page.getByLabel('Password').fill('Password123!');
  await page.getByRole('button', { name: 'Continue' }).click();

  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Diabetes Decision Cockpit' })).toBeVisible();
});

test('logs out and returns to login', async ({ context, page }) => {
  await context.addCookies([
    {
      name: 'db_session',
      value: '1',
      url: 'http://127.0.0.1:3001',
      httpOnly: true,
      sameSite: 'Lax'
    },
    {
      name: 'db_csrf',
      value: 'logout-csrf',
      url: 'http://127.0.0.1:3001',
      httpOnly: false,
      sameSite: 'Lax'
    }
  ]);

  await page.route('**/api/auth/logout', async (route) => {
    expect(route.request().headers()['x-csrf-token']).toBe('logout-csrf');
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      headers: {
        'set-cookie': 'db_session=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax, db_csrf=; Path=/; Max-Age=0; SameSite=Lax'
      },
      body: JSON.stringify({ ok: true })
    });
  });

  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'User menu' }).click();
  await page.getByRole('button', { name: 'Sign out' }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Sign In' })).toBeVisible();
});
