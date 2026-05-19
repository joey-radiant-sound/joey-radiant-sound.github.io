import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db";

/**
 * Auth.js v5 configuration. Magic-link email sign-in only — no
 * passwords, no public OAuth.
 *
 * Normally reuses the SMTP env vars from Phase 1F's contact-form
 * transport (SMTP_HOST/PORT/USER/PASSWORD). Sender uses
 * CONTACT_FORM_FROM as fallback to keep one env surface.
 *
 * Dev fallback: when SMTP_HOST is unset, we install a fake nodemailer
 * `jsonTransport` and override sendVerificationRequest to log the
 * magic link straight to the server console. This lets you test the
 * full sign-in round-trip locally before configuring real SMTP.
 *
 * Invite-only model: Phase 2B adds an allowlist check to reject
 * unknown emails so only Joey-invited couples can sign in.
 */

const useDevMailFallback = !process.env.SMTP_HOST;

const emailProvider = Nodemailer({
  server: useDevMailFallback
    ? // jsonTransport is a real nodemailer mode that stringifies the
      // message instead of opening a socket — we override the send
      // path below so this transport is never actually invoked,
      // but Auth.js needs *something* it can hand to nodemailer.
      ({ jsonTransport: true } as unknown as string)
    : {
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
    process.env.SMTP_USER ??
    "dev@localhost",
  ...(useDevMailFallback
    ? {
        sendVerificationRequest: async ({
          identifier,
          url,
        }: {
          identifier: string;
          url: string;
        }) => {
          const bar = "═".repeat(70);
          console.log(
            `\n${bar}\n🔗 DEV MAGIC LINK  (SMTP_HOST not set — email not actually sent)\n   to:  ${identifier}\n   url: ${url}\n${bar}\n`,
          );
        },
      }
    : {}),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  pages: {
    signIn: "/portal/sign-in",
    verifyRequest: "/portal/check-email",
    error: "/portal/sign-in",
  },
  providers: [emailProvider],
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
