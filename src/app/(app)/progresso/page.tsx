import Link from "next/link";
import {
  BookOpen,
  Check,
  MessageSquare,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { exigirSessao } from "@/lib/sessao";
import { GraficoEvolucao } from "./grafico-evolucao";

function pct(acertos: number, total: number) {
  return total === 0 ? 0 : Math.round((acertos / total) * 100);
}

export default async function Progresso() {
  const sessao = await exigirSessao();
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
        <h1 className="text-2xl font-semibold text-texto">O teu percurso</h1>
        <p className="mt-1 text-sm text-texto-suave">
          Onde estavas, onde estás, e o que falta.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-cartao border border-contorno bg-superficie-2 p-4">
          <BookOpen size={16} className="text-texto-tenue" aria-hidden="true" />
          <p className="mt-2 text-2xl font-semibold tabular-nums text-texto">
            {feitas.size}
            <span className="text-base font-normal text-texto-tenue">
              /{totalLicoes}
            </span>
          </p>
          <p className="text-xs text-texto-suave">Lições concluídas</p>
        </div>

        <div className="rounded-cartao border border-contorno bg-superficie-2 p-4">
          <MessageSquare
            size={16}
            className="text-texto-tenue"
            aria-hidden="true"
          />
          <p className="mt-2 text-2xl font-semibold tabular-nums text-texto">
            {simFeitas}
            <span className="text-base font-normal text-texto-tenue">
              /{simulacoes.length}
            </span>
          </p>
          <p className="text-xs text-texto-suave">Simulações feitas</p>
        </div>

        <div className="rounded-cartao border border-contorno bg-superficie-2 p-4">
          <Check size={16} className="text-texto-tenue" aria-hidden="true" />
          <p className="mt-2 text-2xl font-semibold tabular-nums text-texto">
            {pctFinal ?? pctDiag ?? 0}
            <span className="text-base font-normal text-texto-tenue">%</span>
          </p>
          <p className="text-xs text-texto-suave">
            {pctFinal !== null ? "Resultado final" : "Diagnóstico"}
          </p>
        </div>
      </div>

      {pctDiag !== null && (
        <section className="rounded-cartao border border-contorno bg-superficie-2 p-6">
          <h2 className="text-base font-semibold text-texto">
            Evolução do conhecimento
          </h2>
          <p className="mt-1 text-sm text-texto-suave">
            As mesmas dez perguntas, no início e no fim do percurso.
          </p>

          <div className="mt-5">
            <GraficoEvolucao diagnostico={pctDiag} final={pctFinal} />
          </div>

          {pctFinal !== null ? (
            <p className="mt-4 text-justify text-sm leading-relaxed text-texto/80">
              {pctFinal > pctDiag
                ? `Subiste ${pctFinal - pctDiag} pontos percentuais. As perguntas foram as mesmas, por outra ordem, portanto a diferença está no que aprendeste.`
                : pctFinal === pctDiag
                  ? "O resultado manteve-se. Vale a pena rever os módulos onde as respostas falharam."
                  : "O resultado desceu. Pode ter sido distracção, mas convém rever os módulos com calma."}
            </p>
          ) : (
            <p className="mt-4 text-sm text-texto-suave">
              A segunda coluna aparece depois de fazeres a avaliação final.
            </p>
          )}
        </section>
      )}

      <section>
        <h2 className="text-base font-semibold text-texto">Módulos</h2>
        <div className="mt-4 space-y-4">
          {modulos.map((modulo) => {
            const feitasNoModulo = modulo.licoes.filter((l) =>
              feitas.has(l.id),
            ).length;
            const completo = feitasNoModulo === modulo.licoes.length;

            return (
              <div
                key={modulo.id}
                className="rounded-cartao border border-contorno bg-superficie-2 p-5"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="font-medium text-texto">{modulo.titulo}</p>
                  <span
                    className={`shrink-0 text-xs font-medium ${
                      completo ? "text-sucesso" : "text-texto-tenue"
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
                        feitas.has(licao.id) ? "bg-sucesso" : "bg-superficie-3"
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
        <h2 className="text-base font-semibold text-texto">Simulações</h2>
        <div className="mt-4 space-y-2">
          {simulacoes.map((sim) => {
            const desfecho = ultimaPorSim.get(sim.id);

            return (
              <div
                key={sim.id}
                className="flex items-center justify-between gap-4 rounded-campo border border-contorno bg-superficie-2 px-4 py-3"
              >
                <span className="min-w-0 flex-1 truncate text-sm text-texto">
                  {sim.titulo}
                </span>

                {desfecho === "SEGURO" ? (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-sucesso">
                    <Check size={13} aria-hidden="true" />
                    Protegido
                  </span>
                ) : desfecho === "COMPROMETIDO" ? (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-perigo">
                    <ShieldAlert size={13} aria-hidden="true" />
                    Comprometido
                  </span>
                ) : desfecho === "PARCIAL" ? (
                  <span className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-texto/80">
                    <TriangleAlert size={13} aria-hidden="true" />
                    Por pouco
                  </span>
                ) : (
                  <span className="shrink-0 text-xs text-texto-tenue">
                    Por fazer
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {tudoFeito && pctFinal === null && (
        <div className="rounded-cartao border border-sucesso/35 bg-sucesso/10 p-6 text-center">
          <p className="font-medium text-texto">
            Percorreste os três módulos.
          </p>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-texto/80">
            Repete agora as dez perguntas do início. É assim que se vê o que
            mudou.
          </p>
          <Link
            href="/avaliacao-final"
            className="mt-5 inline-block rounded-campo bg-sucesso px-6 py-2.5 text-sm font-medium text-acento-contraste transition-colors hover:brightness-110"
          >
            Fazer avaliação final
          </Link>
        </div>
      )}
    </div>
  );
}
