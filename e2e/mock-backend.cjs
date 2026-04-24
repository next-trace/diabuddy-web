const http = require('http');

const host = '127.0.0.1';
const port = 18080;

function sendJson(res, status, payload) {
  res.writeHead(status, { 'content-type': 'application/json' });
  res.end(JSON.stringify(payload));
}

function getBearerToken(req) {
  const value = req.headers.authorization || '';
  const [kind, token] = value.split(' ');
  if (kind !== 'Bearer' || !token) {
    return '';
  }
  return token;
}

function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${host}:${port}`);

  if (url.pathname === '/healthz' && req.method === 'GET') {
    return sendJson(res, 200, { ok: true });
  }

  if (url.pathname === '/auth/login' && req.method === 'POST') {
    return sendJson(res, 200, {
      access_token: 'access-1',
      refresh_token: 'refresh-1',
      token_type: 'Bearer',
      expires_in: 900,
      user_id: '11111111-1111-1111-1111-111111111111'
    });
  }

  if (url.pathname === '/auth/refresh' && req.method === 'POST') {
    const body = await parseBody(req);
    if (body.refresh_token !== 'refresh-1' && body.refresh_token !== 'refresh-2') {
      return sendJson(res, 401, { error: 'invalid token', details: 'refresh token is invalid' });
    }

    return sendJson(res, 200, {
      access_token: 'access-2',
      refresh_token: 'refresh-2',
      token_type: 'Bearer',
      expires_in: 900,
      user_id: '11111111-1111-1111-1111-111111111111'
    });
  }

  if (url.pathname === '/auth/me' && req.method === 'GET') {
    const token = getBearerToken(req);
    if (!token) {
      return sendJson(res, 401, { error: 'unauthorized', details: 'missing token' });
    }

    return sendJson(res, 200, {
      id: '11111111-1111-1111-1111-111111111111',
      email: 'mock@example.com',
      phone_number: '+491778902806',
      status: 'active',
      created_at: '2026-04-19T00:00:00Z',
      updated_at: '2026-04-19T00:00:00Z',
      deleted_at: null
    });
  }

  if (url.pathname.startsWith('/users/') && req.method === 'GET') {
    const token = getBearerToken(req);
    if (token === 'access-1') {
      return sendJson(res, 401, { error: 'invalid token', details: 'expired access token' });
    }

    if (token !== 'access-2') {
      return sendJson(res, 401, { error: 'invalid token', details: 'missing or invalid token' });
    }

    const id = url.pathname.split('/')[2] || 'unknown';
    return sendJson(res, 200, {
      id,
      email: 'rotated@example.com',
      phone_number: '+491778902806',
      status: 'active',
      created_at: '2026-04-19T00:00:00Z',
      updated_at: '2026-04-19T00:00:00Z',
      deleted_at: null
    });
  }

  if (url.pathname === '/users' && req.method === 'POST') {
    return sendJson(res, 201, {
      id: '22222222-2222-2222-2222-222222222222',
      email: 'created@example.com',
      phone_number: '+491778902806',
      status: 'pending',
      created_at: '2026-04-19T00:00:00Z',
      profile: {
        id: '33333333-3333-3333-3333-333333333333',
        first_name: 'John',
        last_name: 'Doe',
        gender: 'male',
        relationship_status: 'single',
        birth_date: '1996-01-01T00:00:00Z'
      }
    });
  }

  sendJson(res, 404, { error: 'not found', details: 'mock route not implemented' });
});

server.listen(port, host, () => {
  process.stdout.write(`[mock-backend] listening on http://${host}:${port}\n`);
});

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
