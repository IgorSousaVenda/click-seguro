import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { QuestionarioFinal } from "./questionario-final";

function baralhar<T>(lista: T[]): T[] {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

export default async function AvaliacaoFinal() {
  const sessao = await obterSessao();
  const userId = sessao!.user.id;

  const jaFez = await prisma.avaliacao.findFirst({
    where: { userId, tipo: "FINAL", concluidaEm: { not: null } },
  });

  if (jaFez) redirect("/progresso");

  // Só depois de todas as lições concluídas.
  const modulos = await prisma.modulo.findMany({
    include: { licoes: { select: { id: true } } },
  });
  const concluidas = await prisma.progressoLicao.findMany({
    where: { userId },
    select: { licaoId: true },
  });
  const feitas = new Set(concluidas.map((c) => c.licaoId));
  const total = modulos.reduce((s, m) => s + m.licoes.length, 0);

  if (total === 0 || feitas.size < total) redirect("/inicio");

  let avaliacao = await prisma.avaliacao.findFirst({
    where: { userId, tipo: "FINAL", concluidaEm: null },
  });

  if (!avaliacao) {
    avaliacao = await prisma.avaliacao.create({
      data: { userId, tipo: "FINAL" },
    });
  }

  // As mesmas perguntas do diagnóstico, para a comparação medir o mesmo.
  const perguntas = await prisma.pergunta.findMany({
    where: { licaoId: null },
    select: {
      id: true,
      enunciado: true,
      opcoes: { select: { id: true, texto: true } },
    },
  });

  const baralhadas = baralhar(perguntas).map((p) => ({
    ...p,
    opcoes: baralhar(p.opcoes),
  }));

  return (
    <QuestionarioFinal avaliacaoId={avaliacao.id} perguntas={baralhadas} />
  );
}
