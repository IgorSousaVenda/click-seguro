/*
  Warnings:

  - You are about to drop the `assessment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `assessment_answer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `audit_log` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `badge` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lesson` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lesson_progress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `module` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `option` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `phishing_scenario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `question` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_badge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "assessment";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "assessment_answer";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "audit_log";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "badge";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "lesson";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "lesson_progress";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "module";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "option";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "phishing_scenario";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "question";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "user_badge";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "modulo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "cor" TEXT NOT NULL DEFAULT 'brand'
);

-- CreateTable
CREATE TABLE "licao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "titulo" TEXT NOT NULL,
    "conteudo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "duracaoEstimada" INTEGER NOT NULL DEFAULT 3,
    "pontos" INTEGER NOT NULL DEFAULT 10,
    "moduloId" TEXT NOT NULL,
    CONSTRAINT "licao_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulo" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pergunta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enunciado" TEXT NOT NULL,
    "explicacao" TEXT NOT NULL,
    "dificuldade" TEXT NOT NULL DEFAULT 'MEDIA',
    "ordem" INTEGER NOT NULL,
    "moduloId" TEXT,
    CONSTRAINT "pergunta_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "opcao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "texto" TEXT NOT NULL,
    "correta" BOOLEAN NOT NULL DEFAULT false,
    "ordem" INTEGER NOT NULL,
    "perguntaId" TEXT NOT NULL,
    CONSTRAINT "opcao_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "pergunta" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "cenario_phishing" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "canal" TEXT NOT NULL,
    "remetente" TEXT NOT NULL,
    "assunto" TEXT,
    "corpo" TEXT NOT NULL,
    "ehPhishing" BOOLEAN NOT NULL,
    "indicadores" TEXT NOT NULL,
    "explicacao" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "moduloId" TEXT,
    CONSTRAINT "cenario_phishing_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulo" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "avaliacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tipo" TEXT NOT NULL,
    "pontuacao" INTEGER,
    "total" INTEGER,
    "iniciadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "concluidaEm" DATETIME,
    "userId" TEXT NOT NULL,
    CONSTRAINT "avaliacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "resposta_avaliacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "correta" BOOLEAN NOT NULL,
    "tempoResposta" INTEGER,
    "avaliacaoId" TEXT NOT NULL,
    "perguntaId" TEXT NOT NULL,
    "opcaoId" TEXT,
    CONSTRAINT "resposta_avaliacao_avaliacaoId_fkey" FOREIGN KEY ("avaliacaoId") REFERENCES "avaliacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "resposta_avaliacao_perguntaId_fkey" FOREIGN KEY ("perguntaId") REFERENCES "pergunta" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "resposta_avaliacao_opcaoId_fkey" FOREIGN KEY ("opcaoId") REFERENCES "opcao" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "progresso_licao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pontos" INTEGER NOT NULL DEFAULT 0,
    "concluidaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "licaoId" TEXT NOT NULL,
    CONSTRAINT "progresso_licao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "progresso_licao_licaoId_fkey" FOREIGN KEY ("licaoId") REFERENCES "licao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "medalha" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codigo" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "icone" TEXT NOT NULL,
    "criterio" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "medalha_utilizador" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "obtidaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "medalhaId" TEXT NOT NULL,
    CONSTRAINT "medalha_utilizador_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "medalha_utilizador_medalhaId_fkey" FOREIGN KEY ("medalhaId") REFERENCES "medalha" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "registo_auditoria" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "evento" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT,
    CONSTRAINT "registo_auditoria_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "modulo_slug_key" ON "modulo"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "licao_moduloId_ordem_key" ON "licao"("moduloId", "ordem");

-- CreateIndex
CREATE INDEX "avaliacao_userId_tipo_idx" ON "avaliacao"("userId", "tipo");

-- CreateIndex
CREATE UNIQUE INDEX "resposta_avaliacao_avaliacaoId_perguntaId_key" ON "resposta_avaliacao"("avaliacaoId", "perguntaId");

-- CreateIndex
CREATE UNIQUE INDEX "progresso_licao_userId_licaoId_key" ON "progresso_licao"("userId", "licaoId");

-- CreateIndex
CREATE UNIQUE INDEX "medalha_codigo_key" ON "medalha"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "medalha_utilizador_userId_medalhaId_key" ON "medalha_utilizador"("userId", "medalhaId");

-- CreateIndex
CREATE INDEX "registo_auditoria_userId_criadoEm_idx" ON "registo_auditoria"("userId", "criadoEm");
