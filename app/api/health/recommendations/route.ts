import { NextRequest, NextResponse } from 'next/server';
import { authedBackendFetch, toJsonResponse } from '../../../../lib/server-auth';

export async function GET(req: NextRequest): Promise<NextResponse> {
  const { response, rotatedTokens } = await authedBackendFetch(req, '/health/recommendations', { method: 'GET' });
  return toJsonResponse(response, rotatedTokens);
}
