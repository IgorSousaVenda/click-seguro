"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";

type RespostaSubmetida = {
  perguntaId: string;
  opcaoId: string;
  tempoResposta: number;
};

export async function submeterAvaliacao(
  avaliacaoId: string,
  respostas: RespostaSubmetida[],
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
    redirect(`/diagnostico/resultado?id=${avaliacaoId}`);
  }

  const opcoes = await prisma.opcao.findMany({
    where: { id: { in: respostas.map((r) => r.opcaoId) } },
    select: { id: true, correta: true, perguntaId: true },
  });

  const mapaOpcoes = new Map(opcoes.map((o) => [o.id, o]));
  let pontuacao = 0;

  for (const resposta of respostas) {
    const opcao = mapaOpcoes.get(resposta.opcaoId);
    // A correção é feita no servidor: o cliente nunca sabe a resposta certa.
    const correta = opcao?.correta === true;
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

  redirect(`/diagnostico/resultado?id=${avaliacaoId}`);
}
