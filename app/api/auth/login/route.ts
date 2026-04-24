import { NextRequest, NextResponse } from 'next/server';
import { backendFetch, setAuthCookies, toJsonResponse } from '../../../../lib/server-auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const payload = await req.json();

  const apiResponse = await backendFetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!apiResponse.ok) {
    return toJsonResponse(apiResponse, null);
  }

  const authBody = await apiResponse.json();
  const res = NextResponse.json({ ok: true }, { status: 200 });
  setAuthCookies(res, {
    access_token: authBody.access_token,
    refresh_token: authBody.refresh_token
  });

  return res;
}
