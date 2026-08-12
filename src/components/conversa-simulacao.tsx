"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  Check,
  ChevronsRight,
  Mail,
  MessageCircle,
  Phone,
  ShieldAlert,
  Smartphone,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { registarTentativa } from "@/lib/acoes/simulacao";

export type NoDados = {
  chave: string;
  mensagens: string[];
  desfecho: string | null;
  desenlace: string | null;
  escolhas: { id: string; texto: string; proximo: string }[];
};

export type SimulacaoDados = {
  id: string;
  titulo: string;
  canal: string;
  remetente: string;
  contexto: string;
  licao: string;
  nos: NoDados[];
};

const icones = {
  SMS: Smartphone,
  EMAIL: Mail,
  CHAMADA: Phone,
  WHATSAPP: MessageCircle,
} as const;

// O atraso imita alguém a escrever: proporcional ao comprimento, com tecto.
function atrasoDe(texto: string) {
  return Math.min(600 + texto.length * 22, 2600);
}

function ehNarracao(texto: string) {
  return texto.startsWith("*") && texto.endsWith("*");
}

function limpar(texto: string) {
  return ehNarracao(texto) ? texto.slice(1, -1) : texto;
}

function relogio() {
  return new Date().toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ConversaSimulacao({
  simulacao,
}: {
  simulacao: SimulacaoDados;
}) {
  const [comecou, setComecou] = useState(false);
  const [noAtual, setNoAtual] = useState("inicio");
  const [visiveis, setVisiveis] = useState<{ texto: string; hora: string }[]>(
    [],
  );
  const [aEscrever, setAEscrever] = useState(false);
  const [prontasEm, setProntasEm] = useState<string | null>(null);
  const prontas = prontasEm === noAtual;
  const [caminho, setCaminho] = useState<string[]>(["inicio"]);
  const [hora, setHora] = useState(relogio);
  const [saltar, setSaltar] = useState(false);

  const fim = useRef<HTMLDivElement>(null);
  const registado = useRef(false);

  const no = simulacao.nos.find((n) => n.chave === noAtual);
  const Icone = icones[simulacao.canal as keyof typeof icones] ?? Mail;

  // Relógio real do dispositivo, actualizado a cada minuto.
  useEffect(() => {
    const id = setInterval(() => setHora(relogio()), 30000);
    return () => clearInterval(id);
  }, []);

  // Chegada faseada das mensagens do nó actual.
  useEffect(() => {
    if (!comecou || !no) return;

    const semMovimento =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (saltar || semMovimento) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza a conversa com a mudanca de no
      setVisiveis((a) => [
        ...a,
        ...no.mensagens.map((m) => ({ texto: m, hora: relogio() })),
      ]);
      setProntasEm(noAtual);
      return;
    }

    let cancelado = false;
    const temporizadores: ReturnType<typeof setTimeout>[] = [];

    async function mostrar() {
      for (const mensagem of no!.mensagens) {
        if (cancelado) return;

        setAEscrever(true);
        await new Promise<void>((r) => {
          const t = setTimeout(r, atrasoDe(mensagem));
          temporizadores.push(t);
        });

        if (cancelado) return;
        setAEscrever(false);
        setVisiveis((a) => [...a, { texto: mensagem, hora: relogio() }]);

        await new Promise<void>((r) => {
          const t = setTimeout(r, 350);
          temporizadores.push(t);
        });
      }

      if (!cancelado) setProntasEm(noAtual);
    }

    mostrar();

    return () => {
      cancelado = true;
      temporizadores.forEach(clearTimeout);
      setAEscrever(false);
    };
  }, [noAtual, comecou, saltar, no]);

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [visiveis, prontas, aEscrever]);

  // Regista a tentativa quando se chega a um desfecho.
  useEffect(() => {
    if (!no?.desfecho || !prontas || registado.current) return;
    registado.current = true;
    registarTentativa(simulacao.id, no.desfecho, caminho).catch(() => {});
  }, [no, prontas, caminho, simulacao.id]);

  const escolher = useCallback((proximo: string) => {
    setCaminho((a) => [...a, proximo]);
    setNoAtual(proximo);
  }, []);

  function recomecar() {
    registado.current = false;
    setVisiveis([]);
    setCaminho(["inicio"]);
    setProntasEm(null);
    setSaltar(false);
    setNoAtual("inicio");
  }

  if (!comecou) {
    return (
      <div className="mx-auto max-w-xl">
        <Link
          href="/simulacoes"
          className="text-sm text-ink-600 hover:text-ink-900"
        >
          ← Simulações
        </Link>

        <div className="mt-6 rounded-xl border border-ink-200 bg-white p-8 text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#1668D9]/10 text-[#1668D9]">
            <Icone size={20} aria-hidden="true" />
          </span>

          <h1 className="mt-5 text-xl font-semibold text-ink-900">
            {simulacao.titulo}
          </h1>

          <p className="mx-auto mt-3 max-w-sm text-justify text-sm leading-relaxed text-ink-600">
            {simulacao.contexto}
          </p>

          <p className="mt-6 text-sm text-ink-500">
            Isto acontece em tempo real. Decide como decidirias na vida.
          </p>

          <button
            type="button"
            onClick={() => setComecou(true)}
            className="mt-5 rounded-lg bg-[#1668D9] px-7 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Começar
          </button>
        </div>
      </div>
    );
  }

  const terminou = no?.desfecho && prontas;

  const corDesfecho =
    no?.desfecho === "SEGURO"
      ? {
          borda: "border-[#17864F]/30",
          fundo: "bg-[#17864F]/5",
          texto: "text-[#17864F]",
        }
      : no?.desfecho === "COMPROMETIDO"
        ? {
            borda: "border-[#C4302B]/30",
            fundo: "bg-[#C4302B]/5",
            texto: "text-[#C4302B]",
          }
        : {
            borda: "border-ink-300",
            fundo: "bg-ink-50",
            texto: "text-ink-700",
          };

  return (
    <div className="mx-auto max-w-xl">
      <div className="overflow-hidden rounded-2xl border border-ink-300 bg-white shadow-sm">
        <div className="flex items-center gap-3 border-b border-ink-200 bg-ink-50 px-4 py-3">
          <Icone
            size={16}
            className="shrink-0 text-ink-500"
            aria-hidden="true"
          />
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink-900">
            {simulacao.remetente}
          </span>
          <span className="shrink-0 text-xs tabular-nums text-ink-500">
            {hora}
          </span>
        </div>

        <div className="min-h-[280px] space-y-3 p-4">
          {visiveis.map((m, i) =>
            ehNarracao(m.texto) ? (
              <p
                key={i}
                className="animate-[fadeIn_240ms_ease-out] py-1 text-center text-sm italic text-ink-500"
              >
                {limpar(m.texto)}
              </p>
            ) : (
              <div key={i} className="animate-[fadeIn_240ms_ease-out]">
                <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-ink-100 px-4 py-2.5">
                  <p className="text-justify text-[15px] leading-relaxed text-ink-900">
                    {m.texto}
                  </p>
                </div>
                <span className="mt-1 block text-xs text-ink-400">
                  {m.hora}
                </span>
              </div>
            ),
          )}

          {aEscrever && (
            <div className="flex w-fit gap-1 rounded-2xl rounded-tl-sm bg-ink-100 px-4 py-3.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400"
                  style={{ animationDelay: `${i * 150}ms` }}
                />
              ))}
            </div>
          )}

          <div ref={fim} />
        </div>

        {!terminou && prontas && no?.escolhas && no.escolhas.length > 0 && (
          <div className="space-y-2 border-t border-ink-200 bg-ink-50 p-4">
            {no.escolhas.map((escolha) => (
              <button
                key={escolha.id}
                type="button"
                onClick={() => escolher(escolha.proximo)}
                className="w-full rounded-lg border border-ink-300 bg-white p-3.5 text-left text-sm leading-snug text-ink-800 transition-colors hover:border-[#1668D9] hover:bg-[#1668D9]/5"
              >
                {escolha.texto}
              </button>
            ))}
          </div>
        )}

        {!prontas && !saltar && (
          <div className="border-t border-ink-200 bg-ink-50 px-4 py-3 text-center">
            <button
              type="button"
              onClick={() => setSaltar(true)}
              className="inline-flex items-center gap-1.5 text-xs text-ink-500 hover:text-ink-800"
            >
              <ChevronsRight size={13} aria-hidden="true" />
              Mostrar tudo
            </button>
          </div>
        )}
      </div>

      {terminou && (
        <div
          className={`mt-5 rounded-xl border p-6 ${corDesfecho.borda} ${corDesfecho.fundo}`}
        >
          <p
            className={`flex items-center gap-2 font-medium ${corDesfecho.texto}`}
          >
            {no.desfecho === "SEGURO" ? (
              <Check size={17} aria-hidden="true" />
            ) : no.desfecho === "COMPROMETIDO" ? (
              <ShieldAlert size={17} aria-hidden="true" />
            ) : (
              <TriangleAlert size={17} aria-hidden="true" />
            )}
            {no.desfecho === "SEGURO"
              ? "Conta protegida"
              : no.desfecho === "COMPROMETIDO"
                ? "Conta comprometida"
                : "Escapaste por pouco"}
          </p>

          <p className="mt-3 text-justify text-sm leading-relaxed text-ink-700">
            {no.desenlace}
          </p>

          <p className="mt-4 border-l-2 border-ink-300 pl-3 text-justify text-sm leading-relaxed text-ink-800">
            {simulacao.licao}
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={recomecar}
              className="rounded-lg border border-ink-300 bg-white px-5 py-2.5 text-sm font-medium text-ink-800 transition-colors hover:border-ink-400"
            >
              Tentar outro caminho
            </button>
            <Link
              href="/simulacoes"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1668D9] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Voltar às simulações
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
