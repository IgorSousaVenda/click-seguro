-- CreateTable
CREATE TABLE "tentativa_quiz" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "pontuacao" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "aprovada" BOOLEAN NOT NULL,
    "realizadaEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "licaoId" TEXT NOT NULL,
    CONSTRAINT "tentativa_quiz_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "tentativa_quiz_licaoId_fkey" FOREIGN KEY ("licaoId") REFERENCES "licao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pergunta" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "enunciado" TEXT NOT NULL,
    "explicacao" TEXT NOT NULL,
    "dificuldade" TEXT NOT NULL DEFAULT 'MEDIA',
    "ordem" INTEGER NOT NULL,
    "moduloId" TEXT,
    "licaoId" TEXT,
    CONSTRAINT "pergunta_moduloId_fkey" FOREIGN KEY ("moduloId") REFERENCES "modulo" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pergunta_licaoId_fkey" FOREIGN KEY ("licaoId") REFERENCES "licao" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_pergunta" ("dificuldade", "enunciado", "explicacao", "id", "moduloId", "ordem") SELECT "dificuldade", "enunciado", "explicacao", "id", "moduloId", "ordem" FROM "pergunta";
DROP TABLE "pergunta";
ALTER TABLE "new_pergunta" RENAME TO "pergunta";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "tentativa_quiz_userId_licaoId_idx" ON "tentativa_quiz"("userId", "licaoId");
