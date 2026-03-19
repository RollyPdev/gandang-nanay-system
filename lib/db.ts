import { PrismaClient } from "@/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as { prisma: ReturnType<typeof createPrismaClient> };

function createPrismaClient() {
  const url = process.env.DATABASE_URL;
  if (!url?.startsWith("prisma+postgres://") && !url?.startsWith("prisma://")) {
    throw new Error(
      "DATABASE_URL must be a Prisma Accelerate URL (prisma+postgres:// or prisma://). " +
        "Get yours at https://console.prisma.io/"
    );
  }
  return new PrismaClient({
    accelerateUrl: url,
  }).$extends(withAccelerate());
}

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
