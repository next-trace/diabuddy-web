import { NextRequest, NextResponse } from 'next/server';
import { authedBackendFetch, toJsonResponse } from '../../../../lib/server-auth';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const query = req.nextUrl.search;
  const path = `/health/dashboard-view${query}`;
  const { response, rotatedTokens } = await authedBackendFetch(req, path, { method: 'GET' });
  return toJsonResponse(response, rotatedTokens);
}
