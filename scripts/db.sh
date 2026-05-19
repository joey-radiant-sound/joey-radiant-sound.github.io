#!/usr/bin/env bash
# Wrapper for `prisma` commands that loads .env.local before running.
#
# Why: Next.js reads .env.local for the dev server, but the Prisma
# CLI only reads .env. Without this wrapper, DATABASE_URL set in
# .env.local won't reach `prisma db push` and you'll silently push
# to the wrong file (or fail).
#
# Usage:
#   npm run db push
#   npm run db migrate dev
#   npm run db studio
#   npm run db generate

set -euo pipefail

# Export every assignment from .env.local (and .env if present) into
# the environment for the prisma subprocess.
set -a
[ -f .env.local ] && source .env.local
[ -f .env ] && source .env
set +a

exec npx prisma "$@"
