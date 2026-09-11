import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, X } from "lucide-react";
import { prisma } from "@/lib/db";
import { exigirSessao } from "@/lib/sessao";
import { TextoRico } from "@/components/texto-rico";

export default async function Resultado({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const sessao = await exigirSessao();

  if (!id) redirect("/inicio");

  const avaliacao = await prisma.avaliacao.findUnique({
    where: { id },
    include: {
      respostas: {
        include: {
          pergunta: { include: { modulo: true } },
          opcao: true,
        },
      },
    },
  });

  if (!avaliacao || avaliacao.userId !== sessao.user.id) {
    redirect("/inicio");
  }

  const pontuacao = avaliacao.pontuacao ?? 0;
  const total = avaliacao.total ?? 0;
  const percentagem = total > 0 ? Math.round((pontuacao / total) * 100) : 0;

  const erradas = avaliacao.respostas.filter((r) => !r.correta);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div className="rounded-cartao border border-contorno bg-superficie-2 p-8 text-center">
        <p className="text-sm text-texto-suave">Avaliação diagnóstica concluída</p>
        <p className="mt-3 text-5xl font-semibold text-texto">
          {pontuacao}
          <span className="text-2xl text-texto-tenue">/{total}</span>
        </p>
        <p className="mt-2 text-texto-suave">{percentagem}% de respostas certas</p>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-texto-suave">
          Esta pontuação não é uma nota. Serve como ponto de partida! no fim do
          percurso repetes a avaliação e comparas os dois resultados.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-semibold text-texto">
          {erradas.length === 0
            ? "Acertaste em todas"
            : `Rever ${erradas.length} ${erradas.length === 1 ? "resposta" : "respostas"}`}
        </h2>

        {avaliacao.respostas.map((resposta) => (
          <article
            key={resposta.id}
            className="rounded-cartao border border-contorno bg-superficie-2 p-5"
          >
            <div className="flex gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  resposta.correta
                    ? "bg-sucesso/15 text-sucesso"
                    : "bg-perigo/15 text-perigo"
                }`}
              >
                {resposta.correta ? <Check size={13} /> : <X size={13} />}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium leading-snug text-texto">
                  {resposta.pergunta.enunciado}
                </p>

                <p className="mt-2 text-sm text-texto-suave">
                  <span
                    className={
                      resposta.correta ? "text-sucesso" : "text-perigo"
                    }
                  >
                    {resposta.correta ? "Certo" : "Errado"}
                  </span>
                  {". respondeste: "}
                  {resposta.opcao?.texto}
                </p>

                <p className="mt-3 border-l-2 border-contorno pl-3 text-sm leading-relaxed text-texto/80">
                  <TextoRico>{resposta.pergunta.explicacao}</TextoRico>
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="text-center">
        <Link
          href="/inicio"
          className="inline-flex rounded-campo bg-acento px-6 py-2.5 text-sm font-medium text-acento-contraste transition-colors hover:bg-acento-forte"
        >
          Ver os módulos
        </Link>
      </div>
    </div>
  );
}
