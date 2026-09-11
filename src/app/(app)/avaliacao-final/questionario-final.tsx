"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { ChevronLeft } from "lucide-react";
import { submeterFinal } from "@/lib/acoes/final";
import { TextoRico } from "@/components/texto-rico";

type Pergunta = {
  id: string;
  enunciado: string;
  opcoes: { id: string; texto: string }[];
};

export function QuestionarioFinal({
  avaliacaoId,
  perguntas,
}: {
  avaliacaoId: string;
  perguntas: Pergunta[];
}) {
  const [indice, setIndice] = useState(0);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [tempos, setTempos] = useState<Record<string, number>>({});
  const [aSubmeter, iniciar] = useTransition();

  const inicioRef = useRef(0);

  useEffect(() => {
    inicioRef.current = Date.now();
  }, [indice]);

  const pergunta = perguntas[indice];
  const escolhida = respostas[pergunta.id];
  const ultima = indice === perguntas.length - 1;
  const progresso = ((indice + 1) / perguntas.length) * 100;

  function escolher(opcaoId: string) {
    setRespostas((a) => ({ ...a, [pergunta.id]: opcaoId }));
    // eslint-disable-next-line react-hooks/purity -- corre num clique, nunca durante o render
    const decorrido = Math.round((Date.now() - inicioRef.current) / 1000);
    setTempos((a) => ({ ...a, [pergunta.id]: decorrido }));
  }

  function avancar() {
    if (!escolhida) return;

    if (ultima) {
      iniciar(async () => {
        await submeterFinal(
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
        <div className="mb-2 flex items-center justify-between text-sm text-texto-suave">
          <span>
            Pergunta {indice + 1} de {perguntas.length}
          </span>
          <span>Avaliação final</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-superficie-3">
          <div
            className="h-full rounded-full bg-sucesso transition-all duration-300"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      <h1 className="text-xl font-semibold leading-snug text-texto">
        <TextoRico>{pergunta.enunciado}</TextoRico>
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
              className={`w-full rounded-cartao border p-4 text-left text-[15px] leading-snug transition-colors ${
                ativa
                  ? "border-sucesso bg-sucesso/10 text-texto"
                  : "border-contorno bg-superficie-2 text-texto/80 hover:border-contorno-forte"
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
          className="flex items-center gap-1 text-sm text-texto-suave hover:text-texto disabled:invisible"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          Anterior
        </button>

        <button
          type="button"
          onClick={avancar}
          disabled={!escolhida || aSubmeter}
          className="rounded-campo bg-sucesso px-6 py-2.5 text-sm font-medium text-acento-contraste transition-colors hover:brightness-110 disabled:opacity-40"
        >
          {aSubmeter ? "A guardar…" : ultima ? "Concluir" : "Seguinte"}
        </button>
      </div>

      <p className="mt-8 text-center text-sm text-texto-tenue">
        As mesmas perguntas do início, por outra ordem. O que mudou é o que
        sabes.
      </p>
    </div>
  );
}
