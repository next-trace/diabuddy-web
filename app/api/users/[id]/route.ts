import { NextRequest, NextResponse } from 'next/server';
import { authedBackendFetch, toJsonResponse, verifyCsrf } from '../../../../lib/server-auth';

type Params = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { id } = await params;
  const { response, rotatedTokens } = await authedBackendFetch(req, `/users/${id}`, { method: 'GET' });
  return toJsonResponse(response, rotatedTokens);
}

export async function PUT(req: NextRequest, { params }: Params): Promise<NextResponse> {
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'invalid csrf token' }, { status: 403 });
  }

  const { id } = await params;
  const payload = await req.json();
  const { response, rotatedTokens } = await authedBackendFetch(req, `/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return toJsonResponse(response, rotatedTokens);
}

export async function DELETE(req: NextRequest, { params }: Params): Promise<NextResponse> {
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'invalid csrf token' }, { status: 403 });
  }

  const { id } = await params;
  const { response, rotatedTokens } = await authedBackendFetch(req, `/users/${id}`, { method: 'DELETE' });
  return toJsonResponse(response, rotatedTokens);
}
