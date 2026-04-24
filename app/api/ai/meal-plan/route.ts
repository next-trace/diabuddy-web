import { NextRequest, NextResponse } from 'next/server';
import { authedBackendFetch, toJsonResponse, verifyCsrf } from '../../../../lib/server-auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'forbidden', details: 'missing or invalid csrf token' }, { status: 403 });
  }

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const { response, rotatedTokens } = await authedBackendFetch(req, '/ai/meal-plan', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      style: String(body.style || 'balanced'),
      plan_tier: String(body.plan_tier || '').trim(),
      events: Array.isArray(body.events) ? body.events : []
    })
  });
  return toJsonResponse(response, rotatedTokens);
}
