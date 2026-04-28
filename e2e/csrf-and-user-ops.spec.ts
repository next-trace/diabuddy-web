import { test, expect, type Page } from '@playwright/test';

const baseUrl = 'http://127.0.0.1:3001';

async function mockAuthMe(page: Page, email: string) {
  await page.route('**/api/auth/me', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'u1', email, role: 'patient' })
    });
  });
}

test('rejects logout when csrf token is missing', async ({ request }) => {
  const res = await request.post('/api/auth/logout');
  expect(res.status()).toBe(403);

  const body = await res.json();
  expect(body.error).toBe('invalid csrf token');
});

test('rejects mutating user routes when csrf token is missing', async ({ request }) => {
  const createRes = await request.post('/api/users', { data: { email: 'a@b.com' } });
  expect(createRes.status()).toBe(403);

  const updateRes = await request.put('/api/users/11111111-1111-1111-1111-111111111111', {
    data: { email: 'u@b.com', password: 'Password123!', phone_number: '+491778902806', status: 'active' }
  });
  expect(updateRes.status()).toBe(403);

  const softDeleteRes = await request.delete('/api/users/11111111-1111-1111-1111-111111111111');
  expect(softDeleteRes.status()).toBe(403);

  const hardDeleteRes = await request.delete('/api/users/11111111-1111-1111-1111-111111111111/hard');
  expect(hardDeleteRes.status()).toBe(403);
});

test('refreshes expired access token and retries protected read', async ({ context, page }) => {
  const userID = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';

  await mockAuthMe(page, 'mock@example.com');
  await context.addCookies([
    {
      name: 'db_session',
      value: '1',
      url: baseUrl,
      httpOnly: true,
      sameSite: 'Lax'
    },
    {
      name: 'db_access_token',
      value: 'access-1',
      url: baseUrl,
      httpOnly: true,
      sameSite: 'Lax'
    },
    {
      name: 'db_refresh_token',
      value: 'refresh-1',
      url: baseUrl,
      httpOnly: true,
      sameSite: 'Lax'
    },
    {
      name: 'db_csrf',
      value: 'csrf-token-1',
      url: baseUrl,
      httpOnly: false,
      sameSite: 'Lax'
    }
  ]);

  await page.goto('/dashboard');
  await page.getByRole('tab', { name: 'User Ops' }).click();
  await page.getByLabel('User ID').fill(userID);
  await page.getByRole('button', { name: 'Get by ID' }).click();

  await expect(page.getByText('Loaded user by id.')).toBeVisible();
  await expect(page.getByText(`ID: ${userID}`)).toBeVisible();
  await expect(page.getByText('Email: rotated@example.com')).toBeVisible();
});

test('authenticated dashboard can create/get/update/hard-delete user', async ({ context, page }) => {
  const createdId = '8a8e0f5f-3558-4ef8-a20a-3c5f7d2f1234';
  const createdEmail = 'ui-created@example.com';
  const updatedEmail = 'ui-updated@example.com';

  await mockAuthMe(page, 'mock@example.com');
  await context.addCookies([
    {
      name: 'db_session',
      value: '1',
      url: baseUrl,
      httpOnly: true,
      sameSite: 'Lax'
    },
    {
      name: 'db_csrf',
      value: 'csrf-token-1',
      url: baseUrl,
      httpOnly: false,
      sameSite: 'Lax'
    }
  ]);

  await page.route('**/api/users', async (route) => {
    const req = route.request();
    if (req.method() !== 'POST') {
      await route.fallback();
      return;
    }

    expect(req.headers()['x-csrf-token']).toBe('csrf-token-1');
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({
        id: createdId,
        email: createdEmail,
        phone_number: '+491778902806',
        status: 'pending',
        created_at: '2026-04-19T00:00:00Z',
        profile: {
          id: 'e7f6ad95-5ba4-45fe-8156-3a258f0be222',
          first_name: 'John',
          last_name: 'Doe',
          gender: 'male',
          relationship_status: 'single',
          birth_date: '1996-01-01T00:00:00Z'
        }
      })
    });
  });

  await page.route(`**/api/users/${createdId}`, async (route) => {
    const req = route.request();

    if (req.method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: createdId,
          email: createdEmail,
          phone_number: '+491778902806',
          status: 'pending',
          created_at: '2026-04-19T00:00:00Z',
          updated_at: '2026-04-19T00:00:00Z',
          deleted_at: null
        })
      });
      return;
    }

    if (req.method() === 'PUT') {
      expect(req.headers()['x-csrf-token']).toBe('csrf-token-1');
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: createdId,
          email: updatedEmail,
          phone_number: '+491778902806',
          status: 'active',
          created_at: '2026-04-19T00:00:00Z',
          updated_at: '2026-04-19T01:00:00Z',
          deleted_at: null
        })
      });
      return;
    }

    await route.fallback();
  });

  await page.route(`**/api/users/${createdId}/hard`, async (route) => {
    const req = route.request();
    expect(req.method()).toBe('DELETE');
    expect(req.headers()['x-csrf-token']).toBe('csrf-token-1');
    await route.fulfill({ status: 204, body: '' });
  });

  await page.goto('/dashboard');
  await page.getByRole('tab', { name: 'User Ops' }).click();

  await page.getByLabel('Email').first().fill(createdEmail);
  await page.getByRole('button', { name: 'Create' }).click();
  await expect(page.getByText(`User created: ${createdId}`)).toBeVisible();

  await page.getByRole('button', { name: 'Get by ID' }).click();
  await expect(page.getByText('Loaded user by id.')).toBeVisible();

  await page.getByLabel('New email').fill(updatedEmail);
  await page.getByRole('button', { name: 'Update' }).click();
  await expect(page.getByText('User updated.')).toBeVisible();

  await page.getByRole('button', { name: 'Hard Delete' }).click();
  await expect(page.getByText('User hard-deleted.')).toBeVisible();
});
