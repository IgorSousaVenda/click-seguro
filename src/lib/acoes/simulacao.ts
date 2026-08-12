"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";

export async function registarTentativa(
  simulacaoId: string,
  desfecho: string,
  caminho: string[],
) {
  const sessao = await obterSessao();
  if (!sessao) throw new Error("Sessão expirada.");

  await prisma.tentativaSimulacao.create({
    data: {
      userId: sessao.user.id,
      simulacaoId,
      desfecho,
      caminho: JSON.stringify(caminho),
    },
  });

  revalidatePath("/simulacoes");
}
