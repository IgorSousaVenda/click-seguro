-- CreateTable
CREATE TABLE "simulacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "canal" TEXT NOT NULL,
    "remetente" TEXT NOT NULL,
    "contexto" TEXT NOT NULL,
    "ehFraude" BOOLEAN NOT NULL,
    "licao" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "moduloMinimo" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "no_simulacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chave" TEXT NOT NULL,
    "mensagens" TEXT NOT NULL,
    "desfecho" TEXT,
    "desenlace" TEXT,
    "simulacaoId" TEXT NOT NULL,
    CONSTRAINT "no_simulacao_simulacaoId_fkey" FOREIGN KEY ("simulacaoId") REFERENCES "simulacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "escolha_simulacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "texto" TEXT NOT NULL,
    "proximo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "noId" TEXT NOT NULL,
    CONSTRAINT "escolha_simulacao_noId_fkey" FOREIGN KEY ("noId") REFERENCES "no_simulacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tentativa_simulacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "desfecho" TEXT NOT NULL,
    "caminho" TEXT NOT NULL,
    "realizadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "simulacaoId" TEXT NOT NULL,
    CONSTRAINT "tentativa_simulacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tentativa_simulacao_simulacaoId_fkey" FOREIGN KEY ("simulacaoId") REFERENCES "simulacao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "simulacao_slug_key" ON "simulacao"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "no_simulacao_simulacaoId_chave_key" ON "no_simulacao"("simulacaoId", "chave");

-- CreateIndex
CREATE INDEX "tentativa_simulacao_userId_simulacaoId_idx" ON "tentativa_simulacao"("userId", "simulacaoId");
