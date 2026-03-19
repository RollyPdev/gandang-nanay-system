import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

type ExtendedPrismaClient = ReturnType<typeof createPrismaClient>;

const globalForPrisma = globalThis as unknown as {
  prisma: ExtendedPrismaClient | undefined;
};

function createPrismaClient() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error("DATABASE_URL is not set.");
  }

  if (url.startsWith("prisma+postgres://") || url.startsWith("prisma://")) {
    return new PrismaClient({
      accelerateUrl: url,
    });
  }

  if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
    return new PrismaClient({
      adapter: new PrismaPg({ connectionString: url }),
    });
  }

  throw new Error(
    "Unsupported DATABASE_URL scheme. Use prisma://, prisma+postgres://, postgres://, or postgresql://."
  );
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
