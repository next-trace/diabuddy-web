# @next-trace/nexdoz-web

Nexdoz web app — Next.js 15 App Router, React 18.3. Thin client; all business logic lives in the BE (`next-trace/nexdoz-user-api`).

## Development

```bash
pnpm install
pnpm dev
```

## E2E tests

```bash
pnpm test           # headless
pnpm test:e2e:ui    # Playwright UI mode
```

## Dependencies

- `@next-trace/nexdoz-design-system` — brand tokens, logos, React primitives. Installed via GitHub tag (`github:next-trace/nexdoz-design-system#vX.Y.Z`).
- `src/api-client/` — vendored copy of the user-api TS client. Will be regenerated from `next-trace/nexdoz-user-api`'s OpenAPI once a stable profile surface lands; tracked in a follow-up plan.
