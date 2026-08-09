import path from "node:path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const criarPrisma = () => {
  const adapter = new PrismaLibSql({
    url: `file:${path.join(process.cwd(), "dev.db")}`,
  });
  return new PrismaClient({ adapter });
};

const globalParaPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof criarPrisma> | undefined;
};

export const prisma = globalParaPrisma.prisma ?? criarPrisma();

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}
