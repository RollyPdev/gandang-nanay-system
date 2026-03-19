import { PrismaClient } from "@/generated/prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

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

export function getPrisma() {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }

  return globalForPrisma.prisma;
}

export const prisma = new Proxy({} as ExtendedPrismaClient, {
  get(_target, property, receiver) {
    return Reflect.get(getPrisma(), property, receiver);
  },
});
