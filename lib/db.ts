import { PrismaClient } from "@prisma/client";

/**
 * Prisma client singleton. Next.js dev HMR will otherwise spawn a new
 * client on every reload and exhaust the database's connection pool.
 *
 * In production each Lambda/Edge invocation gets its own instance,
 * which is fine.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
