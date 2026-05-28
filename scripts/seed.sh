#!/usr/bin/env bash
# Run the dev seed (prisma/seed.mjs) with .env.local loaded so
# DATABASE_URL reaches the Prisma client. Same env-loading approach as
# scripts/db.sh — we read KEY=VALUE lines literally rather than
# `source`ing, so values with spaces / shell metacharacters are safe.
#
# Usage:  npm run db:seed   (or: bash scripts/seed.sh)

set -euo pipefail

load_env() {
  local file="$1"
  [ -f "$file" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      ''|'#'*) continue ;;
    esac
    case "$line" in
      *=*)
        local key="${line%%=*}"
        local val="${line#*=}"
        val="${val%\"}"; val="${val#\"}"
        val="${val%\'}"; val="${val#\'}"
        export "$key=$val"
        ;;
    esac
  done < "$file"
}

load_env .env.local
load_env .env

exec node prisma/seed.mjs
