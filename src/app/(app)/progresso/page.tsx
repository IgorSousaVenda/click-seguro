import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Check,
  MessageSquare,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { GraficoEvolucao } from "./grafico-evolucao";

function pct(acertos: number, total: number) {
  return total === 0 ? 0 : Math.round((acertos / total) * 100);
}

export default async function Progresso() {
  const sessao = await obterSessao();
  if (!sessao) redirect("/entrar");
  const userId = sessao.user.id;

  const [avaliacoes, modulos, concluidas, simulacoes, tentativas] =
    await Promise.all([
      prisma.avaliacao.findMany({
        where: { userId, concluidaEm: { not: null } },
        orderBy: { concluidaEm: "asc" },
      }),
      prisma.modulo.findMany({
        orderBy: { ordem: "asc" },
        include: {
          licoes: { select: { id: true, titulo: true, ordem: true } },
        },
      }),
      prisma.progressoLicao.findMany({
        where: { userId },
        select: { licaoId: true },
      }),
      prisma.simulacao.findMany({ orderBy: { ordem: "asc" } }),
      prisma.tentativaSimulacao.findMany({
        where: { userId },
        orderBy: { realizadaEm: "asc" },
      }),
    ]);

  const diagnostico = avaliacoes.find((a) => a.tipo === "DIAGNOSTICO");
  const final = avaliacoes.find((a) => a.tipo === "FINAL");

  const pctDiag = diagnostico
    ? pct(diagnostico.pontuacao ?? 0, diagnostico.total ?? 0)
    : null;
  const pctFinal = final ? pct(final.pontuacao ?? 0, final.total ?? 0) : null;

  const feitas = new Set(concluidas.map((c) => c.licaoId));
  const totalLicoes = modulos.reduce((s, m) => s + m.licoes.length, 0);
  const tudoFeito = totalLicoes > 0 && feitas.size >= totalLicoes;

  const ultimaPorSim = new Map<string, string>();
  for (const t of tentativas) ultimaPorSim.set(t.simulacaoId, t.desfecho);
  const simFeitas = simulacoes.filter((s) => ultimaPorSim.has(s.id)).length;

  return (
    <div className="mx-auto max-w-3xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">O teu percurso</h1>
        <p className="mt-1 text-sm text-ink-600">
          Onde estavas, onde estás, e o que falta.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-ink-200 bg-white p-4">
          <BookOpen size={16} className="text-ink-400" aria-hidden="true" />
          <p className="mt-2 text-2xl font-semibold tabular-nums text-ink-900">
            {feitas.size}
            <span className="text-base font-normal text-ink-400">
              /{totalLicoes}
            </span>
          </p>
          <p className="text-xs text-ink-600">Lições concluídas</p>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-4">
          <MessageSquare
            size={16}
            className="text-ink-400"
            aria-hidden="true"
          />
          <p className="mt-2 text-2xl font-semibold tabular-nums text-ink-900">
            {simFeitas}
            <span className="text-base font-normal text-ink-400">
              /{simulacoes.length}
            </span>
          </p>
          <p className="text-xs text-ink-600">Simulações feitas</p>
        </div>

        <div className="rounded-xl border border-ink-200 bg-white p-4">
          <Check size={16} className="text-ink-400" aria-hidden="true" />
          <p className="mt-2 text-2xl font-semibold tabular-nums text-ink-900">
            {pctFinal ?? pctDiag ?? 0}
            <span className="text-base font-normal text-ink-400">%</span>
          </p>
          <p className="text-xs text-ink-600">
            {pctFinal !== null ? "Resultado final" : "Diagnóstico"}
          </p>
        </div>
      </div>

      {pctDiag !== null && (
        <section className="rounded-xl border border-ink-200 bg-white p-6">
          <h2 className="text-base font-semibold text-ink-900">
            Evolução do conhecimento
          </h2>
          <p className="mt-1 text-sm text-ink-600">
            As mesmas dez perguntas, no início e no fim do percurso.
          </p>

          <div className="mt-5">
            <GraficoEvolucao diagnostico={pctDiag} final={pctFinal} />
          </div>

          {pctFinal !== null ? (
            <p className="mt-4 text-justify text-sm leading-relaxed text-ink-700">
              {pctFinal > pctDiag
                ? `Subiste ${pctFinal - pctDiag} pontos percentuais. As perguntas foram as mesmas, por outra ordem, portanto a diferença está no que aprendeste.`
                : pctFinal === pctDiag
                  ? "O resultado manteve-se. Vale a pena rever os módulos onde as respostas falharam."
                  : "O resultado desceu. Pode ter sido distracção, mas convém rever os módulos com calma."}
            </p>
          ) : (
            <p className="mt-4 text-sm text-ink-600">
              A segunda coluna aparece depois de fazeres a avaliação final.
            </p>
          )}
        </section>
      )}

      <section>
        <h2 className="text-base font-semibold text-ink-900">Módulos</h2>
        <div className="mt-4 space-y-4">
          {modulos.map((modulo) => {
            const feitasNoModulo = modulo.licoes.filter((l) =>
              feitas.has(l.id),
            ).length;
            const completo = feitasNoModulo === modulo.licoes.length;

            return (
              <div
                key={modulo.id}
                className="rounded-xl border border-ink-200 bg-white p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-ink-900">{modulo.titulo}</p>
                  <span
                    className={`shrink-0 text-xs font-medium ${
                      completo ? "text-[#17864F]" : "text-ink-500"
                    }`}
                  >
                    {feitasNoModulo} de {modulo.licoes.length}
                  </span>
                </div>

                <div className="mt-3 flex gap-1.5">
                  {modulo.licoes.map((licao) => (
                    <span
                      key={licao.id}
                      title={licao.titulo}
                      className={`h-1.5 flex-1 rounded-full ${
                        feitas.has(licao.id) ? "bg-[#17864F]" : "bg-ink-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-base font-semibold text-ink-900">Simulações</h2>
        <div className="mt-4 space-y-2">
          {simulacoes.map((sim) => {
            const desfecho = ultimaPorSim.get(sim.id);

            return (
              <div
                key={sim.id}
                className="flex items-center justify-between gap-4 rounded-lg border border-ink-200 bg-white px-4 py-3"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-ink-800">
                  {sim.titulo}
                </span>

                {desfecho === "SEGURO" ? (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#17864F]">
                    <Check size={13} aria-hidden="true" />
                    Protegido
                  </span>
                ) : desfecho === "COMPROMETIDO" ? (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-[#C4302B]">
                    <ShieldAlert size={13} aria-hidden="true" />
                    Comprometido
                  </span>
                ) : desfecho === "PARCIAL" ? (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-700">
                    <TriangleAlert size={13} aria-hidden="true" />
                    Por pouco
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-ink-400">
                    Por fazer
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {tudoFeito && pctFinal === null && (
        <div className="rounded-xl border border-[#17864F]/30 bg-[#17864F]/5 p-6 text-center">
          <p className="font-medium text-ink-900">
            Percorreste os três módulos.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-700">
            Repete agora as dez perguntas do início. É assim que se vê o que
            mudou.
          </p>
          <Link
            href="/avaliacao-final"
            className="mt-5 inline-block rounded-lg bg-[#17864F] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Fazer avaliação final
          </Link>
        </div>
      )}
    </div>
  );
}
