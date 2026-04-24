import { NextRequest, NextResponse } from 'next/server';
import { authedBackendFetch, toJsonResponse, verifyCsrf } from '../../../../lib/server-auth';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { response, rotatedTokens } = await authedBackendFetch(req, '/health/action-plans', { method: 'GET' });
  return toJsonResponse(response, rotatedTokens);
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'invalid csrf token' }, { status: 403 });
  }

  const payload = await req.json();
  const { response, rotatedTokens } = await authedBackendFetch(req, '/health/action-plans', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return toJsonResponse(response, rotatedTokens);
}
