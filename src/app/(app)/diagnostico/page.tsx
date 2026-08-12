import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { Questionario } from "./questionario";

export default async function Diagnostico() {
  const sessao = await obterSessao();
  const userId = sessao!.user.id;

  const jaConcluido = await prisma.avaliacao.findFirst({
    where: { userId, tipo: "DIAGNOSTICO", concluidaEm: { not: null } },
  });

  if (jaConcluido) {
    redirect(`/diagnostico/resultado?id=${jaConcluido.id}`);
  }

  let avaliacao = await prisma.avaliacao.findFirst({
    where: { userId, tipo: "DIAGNOSTICO", concluidaEm: null },
  });

  if (!avaliacao) {
    avaliacao = await prisma.avaliacao.create({
      data: { userId, tipo: "DIAGNOSTICO" },
    });
  }

  const perguntas = await prisma.pergunta.findMany({
    where: { licaoId: null },
    orderBy: { ordem: "asc" },
    select: {
      id: true,
      enunciado: true,
      opcoes: {
        orderBy: { ordem: "asc" },
        select: { id: true, texto: true },
      },
    },
  });

  return <Questionario avaliacaoId={avaliacao.id} perguntas={perguntas} />;
}
