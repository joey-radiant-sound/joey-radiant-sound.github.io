# Multi-stage build for the Next.js app on a self-hosted VPS.
# Uses Next.js standalone output to keep the final image small.

# ---------- Stage 1: deps ----------
FROM node:22-alpine AS deps
WORKDIR /app
# Alpine needs libc6-compat for some Node packages (sharp, etc.)
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* .npmrc ./
COPY prisma ./prisma
# postinstall runs `prisma generate` — needs the schema present.
RUN npm ci

# ---------- Stage 2: build ----------
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/prisma ./prisma
COPY . .
# DATABASE_URL doesn't need to be reachable at build time, but
# `prisma generate` (re-run by `build` script) reads the env. Use a
# placeholder; the real value comes from docker-compose at runtime.
ENV DATABASE_URL="file:./data/radiant.db"
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ---------- Stage 3: runtime ----------
FROM node:22-alpine AS runtime
WORKDIR /app
RUN apk add --no-cache libc6-compat tini && \
    addgroup -S app && adduser -S app -G app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Standalone Next.js output bundles only what's needed to run.
COPY --from=build --chown=app:app /app/.next/standalone ./
COPY --from=build --chown=app:app /app/.next/static ./.next/static
COPY --from=build --chown=app:app /app/public ./public
# Prisma engine binaries + generated client (under node_modules/.prisma).
COPY --from=build --chown=app:app /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build --chown=app:app /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=build --chown=app:app /app/prisma ./prisma

# Mount point for the SQLite db + uploaded files (declared in compose).
RUN mkdir -p /app/data && chown app:app /app/data
VOLUME ["/app/data"]

USER app
EXPOSE 3000
# tini reaps zombie processes and forwards signals cleanly.
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]
