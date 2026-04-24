import { NextRequest, NextResponse } from 'next/server';
import { REFRESH_COOKIE, backendFetch, clearAuthCookies, setAuthCookies } from '../../../../lib/server-auth';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: 'missing refresh token' }, { status: 401 });
  }

  const apiResponse = await backendFetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!apiResponse.ok) {
    const res = NextResponse.json({ error: 'refresh failed' }, { status: 401 });
    clearAuthCookies(res);
    return res;
  }

  const body = await apiResponse.json();
  const res = NextResponse.json({ ok: true }, { status: 200 });
  setAuthCookies(res, {
    access_token: body.access_token,
    refresh_token: body.refresh_token
  });
  return res;
}
