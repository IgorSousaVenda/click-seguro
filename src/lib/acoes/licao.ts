"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";

export async function concluirLicao(licaoId: string, proximoUrl: string) {
  const sessao = await obterSessao();
  if (!sessao) redirect("/entrar");

  const licao = await prisma.licao.findUnique({ where: { id: licaoId } });
  if (!licao) throw new Error("Lição não encontrada.");

  // upsert: concluir duas vezes não duplica nem soma pontos a dobrar
  await prisma.progressoLicao.upsert({
    where: { userId_licaoId: { userId: sessao.user.id, licaoId } },
    update: {},
    create: { userId: sessao.user.id, licaoId, pontos: licao.pontos },
  });

  revalidatePath("/inicio");
  redirect(proximoUrl);
}
