import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { ConversaSimulacao } from "@/components/conversa-simulacao";

export default async function Simulacao({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sessao = await obterSessao();
  const userId = sessao!.user.id;

  const simulacao = await prisma.simulacao.findUnique({
    where: { slug },
    include: { nos: { include: { escolhas: { orderBy: { ordem: "asc" } } } } },
  });

  if (!simulacao) notFound();

  // Verificação no servidor: esconder na interface nao basta.
  const modulos = await prisma.modulo.findMany({
    include: { licoes: { select: { id: true } } },
  });
  const concluidas = await prisma.progressoLicao.findMany({
    where: { userId },
    select: { licaoId: true },
  });
  const feitas = new Set(concluidas.map((c) => c.licaoId));
  const completos = modulos.filter(
    (m) => m.licoes.length > 0 && m.licoes.every((l) => feitas.has(l.id)),
  ).length;

  if (completos < simulacao.moduloMinimo - 1) redirect("/simulacoes");

  return (
    <ConversaSimulacao
      simulacao={{
        id: simulacao.id,
        titulo: simulacao.titulo,
        canal: simulacao.canal,
        remetente: simulacao.remetente,
        contexto: simulacao.contexto,
        licao: simulacao.licao,
        nos: simulacao.nos.map((n) => ({
          chave: n.chave,
          mensagens: JSON.parse(n.mensagens) as string[],
          desfecho: n.desfecho,
          desenlace: n.desenlace,
          escolhas: n.escolhas.map((e) => ({
            id: e.id,
            texto: e.texto,
            proximo: e.proximo,
          })),
        })),
      }}
    />
  );
}
