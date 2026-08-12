"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, RotateCcw, X } from "lucide-react";
import {
  submeterQuiz,
  novaTentativa,
  type ResultadoQuiz,
} from "@/lib/acoes/quiz";
import { TextoRico } from "@/components/texto-rico";

export type Pergunta = {
  id: string;
  enunciado: string;
  opcoes: { id: string; texto: string }[];
};

export function QuizLicao({
  licaoId,
  perguntas,
  aoAvancar,
}: {
  licaoId: string;
  perguntas: Pergunta[];
  aoAvancar?: () => void;
}) {
  const [atuais, setAtuais] = useState<Pergunta[]>(perguntas);
  const [respostas, setRespostas] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<ResultadoQuiz | null>(null);
  const [pendente, iniciar] = useTransition();

  const todasRespondidas = atuais.every((p) => respostas[p.id]);

  function submeter() {
    iniciar(async () => {
      const r = await submeterQuiz(
        licaoId,
        atuais.map((p) => ({ perguntaId: p.id, opcaoId: respostas[p.id] })),
      );
      setResultado(r);
    });
  }

  function repetir() {
    iniciar(async () => {
      const novas = await novaTentativa(licaoId);
      setAtuais(novas);
      setRespostas({});
      setResultado(null);
    });
  }

  const percentagem = resultado
    ? Math.round((resultado.pontuacao / resultado.total) * 100)
    : 0;

  const faltam = resultado
    ? Math.max(0, Math.ceil(resultado.total * 0.7) - resultado.pontuacao)
    : 0;

  const mensagemFalha =
    faltam === 1
      ? "Foi quase. Falta uma resposta certa para atingires os 70%."
      : `Ainda não. Faltam ${faltam} respostas certas para atingires os 70%.`;

  return (
    <div className="space-y-6">
      {atuais.map((pergunta, i) => {
        const correcao = resultado?.correcoes.find(
          (c) => c.perguntaId === pergunta.id,
        );

        return (
          <div
            key={pergunta.id}
            className="rounded-xl border border-ink-200 bg-white p-5"
          >
            <p className="text-[15px] font-medium leading-snug text-ink-900">
              <span className="text-ink-400">{i + 1}.</span>{" "}
              <TextoRico>{pergunta.enunciado}</TextoRico>
            </p>

            <div className="mt-4 space-y-2">
              {pergunta.opcoes.map((opcao) => {
                const escolhida = respostas[pergunta.id] === opcao.id;
                const acertou = correcao?.correta === true;

                let estilo = "border-ink-200 bg-white text-ink-700";
                if (resultado) {
                  if (escolhida && acertou)
                    estilo = "border-[#17864F] bg-[#17864F]/5 text-ink-900";
                  else if (escolhida)
                    estilo = "border-[#C4302B] bg-[#C4302B]/5 text-ink-900";
                  else estilo = "border-ink-200 bg-white text-ink-500";
                } else if (escolhida) {
                  estilo = "border-[#1668D9] bg-[#1668D9]/5 text-ink-900";
                }

                return (
                  <button
                    key={opcao.id}
                    type="button"
                    disabled={resultado !== null || pendente}
                    onClick={() =>
                      setRespostas((a) => ({ ...a, [pergunta.id]: opcao.id }))
                    }
                    aria-pressed={escolhida}
                    className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left text-sm leading-snug transition-colors ${estilo}`}
                  >
                    <span className="mt-0.5 w-4 shrink-0">
                      {resultado && escolhida && acertou && (
                        <Check
                          size={15}
                          className="text-[#17864F]"
                          aria-label="Certo"
                        />
                      )}
                      {resultado && escolhida && !acertou && (
                        <X
                          size={15}
                          className="text-[#C4302B]"
                          aria-label="Errado"
                        />
                      )}
                    </span>
                    <span className="flex-1">{opcao.texto}</span>
                  </button>
                );
              })}
            </div>

            {correcao && (
              <p className="mt-4 border-l-2 border-ink-200 pl-3 text-justify text-sm leading-relaxed text-ink-700">
                <TextoRico>{correcao.explicacao}</TextoRico>
              </p>
            )}
          </div>
        );
      })}

      {!resultado ? (
        <button
          type="button"
          onClick={submeter}
          disabled={!todasRespondidas || pendente}
          className="w-full rounded-lg bg-[#1668D9] px-6 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40"
        >
          {pendente ? "A verificar…" : "Verificar respostas"}
        </button>
      ) : (
        <div
          className={`rounded-xl border p-5 ${
            resultado.aprovada
              ? "border-[#17864F]/30 bg-[#17864F]/5"
              : "border-ink-200 bg-ink-50"
          }`}
        >
          <p className="font-medium text-ink-900">
            {resultado.pontuacao} de {resultado.total} certas ({percentagem}%)
          </p>

          <p className="mt-2 text-justify text-sm leading-relaxed text-ink-700">
            {resultado.aprovada
              ? "Tópico concluído. Podes avançar, ou repetir com outras perguntas para consolidar."
              : `${mensagemFalha} Lê as explicações acima antes de tentares de novo.`}
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={repetir}
              disabled={pendente}
              className="inline-flex items-center gap-2 rounded-lg border border-ink-300 bg-white px-5 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:border-ink-400 disabled:opacity-40"
            >
              <RotateCcw size={14} aria-hidden="true" />
              {pendente ? "A preparar…" : "Tentar outra vez"}
            </button>

            {resultado.aprovada && aoAvancar && (
              <button
                type="button"
                onClick={aoAvancar}
                className="inline-flex items-center gap-2 rounded-lg bg-[#17864F] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Avançar
                <ArrowRight size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
