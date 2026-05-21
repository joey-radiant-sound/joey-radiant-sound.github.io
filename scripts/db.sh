#!/usr/bin/env bash
# Wrapper for `prisma` commands that loads .env.local before running.
#
# Why: Next.js reads .env.local for the dev server, but the Prisma
# CLI only reads .env. Without this wrapper, DATABASE_URL set in
# .env.local won't reach `prisma db push` and you'll silently push
# to the wrong file (or fail).
#
# We deliberately do NOT `source` the env files — a value containing
# shell metacharacters (spaces, `<`, `>`, `$`, backticks — e.g. an
# email "Display Name <addr>" or a password) would be misparsed.
# Instead we read line by line and `export` each KEY=VALUE as a
# single literal word, which bash assigns verbatim.
#
# Usage (note the `--` is REQUIRED for npm to forward extra args):
#   npm run db -- push
#   npm run db:push        # convenience alias
#
# Or call directly:  bash scripts/db.sh db push

set -euo pipefail

load_env() {
  local file="$1"
  [ -f "$file" ] || return 0
  while IFS= read -r line || [ -n "$line" ]; do
    # Skip blanks and comments.
    case "$line" in
      ''|'#'*) continue ;;
    esac
    # Only handle KEY=VALUE lines.
    case "$line" in
      *=*)
        # Strip one layer of surrounding quotes from the value so the
        # exported value matches what dotenv parsers (Next.js) yield.
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

if [ "$#" -eq 0 ]; then
  echo "Usage: bash scripts/db.sh <prisma-subcommand> [args...]"
  echo "Example: bash scripts/db.sh db push"
  exit 1
fi

exec npx prisma "$@"
