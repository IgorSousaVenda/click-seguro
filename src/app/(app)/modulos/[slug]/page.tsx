import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { AcordeaoLicoes } from "@/components/acordeao-licoes";
import { obterPerguntasDaTentativa } from "@/lib/acoes/quiz";

export default async function Modulo({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sessao = await obterSessao();
  const userId = sessao!.user.id;

  const modulo = await prisma.modulo.findUnique({
    where: { slug },
    include: {
      licoes: {
        orderBy: { ordem: "asc" },
        include: {
          perguntas: {
            orderBy: { ordem: "asc" },
            select: {
              id: true,
              enunciado: true,
              opcoes: {
                orderBy: { ordem: "asc" },
                select: { id: true, texto: true },
              },
            },
          },
        },
      },
    },
  });

  if (!modulo) notFound();

  const concluidas = await prisma.progressoLicao.findMany({
    where: { userId, licaoId: { in: modulo.licoes.map((l) => l.id) } },
    select: { licaoId: true },
  });

  const feitas = new Set(concluidas.map((c) => c.licaoId));

  const topicos = await Promise.all(
    modulo.licoes.map(async (licao, i) => {
      const anterior = i > 0 ? modulo.licoes[i - 1] : null;
      return {
        id: licao.id,
        titulo: licao.titulo,
        ordem: licao.ordem,
        duracaoEstimada: licao.duracaoEstimada,
        conteudo: licao.conteudo,
        concluida: feitas.has(licao.id),
        bloqueada: anterior !== null && !feitas.has(anterior.id),
        perguntas: await obterPerguntasDaTentativa(licao.id),
      };
    }),
  );

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/inicio" className="text-sm text-ink-600 hover:text-ink-900">
        ← Módulos
      </Link>

      <h1 className="mt-4 text-2xl font-semibold text-ink-900">
        {modulo.titulo}
      </h1>
      <p className="mt-2 text-ink-600">{modulo.descricao}</p>
      <p className="mt-4 text-sm text-ink-500">
        {feitas.size} de {modulo.licoes.length} tópicos concluídos
      </p>

      <div className="mt-8">
        <AcordeaoLicoes topicos={topicos} />
      </div>
    </div>
  );
}
