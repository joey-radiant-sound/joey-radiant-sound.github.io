<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:dependency-policy -->
# Dependency policy — get approval before installing

Before running `npm install <pkg>` for any NEW dependency (not already in `package.json`), surface a short audit block and wait for Joey's approval:

```
Proposing to add:
- name: <package>
- version: <pin>
- publisher: <npm maintainer/team>
- repo: <github URL>
- weekly downloads: <from npmjs.com>
- what it does + why we need it: <one line>
- transitive deps worth flagging: <only if unusual>
```

Rules:
- Version bumps of already-trusted packages (already in `package.json`) don't need re-approval.
- `npx` commands must always run from the project root so they use the locally-pinned binary. If `npx` ever prompts "Need to install the following packages", that means it found nothing locally and is fetching latest from the registry — STOP and confirm with Joey before proceeding.
- Prefer first-party packages from established orgs (Prisma, NextAuth, Vercel, Nodemailer) over micro-libraries.
- Run `npm audit` after any install and surface non-zero results.
<!-- END:dependency-policy -->
