// Dev seed — resets the portal to a known test state.
//
// Plain .mjs using the generated Prisma client (no tsx/ts-node needed).
// Run via `npm run db:seed`, which loads .env.local first so
// DATABASE_URL is set (see scripts/seed.sh).
//
// What it does:
//   1. Deletes all projects (cascades to planning rows, files, members)
//   2. Upserts an admin user (role ADMIN)
//   3. Upserts a test couple user (role COUPLE)
//   4. Creates one project with the couple linked as OWNER
//
// Admin/couple sign-in sessions survive, so you stay logged in. Use
// /portal/dev (when ENABLE_DEV_LOGIN=true) to switch between them.

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ADMIN_EMAIL = (process.env.ADMIN_EMAILS ?? "joey@radiantsoundwny.com")
  .split(",")[0]
  .trim()
  .toLowerCase();
const COUPLE_EMAIL = "testcouple@example.com";

async function main() {
  // 1. Clear projects (cascade clears planning + files + members).
  await prisma.project.deleteMany({});

  // 2. Admin.
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    create: {
      email: ADMIN_EMAIL,
      firstName: "Joey",
      lastName: "Cassata",
      name: "Joey Cassata",
      role: "ADMIN",
    },
    update: { role: "ADMIN" },
  });

  // 3. Test couple.
  const couple = await prisma.user.upsert({
    where: { email: COUPLE_EMAIL },
    create: {
      email: COUPLE_EMAIL,
      firstName: "Alex",
      lastName: "Rivera",
      name: "Alex Rivera",
      role: "COUPLE",
    },
    update: { role: "COUPLE" },
  });

  // 4. One project, couple linked as OWNER.
  const project = await prisma.project.create({
    data: {
      title: "Alex & Sam — Test Wedding",
      status: "PLANNING",
      eventDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000), // ~4 months out
      venueName: "The Foundry",
      venueCity: "Buffalo, NY",
      guestCount: 140,
      invitedById: admin.id,
      members: {
        create: { userId: couple.id, role: "OWNER" },
      },
    },
  });

  console.log("Seed complete:");
  console.log(`  admin:   ${admin.email} (ADMIN)`);
  console.log(`  couple:  ${couple.email} (COUPLE)`);
  console.log(`  project: "${project.title}" [${project.id}]`);
  console.log("");
  console.log("Sign in fast at /portal/dev (ENABLE_DEV_LOGIN=true).");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
