import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '../../../../../lib/admin-auth';
import { authedBackendFetch, toJsonResponse, verifyCsrf } from '../../../../../lib/server-auth';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const blocked = requireAdminApi(req);
  if (blocked) return blocked;
  const { response, rotatedTokens } = await authedBackendFetch(req, '/admin/ai/provider-policy', { method: 'GET' });
  return toJsonResponse(response, rotatedTokens);
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const blocked = requireAdminApi(req);
  if (blocked) return blocked;
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'forbidden', details: 'missing or invalid csrf token' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const { response, rotatedTokens } = await authedBackendFetch(req, '/admin/ai/provider-policy', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ item: (body.item || {}) as Record<string, unknown> })
  });
  return toJsonResponse(response, rotatedTokens);
}
