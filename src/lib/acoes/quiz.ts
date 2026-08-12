"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";

const LIMIAR = 0.7;
const POR_TENTATIVA = 4;

export type ResultadoQuiz = {
  pontuacao: number;
  total: number;
  aprovada: boolean;
  correcoes: {
    perguntaId: string;
    correta: boolean;
    explicacao: string;
  }[];
};

function sortear<T>(lista: T[], quantidade: number): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia.slice(0, quantidade);
}

// Sorteia no servidor: o cliente recebe apenas as quatro perguntas
// da tentativa, nunca o banco completo nem o campo "correta".
export async function obterPerguntasDaTentativa(licaoId: string) {
  const todas = await prisma.pergunta.findMany({
    where: { licaoId },
    include: { opcoes: { select: { id: true, texto: true } } },
  });

  return sortear(todas, POR_TENTATIVA).map((p) => ({
    id: p.id,
    enunciado: p.enunciado,
    opcoes: sortear(p.opcoes, p.opcoes.length),
  }));
}

export async function novaTentativa(licaoId: string) {
  const sessao = await obterSessao();
  if (!sessao) throw new Error("Sessão expirada.");
  return obterPerguntasDaTentativa(licaoId);
}

export async function submeterQuiz(
  licaoId: string,
  respostas: { perguntaId: string; opcaoId: string }[],
): Promise<ResultadoQuiz> {
  const sessao = await obterSessao();
  if (!sessao) throw new Error("Sessão expirada.");

  const perguntas = await prisma.pergunta.findMany({
    where: { id: { in: respostas.map((r) => r.perguntaId) } },
    include: { opcoes: true },
  });

  let pontuacao = 0;
  const correcoes = [];

  for (const pergunta of perguntas) {
    const escolhida = respostas.find((r) => r.perguntaId === pergunta.id);
    const certa = pergunta.opcoes.find((o) => o.correta);
    const acertou = escolhida?.opcaoId === certa?.id;

    if (acertou) pontuacao++;

    // A identidade da opção certa nunca sai do servidor.
    correcoes.push({
      perguntaId: pergunta.id,
      correta: acertou,
      explicacao: pergunta.explicacao,
    });
  }

  const total = perguntas.length;
  const aprovada = total > 0 && pontuacao / total >= LIMIAR;

  await prisma.tentativaQuiz.create({
    data: { userId: sessao.user.id, licaoId, pontuacao, total, aprovada },
  });

  if (aprovada) {
    const licao = await prisma.licao.findUnique({ where: { id: licaoId } });
    await prisma.progressoLicao.upsert({
      where: { userId_licaoId: { userId: sessao.user.id, licaoId } },
      update: {},
      create: { userId: sessao.user.id, licaoId, pontos: licao?.pontos ?? 10 },
    });
  }

  revalidatePath("/modulos", "layout");
  revalidatePath("/inicio");

  return { pontuacao, total, aprovada, correcoes };
}
