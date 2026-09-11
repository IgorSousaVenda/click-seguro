import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Os scripts de sementeira apontam para a mesma base que a aplicação.
// Em produção isso é o volume montado no contentor.
const url = process.env.DATABASE_URL ?? "file:./dev.db";

export const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url }) });
