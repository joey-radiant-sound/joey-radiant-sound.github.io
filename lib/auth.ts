import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

/**
 * Auth.js v5 configuration. Magic-link email sign-in only — no
 * passwords, no public OAuth.
 *
 * Reuses the SMTP env vars from Phase 1F's contact-form transport
 * (SMTP_HOST/PORT/USER/PASSWORD). Sender uses CONTACT_FORM_FROM as
 * fallback to keep one env surface.
 *
 * Invite-only model: handlers.GET creates a session for users that
 * already exist in the database. Sign-in attempts from emails NOT in
 * the User table will still send a magic link (Auth.js will create
 * the user) — Phase 2B adds an allowlist check to reject unknown
 * emails so only Joey-invited couples can sign in.
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/portal/sign-in",
    verifyRequest: "/portal/check-email",
    error: "/portal/sign-in",
  },
  providers: [
    Nodemailer({
      server: {
        host: process.env.SMTP_HOST!,
        port: Number(process.env.SMTP_PORT ?? 587),
        auth: {
          user: process.env.SMTP_USER!,
          pass: process.env.SMTP_PASSWORD!,
        },
      },
      from:
        process.env.AUTH_EMAIL_FROM ??
        process.env.CONTACT_FORM_FROM ??
        process.env.SMTP_USER!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      // Surface our extended fields to the client session.
      if (session.user) {
        session.user.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = (user as any).role;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).firstName = (user as any).firstName;
      }
      return session;
    },
  },
});
