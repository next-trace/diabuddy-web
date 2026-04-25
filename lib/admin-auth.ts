import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE } from './server-auth';

function decodeBase64Url(value: string): string | null {
  try {
    const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
    const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4));
    return Buffer.from(`${base64}${padding}`, 'base64').toString('utf8');
  } catch {
    return null;
  }
}

export function readRoleFromAccessToken(req: NextRequest): string {
  const token = req.cookies.get(ACCESS_COOKIE)?.value || '';
  if (!token) return '';

  const [, payload] = token.split('.');
  if (!payload) return '';

  const decoded = decodeBase64Url(payload);
  if (!decoded) return '';

  try {
    const parsed = JSON.parse(decoded) as Record<string, unknown>;
    // Accept the new nexdoz.local custom-claim URI plus the legacy diabuddy.local
    // one until every issued token has rotated.
    const roleValue =
      parsed.role ||
      parsed['https://nexdoz.local/role'] ||
      parsed['https://diabuddy.local/role'] ||
      parsed.user_role;
    return typeof roleValue === 'string' ? roleValue.toLowerCase() : '';
  } catch {
    return '';
  }
}

export function requireAdminApi(req: NextRequest): NextResponse | null {
  const role = readRoleFromAccessToken(req);
  if (!role) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (role !== 'admin' && role !== 'owner' && role !== 'superadmin') {
    return NextResponse.json({ error: 'forbidden' }, { status: 403 });
  }

  return null;
}
