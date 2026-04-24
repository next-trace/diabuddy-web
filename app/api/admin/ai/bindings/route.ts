import { NextRequest, NextResponse } from 'next/server';
import { requireAdminApi } from '../../../../../lib/admin-auth';
import { authedBackendFetch, toJsonResponse, verifyCsrf } from '../../../../../lib/server-auth';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const blocked = requireAdminApi(req);
  if (blocked) return blocked;
  const { response, rotatedTokens } = await authedBackendFetch(req, '/admin/ai/bindings', { method: 'GET' });
  return toJsonResponse(response, rotatedTokens);
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  const blocked = requireAdminApi(req);
  if (blocked) return blocked;
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'forbidden', details: 'missing or invalid csrf token' }, { status: 403 });
  }
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const { response, rotatedTokens } = await authedBackendFetch(req, '/admin/ai/bindings', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: Array.isArray(body.items) ? body.items : [] })
  });
  return toJsonResponse(response, rotatedTokens);
}
