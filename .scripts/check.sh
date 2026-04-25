#!/usr/bin/env bash
# Local pre-commit verification for nexdoz-web.
# Mirrors CI: install, typecheck, build.
# Playwright E2E tests are run separately in CI with a mock backend.

set -euo pipefail

cd "$(dirname "$0")/.."

step() {
    printf '\n==> %s\n' "$1"
}

step "pnpm install --frozen-lockfile"
pnpm install --frozen-lockfile

step "pnpm typecheck"
pnpm typecheck

step "pnpm build"
pnpm build

printf '\nAll local checks passed.\n'
