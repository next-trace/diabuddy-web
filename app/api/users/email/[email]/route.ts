import { NextRequest, NextResponse } from 'next/server';
import { authedBackendFetch, toJsonResponse } from '../../../../../lib/server-auth';

type Params = { params: Promise<{ email: string }> };

export async function GET(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { email } = await params;
  const { response, rotatedTokens } = await authedBackendFetch(req, `/users/email/${encodeURIComponent(email)}`, { method: 'GET' });
  return toJsonResponse(response, rotatedTokens);
}
