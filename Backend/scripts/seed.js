import dotenv from "dotenv";
dotenv.config();
import prisma from "../src/config/prisma.js";
import { hash } from "../src/utils/hash.js";

async function main() {
  // admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@site.com" },
    update: {},
    create: {
      name: "Administrator Account Name..", // >= 20 chars
      email: "admin@site.com",
      address: "HQ",
      passwordHash: await hash("Admin@123"),
      role: "ADMIN",
    },
  });

  // store owner
  const owner = await prisma.user.upsert({
    where: { email: "owner@site.com" },
    update: {},
    create: {
      name: "Primary Store Owner Name..", // >= 20 chars
      email: "owner@site.com",
      address: "Owner Address",
      passwordHash: await hash("Owner@123"),
      role: "STORE_OWNER",
    },
  });

  // normal user
  const user = await prisma.user.upsert({
    where: { email: "user@site.com" },
    update: {},
    create: {
      name: "Regular Normal User Name", // >= 20 chars
      email: "user@site.com",
      address: "User Address",
      passwordHash: await hash("User@123"),
      role: "NORMAL_USER",
    },
  });

  // store
  await prisma.store.create({
    data: { name: "Coffee Corner", address: "Downtown", ownerId: owner.id },
  });

  console.log("Seeded:", {
    admin: admin.email,
    owner: owner.email,
    user: user.email,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
