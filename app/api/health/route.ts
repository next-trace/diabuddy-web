// App Platform health probe. Fast, dep-free 200 OK.
// DO NOT call the BE here — App Platform polls every 10s and the BE has
// its own /healthz. Keep this purely about the FE container being alive.
export const dynamic = 'force-static';

export function GET() {
  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store' },
  });
}
