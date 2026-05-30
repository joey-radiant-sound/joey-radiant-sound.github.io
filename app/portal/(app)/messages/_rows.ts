import type { MessageRow } from "./MessageThread";

type DbMessage = {
  id: string;
  body: string;
  createdAt: Date;
  authorId: string | null;
  author: {
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: string;
  } | null;
};

/** Prisma include for a message + its author display fields. */
export const messageAuthorInclude = {
  author: {
    select: { firstName: true, lastName: true, email: true, role: true },
  },
} as const;

/** Map DB messages to the client MessageThread shape. */
export function toMessageRows(
  messages: DbMessage[],
  currentUserId: string,
): MessageRow[] {
  return messages.map((m) => {
    const name = m.author
      ? m.author.role === "ADMIN"
        ? "Radiant Sound"
        : [m.author.firstName, m.author.lastName].filter(Boolean).join(" ") ||
          m.author.email
      : null;
    return {
      id: m.id,
      body: m.body,
      createdAt: m.createdAt.toISOString(),
      authorName: name,
      isMine: m.authorId === currentUserId,
    };
  });
}
