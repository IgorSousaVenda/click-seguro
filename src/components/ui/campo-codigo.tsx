"use client";

import { useEffect, useId, useRef, useState } from "react";

const DIGITOS = 6;

/**
 * Seis caixas de um dígito. Aceita colagem do código inteiro, navegação
 * com as setas e apagar para trás, porque é assim que as pessoas usam
 * os códigos que recebem por e-mail.
 */
export function CampoCodigo({
  valor,
  aoMudar,
  aoCompletar,
  erro,
  desativado,
}: {
  valor: string;
  aoMudar: (v: string) => void;
  aoCompletar?: (v: string) => void;
  erro?: string;
  desativado?: boolean;
}) {
  const id = useId();
  const caixas = useRef<(HTMLInputElement | null)[]>([]);
  const [focado, setFocado] = useState<number | null>(null);

  useEffect(() => {
    if (valor.length === DIGITOS) aoCompletar?.(valor);
    // aoCompletar é recriado a cada render do pai; depender dele aqui
    // dispararia a submissão em ciclo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valor]);

  function escrever(indice: number, texto: string) {
    const digitos = texto.replace(/\D/g, "");
    if (!digitos) return;

    const partes = valor.padEnd(DIGITOS, " ").split("");
    for (let i = 0; i < digitos.length && indice + i < DIGITOS; i++) {
      partes[indice + i] = digitos[i];
    }
    const novo = partes.join("").trimEnd();
    aoMudar(novo.slice(0, DIGITOS));

    const seguinte = Math.min(indice + digitos.length, DIGITOS - 1);
    caixas.current[seguinte]?.focus();
  }

  function aoPremir(indice: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      e.preventDefault();
      const partes = valor.padEnd(DIGITOS, " ").split("");
      if (partes[indice] && partes[indice] !== " ") {
        partes[indice] = " ";
        aoMudar(partes.join("").trimEnd());
      } else if (indice > 0) {
        partes[indice - 1] = " ";
        aoMudar(partes.join("").trimEnd());
        caixas.current[indice - 1]?.focus();
      }
    }
    if (e.key === "ArrowLeft" && indice > 0) caixas.current[indice - 1]?.focus();
    if (e.key === "ArrowRight" && indice < DIGITOS - 1)
      caixas.current[indice + 1]?.focus();
  }

  return (
    <div>
      <div
        className="flex justify-between gap-2"
        role="group"
        aria-label="Código de seis dígitos"
        aria-describedby={erro ? `${id}-erro` : undefined}
      >
        {Array.from({ length: DIGITOS }).map((_, i) => (
          <input
            key={i}
            ref={(el) => {
              caixas.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={i === 0 ? "one-time-code" : "off"}
            maxLength={DIGITOS}
            disabled={desativado}
            aria-label={`Dígito ${i + 1}`}
            value={valor[i] ?? ""}
            onChange={(e) => escrever(i, e.target.value)}
            onKeyDown={(e) => aoPremir(i, e)}
            onFocus={() => setFocado(i)}
            onBlur={() => setFocado(null)}
            className={`h-14 w-full rounded-campo border text-center text-xl font-semibold tabular-nums transition-colors ${
              erro
                ? "border-perigo bg-perigo/8 text-perigo"
                : focado === i
                  ? "border-acento bg-texto/12 text-texto"
                  : "border-texto/20 bg-texto/8 text-texto"
            } disabled:opacity-50`}
          />
        ))}
      </div>
      {erro && (
        <p id={`${id}-erro`} role="alert" className="mt-2 text-[13px] text-perigo">
          <span aria-hidden="true">⚠ </span>
          {erro}
        </p>
      )}
    </div>
  );
}
