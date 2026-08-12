"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";

export async function submeterFinal(
  avaliacaoId: string,
  respostas: { perguntaId: string; opcaoId: string; tempoResposta: number }[],
) {
  const sessao = await obterSessao();
  if (!sessao) redirect("/entrar");

  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id: avaliacaoId },
  });

  if (!avaliacao || avaliacao.userId !== sessao.user.id) {
    throw new Error("Avaliação não encontrada.");
  }

  if (avaliacao.concluidaEm) {
    redirect("/progresso");
  }

  const opcoes = await prisma.opcao.findMany({
    where: { id: { in: respostas.map((r) => r.opcaoId) } },
    select: { id: true, correta: true },
  });

  const mapa = new Map(opcoes.map((o) => [o.id, o]));
  let pontuacao = 0;

  for (const resposta of respostas) {
    const correta = mapa.get(resposta.opcaoId)?.correta === true;
    if (correta) pontuacao++;

    await prisma.respostaAvaliacao.create({
      data: {
        avaliacaoId,
        perguntaId: resposta.perguntaId,
        opcaoId: resposta.opcaoId,
        correta,
        tempoResposta: resposta.tempoResposta,
      },
    });
  }

  await prisma.avaliacao.update({
    where: { id: avaliacaoId },
    data: {
      pontuacao,
      total: respostas.length,
      concluidaEm: new Date(),
    },
  });

  redirect("/progresso");
}
