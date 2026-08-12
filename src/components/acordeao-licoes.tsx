"use client";

import { useState } from "react";
import { Check, ChevronDown, Lock } from "lucide-react";
import { ConteudoLicao } from "@/components/conteudo-licao";
import { QuizLicao } from "@/components/quiz-licao";

type Topico = {
  id: string;
  titulo: string;
  ordem: number;
  duracaoEstimada: number;
  conteudo: string;
  concluida: boolean;
  bloqueada: boolean;
  perguntas: {
    id: string;
    enunciado: string;
    opcoes: { id: string; texto: string }[];
  }[];
};

export function AcordeaoLicoes({ topicos }: { topicos: Topico[] }) {
  const primeiroAberto =
    topicos.find((t) => !t.bloqueada && !t.concluida)?.id ?? null;
  const [aberto, setAberto] = useState<string | null>(primeiroAberto);

  return (
    <div className="space-y-3">
      {topicos.map((topico) => {
        const expandido = aberto === topico.id;

        return (
          <div
            key={topico.id}
            className={`overflow-hidden rounded-xl border bg-white ${
              topico.bloqueada ? "border-ink-200 opacity-60" : "border-ink-200"
            }`}
          >
            <button
              type="button"
              disabled={topico.bloqueada}
              onClick={() => setAberto(expandido ? null : topico.id)}
              aria-expanded={expandido}
              className="flex w-full items-center gap-4 p-5 text-left disabled:cursor-not-allowed"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                  topico.concluida
                    ? "bg-[#17864F]/10 text-[#17864F]"
                    : topico.bloqueada
                      ? "bg-ink-100 text-ink-400"
                      : "bg-[#1668D9]/10 text-[#1668D9]"
                }`}
              >
                {topico.concluida ? (
                  <Check size={15} aria-label="Concluído" />
                ) : topico.bloqueada ? (
                  <Lock size={13} aria-label="Bloqueado" />
                ) : (
                  topico.ordem
                )}
              </span>

              <span className="min-w-0 flex-1">
                <span className="block font-medium text-ink-900">
                  {topico.titulo}
                </span>
                <span className="mt-0.5 block text-sm text-ink-500">
                  {topico.bloqueada
                    ? "Conclui o tópico anterior com 70% para desbloquear"
                    : `${topico.duracaoEstimada} min · ${topico.perguntas.length} perguntas`}
                </span>
              </span>

              {!topico.bloqueada && (
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`shrink-0 text-ink-400 transition-transform duration-200 ${
                    expandido ? "rotate-180" : ""
                  }`}
                />
              )}
            </button>

            <div
              className={`grid transition-all duration-300 ease-out ${
                expandido ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="border-t border-ink-200 p-5">
                  <ConteudoLicao texto={topico.conteudo} />

                  {topico.perguntas.length > 0 && (
                    <div className="mt-10 border-t border-ink-200 pt-8">
                      <h3 className="mb-5 font-semibold text-ink-900">
                        Verifica o que percebeste
                      </h3>
                      <QuizLicao
                        licaoId={topico.id}
                        perguntas={topico.perguntas}
                        aoAvancar={() => {
                          const proximo = topicos.find(
                            (t) => t.ordem === topico.ordem + 1,
                          );
                          setAberto(proximo ? proximo.id : null);
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
