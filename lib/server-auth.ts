import { NextRequest, NextResponse } from 'next/server';

export const ACCESS_COOKIE = 'db_access_token';
export const REFRESH_COOKIE = 'db_refresh_token';
export const SESSION_COOKIE = 'db_session';
export const CSRF_COOKIE = 'db_csrf';

const USER_API_BASE_URL = process.env.USER_API_BASE_URL || process.env.NEXT_PUBLIC_USER_API_BASE_URL || 'http://localhost:8080';

type TokenPair = {
  access_token: string;
  refresh_token: string;
};

function generateCsrfToken(): string {
  return crypto.randomUUID();
}

function secureCookie(): boolean {
  return process.env.NODE_ENV === 'production';
}

export function setAuthCookies(res: NextResponse, tokens: TokenPair): void {
  const common = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: secureCookie(),
    path: '/'
  };

  res.cookies.set(ACCESS_COOKIE, tokens.access_token, { ...common, maxAge: 60 * 15 });
  res.cookies.set(REFRESH_COOKIE, tokens.refresh_token, { ...common, maxAge: 60 * 60 * 24 * 7 });
  res.cookies.set(SESSION_COOKIE, '1', { ...common, maxAge: 60 * 60 * 24 * 7 });

  // Must be readable by browser JS to be echoed in X-CSRF-Token header.
  res.cookies.set(CSRF_COOKIE, generateCsrfToken(), {
    httpOnly: false,
    sameSite: 'lax',
    secure: secureCookie(),
    path: '/',
    maxAge: 60 * 60 * 24 * 7
  });
}

export function clearAuthCookies(res: NextResponse): void {
  const common = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: secureCookie(),
    path: '/'
  };

  res.cookies.set(ACCESS_COOKIE, '', { ...common, maxAge: 0 });
  res.cookies.set(REFRESH_COOKIE, '', { ...common, maxAge: 0 });
  res.cookies.set(SESSION_COOKIE, '', { ...common, maxAge: 0 });
  res.cookies.set(CSRF_COOKIE, '', {
    httpOnly: false,
    sameSite: 'lax',
    secure: secureCookie(),
    path: '/',
    maxAge: 0
  });
}

export async function backendFetch(path: string, init?: RequestInit): Promise<Response> {
  return fetch(`${USER_API_BASE_URL}${path}`, init);
}

async function refreshWithToken(refreshToken: string): Promise<TokenPair | null> {
  const res = await backendFetch('/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken })
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as TokenPair;
}

export async function authedBackendFetch(
  req: NextRequest,
  path: string,
  init?: RequestInit
): Promise<{ response: Response; rotatedTokens: TokenPair | null }> {
  const accessToken = req.cookies.get(ACCESS_COOKIE)?.value;
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;

  const firstHeaders = new Headers(init?.headers);
  if (accessToken) {
    firstHeaders.set('Authorization', `Bearer ${accessToken}`);
  }

  let response = await backendFetch(path, { ...init, headers: firstHeaders });
  if (response.status !== 401) {
    return { response, rotatedTokens: null };
  }

  if (!refreshToken) {
    return { response, rotatedTokens: null };
  }

  const rotatedTokens = await refreshWithToken(refreshToken);
  if (!rotatedTokens) {
    return { response, rotatedTokens: null };
  }

  const retryHeaders = new Headers(init?.headers);
  retryHeaders.set('Authorization', `Bearer ${rotatedTokens.access_token}`);
  response = await backendFetch(path, { ...init, headers: retryHeaders });

  return { response, rotatedTokens };
}

export async function toJsonResponse(apiResponse: Response, rotatedTokens: TokenPair | null): Promise<NextResponse> {
  const contentType = apiResponse.headers.get('content-type') || '';

  if (apiResponse.status === 204) {
    const res = new NextResponse(null, { status: 204 });
    if (rotatedTokens) {
      setAuthCookies(res, rotatedTokens);
    }
    return res;
  }

  const body = contentType.includes('application/json') ? await apiResponse.json() : await apiResponse.text();
  const res = NextResponse.json(body, { status: apiResponse.status });

  if (rotatedTokens) {
    setAuthCookies(res, rotatedTokens);
  }

  return res;
}

export function verifyCsrf(req: NextRequest): boolean {
  const cookieToken = req.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = req.headers.get('x-csrf-token');

  if (!cookieToken || !headerToken) {
    return false;
  }

  return cookieToken === headerToken;
}
