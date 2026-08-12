import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";

export default async function Inicio() {
  const sessao = await obterSessao();
  const userId = sessao!.user.id;
  const primeiroNome = sessao!.user.name.split(" ")[0];

  const diagnostico = await prisma.avaliacao.findFirst({
    where: { userId, tipo: "DIAGNOSTICO", concluidaEm: { not: null } },
  });

  const modulos = await prisma.modulo.findMany({
    orderBy: { ordem: "asc" },
    include: { licoes: { select: { id: true } } },
  });

  const concluidas = await prisma.progressoLicao.findMany({
    where: { userId },
    select: { licaoId: true },
  });

  const feitas = new Set(concluidas.map((c) => c.licaoId));

  const totalLicoes = modulos.reduce((soma, m) => soma + m.licoes.length, 0);
  const tudoConcluido = totalLicoes > 0 && feitas.size === totalLicoes;

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">
          Olá, {primeiroNome}.
        </h1>
        <p className="mt-1 text-ink-600">
          {diagnostico
            ? "Continua o teu percurso de aprendizagem."
            : "Vamos começar por perceber onde estás."}
        </p>
      </div>

      {!diagnostico && (
        <section className="rounded-xl border border-[#1668D9]/20 bg-[#1668D9]/5 p-6">
          <h2 className="font-semibold text-ink-900">Avaliação diagnóstica</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            Dez perguntas para medir o que já sabes. Não é uma nota — é o ponto
            de partida para comparares no fim.
          </p>
          <Link
            href="/diagnostico"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1668D9] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Começar avaliação
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      )}

      <section>
        <h2 className="font-semibold text-ink-900">Módulos</h2>

        {!diagnostico ? (
          <p className="mt-4 rounded-xl border border-dashed border-ink-300 p-6 text-sm text-ink-500">
            Os módulos ficam disponíveis depois da avaliação diagnóstica.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {modulos.map((modulo) => {
              const total = modulo.licoes.length;
              const feito = modulo.licoes.filter((l) =>
                feitas.has(l.id),
              ).length;
              const completo = total > 0 && feito === total;

              return (
                <Link
                  key={modulo.id}
                  href={`/modulos/${modulo.slug}`}
                  className="flex items-center gap-4 rounded-xl border border-ink-200 bg-white p-5 transition-colors hover:border-ink-300"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      completo
                        ? "bg-[#17864F]/10 text-[#17864F]"
                        : "bg-[#1668D9]/10 text-[#1668D9]"
                    }`}
                  >
                    {completo ? (
                      <Check size={16} aria-label="Concluído" />
                    ) : (
                      modulo.ordem
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-ink-900">
                      {modulo.titulo}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-600">
                      {modulo.descricao}
                    </span>
                    <span className="mt-2 flex items-center gap-1.5 text-sm text-ink-500">
                      <Clock size={13} aria-hidden="true" />
                      {feito} de {total} lições
                    </span>
                  </span>

                  <ArrowRight
                    size={16}
                    className="shrink-0 text-ink-400"
                    aria-hidden="true"
                  />
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {tudoConcluido && (
        <section className="rounded-xl border border-[#17864F]/20 bg-[#17864F]/5 p-6">
          <h2 className="font-semibold text-ink-900">Percurso concluído</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            Passaste por todas as lições. Está na hora de repetir a avaliação e
            ver o que mudou.
          </p>
          <Link
            href="/avaliacao-final"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#17864F] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Avaliação final
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      )}
    </div>
  );
}
