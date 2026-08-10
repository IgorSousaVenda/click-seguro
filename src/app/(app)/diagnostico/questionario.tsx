"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronLeft } from "lucide-react";
import { submeterAvaliacao } from "@/lib/acoes/avaliacao";

type Pergunta = {
  id: string;
  enunciado: string;
  opcoes: { id: string; texto: string }[];
};

export function Questionario({
  avaliacaoId,
  perguntas,
}: {
  avaliacaoId: string;
  perguntas: Pergunta[];
}) {
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [tempos, setTempos] = useState<Record<string, number>>({});
  const [aSubmeter, iniciarSubmissao] = useTransition();

  // Guardado numa ref: muda sem provocar novo render.
  const inicioRef = useRef(0);

  // O relógio arranca depois do render, sempre que se muda de pergunta.
  useEffect(() => {
    inicioRef.current = Date.now();
  }, [indice]);

  const pergunta = perguntas[indice];
  const escolhida = respostas[pergunta.id];
  const ultima = indice === perguntas.length - 1;
  const progresso = ((indice + 1) / perguntas.length) * 100;

  function escolher(opcaoId: string) {
    setRespostas((anteriores) => ({ ...anteriores, [pergunta.id]: opcaoId }));

    // eslint-disable-next-line react-hooks/purity -- corre num clique, nunca durante o render
    const decorrido = Math.round((Date.now() - inicioRef.current) / 1000);
    setTempos((anteriores) => ({ ...anteriores, [pergunta.id]: decorrido }));
  }

  function avancar() {
    if (!escolhida) return;

    if (ultima) {
      iniciarSubmissao(async () => {
        await submeterAvaliacao(
          avaliacaoId,
          perguntas.map((p) => ({
            perguntaId: p.id,
            opcaoId: respostas[p.id],
            tempoResposta: tempos[p.id] ?? 0,
          })),
        );
      });
      return;
    }

    setIndice(indice + 1);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8">
        <div className="mb-2 flex items-center justify-between text-sm text-ink-600">
          <span>
            Pergunta {indice + 1} de {perguntas.length}
          </span>
          <span>Avaliação diagnóstica</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-ink-200">
          <div
            className="h-full rounded-full bg-[#1668D9] transition-all duration-300"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      <h1 className="text-xl font-semibold leading-snug text-ink-900">
        {pergunta.enunciado}
      </h1>

      <div className="mt-6 space-y-3">
        {pergunta.opcoes.map((opcao) => {
          const ativa = escolhida === opcao.id;
          return (
            <button
              key={opcao.id}
              type="button"
              onClick={() => escolher(opcao.id)}
              aria-pressed={ativa}
              className={`w-full rounded-xl border p-4 text-left text-[15px] leading-snug transition-colors ${
                ativa
                  ? "border-[#1668D9] bg-[#1668D9]/5 text-ink-900"
                  : "border-ink-200 bg-white text-ink-700 hover:border-ink-300"
              }`}
            >
              {opcao.texto}
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setIndice(indice - 1)}
          disabled={indice === 0 || aSubmeter}
          className="flex items-center gap-1 text-sm text-ink-600 hover:text-ink-900 disabled:invisible"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Anterior
        </button>

        <button
          type="button"
          onClick={avancar}
          disabled={!escolhida || aSubmeter}
          className="rounded-lg bg-[#1668D9] px-6 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {aSubmeter ? "A guardar…" : ultima ? "Concluir" : "Seguinte"}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-ink-500">
        As explicações aparecem no fim, depois de responderes a tudo.
      </p>
    </div>
  );
}
