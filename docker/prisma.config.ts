// Configuração usada apenas dentro do contentor, pelo passo de migração.
// Não carrega ficheiros .env: as variáveis vêm do ambiente do contentor.
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});
