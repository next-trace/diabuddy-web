import { NextRequest, NextResponse } from 'next/server';
import { authedBackendFetch, toJsonResponse, verifyCsrf } from '../../../../../lib/server-auth';

type Params = { params: Promise<{ id: string }> };

export async function DELETE(req: NextRequest, { params }: Params): Promise<NextResponse> {
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'invalid csrf token' }, { status: 403 });
  }

  const { id } = await params;
  const { response, rotatedTokens } = await authedBackendFetch(req, `/users/${id}/hard`, { method: 'DELETE' });
  return toJsonResponse(response, rotatedTokens);
}
