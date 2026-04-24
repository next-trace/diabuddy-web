import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, toJsonResponse, verifyCsrf } from '../../../lib/server-auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'invalid csrf token' }, { status: 403 });
  }

  const payload = await req.json();
  const apiResponse = await backendFetch('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  return toJsonResponse(apiResponse, null);
}
