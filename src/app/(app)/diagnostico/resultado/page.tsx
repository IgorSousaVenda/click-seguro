import Link from "next/link";
import { redirect } from "next/navigation";
import { Check, X } from "lucide-react";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { TextoRico } from "@/components/texto-rico";

export default async function Resultado({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  const sessao = await obterSessao();

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

  if (!avaliacao || avaliacao.userId !== sessao!.user.id) {
    redirect("/inicio");
  }

  const pontuacao = avaliacao.pontuacao ?? 0;
  const total = avaliacao.total ?? 0;
  const percentagem = total > 0 ? Math.round((pontuacao / total) * 100) : 0;

  const erradas = avaliacao.respostas.filter((r) => !r.correta);

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div className="rounded-xl border border-ink-200 bg-white p-8 text-center">
        <p className="text-sm text-ink-600">Avaliação diagnóstica concluída</p>
        <p className="mt-3 text-5xl font-semibold text-ink-900">
          {pontuacao}
          <span className="text-2xl text-ink-400">/{total}</span>
        </p>
        <p className="mt-2 text-ink-600">{percentagem}% de respostas certas</p>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-ink-600">
          Esta pontuação não é uma nota. Serve como ponto de partida! no fim do
          percurso repetes a avaliação e comparas os dois resultados.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="font-semibold text-ink-900">
          {erradas.length === 0
            ? "Acertaste em todas"
            : `Rever ${erradas.length} ${erradas.length === 1 ? "resposta" : "respostas"}`}
        </h2>

        {avaliacao.respostas.map((resposta) => (
          <article
            key={resposta.id}
            className="rounded-xl border border-ink-200 bg-white p-5"
          >
            <div className="flex gap-3">
              <span
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                  resposta.correta
                    ? "bg-[#17864F]/10 text-[#17864F]"
                    : "bg-[#C4302B]/10 text-[#C4302B]"
                }`}
              >
                {resposta.correta ? <Check size={13} /> : <X size={13} />}
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-medium leading-snug text-ink-900">
                  {resposta.pergunta.enunciado}
                </p>

                <p className="mt-2 text-sm text-ink-600">
                  <span
                    className={
                      resposta.correta ? "text-[#17864F]" : "text-[#C4302B]"
                    }
                  >
                    {resposta.correta ? "Certo" : "Errado"}
                  </span>
                  {". respondeste: "}
                  {resposta.opcao?.texto}
                </p>

                <p className="mt-3 border-l-2 border-ink-200 pl-3 text-sm leading-relaxed text-ink-700">
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
          className="inline-flex rounded-lg bg-[#1668D9] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          Ver os módulos
        </Link>
      </div>
    </div>
  );
}
