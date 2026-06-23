import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const caseInsensitive = () => {
  const isSqlite = process.env.DATABASE_URL?.startsWith("file:") || process.env.DATABASE_URL?.includes("dev.db");
  return isSqlite ? {} : { mode: "insensitive" as any };
};
