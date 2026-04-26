# DigitalOcean App Platform deployment

Mirror of `nexdoz-user-api/.do/`. See that README for the full setup walk-through.

## First-time setup

```bash
# After nexdoz-user-api app exists and api.nexdoz.com resolves,
doctl apps create --spec .do/app.yaml

# Capture the app ID
doctl apps list

# Set secrets
doctl apps update <APP_ID> --set-env CSRF_SECRET=<openssl rand -hex 32>
doctl apps update <APP_ID> --set-env SESSION_COOKIE_SECRET=<openssl rand -hex 32>
doctl apps update <APP_ID> --set-env BETTERSTACK_TOKEN=<value>
```

## Required GitHub secrets

| Secret                       | Notes                                                |
| ---------------------------- | ---------------------------------------------------- |
| `DIGITALOCEAN_ACCESS_TOKEN`  | Same token works for both apps                       |
| `DIGITALOCEAN_APP_ID`        | The nexdoz-web app ID (different from nexdoz-user-api) |

## Health probe

`GET /api/health` returns `{ status: "ok" }` 200 — purely about FE container liveness, does NOT call BE.

## Cloudflare-side: nexdoz.com → app.nexdoz.com redirect

In Cloudflare zone `nexdoz.com`, add a Page Rule or Redirect Rule:
- **If**: hostname equals `nexdoz.com`
- **Then**: 301 redirect to `https://app.nexdoz.com$1` (preserve path)
