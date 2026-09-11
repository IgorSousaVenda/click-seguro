import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// A base de dados vive onde a variável de ambiente disser. Em produção isso
// é um volume montado no contentor; localmente é o ficheiro na raiz.
const url = process.env.DATABASE_URL ?? "file:./dev.db";

const criarPrisma = () => new PrismaClient({ adapter: new PrismaLibSql({ url }) });

const globalParaPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof criarPrisma> | undefined;
};

export const prisma = globalParaPrisma.prisma ?? criarPrisma();

if (process.env.NODE_ENV !== "production") {
  globalParaPrisma.prisma = prisma;
}
