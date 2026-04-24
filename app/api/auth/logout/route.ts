import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { clearAuthCookies, verifyCsrf } from '../../../../lib/server-auth';

function okResponse(): NextResponse {
  const res = NextResponse.json({ ok: true }, { status: 200 });
  clearAuthCookies(res);
  return res;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  if (!verifyCsrf(req)) {
    return NextResponse.json({ error: 'invalid csrf token' }, { status: 403 });
  }

  return okResponse();
}

// Fallback for sessions where CSRF cookie/header is unavailable in client runtime.
export async function GET(): Promise<NextResponse> {
  return okResponse();
}
