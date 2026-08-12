"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronsRight,
  Mic,
  MoreVertical,
  Paperclip,
  PhoneOff,
  Reply,
  ShieldAlert,
  Star,
  Trash2,
  TriangleAlert,
  User,
  Video,
} from "lucide-react";
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

type Bolha = { texto: string; hora: string; minha: boolean };

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

function cronometro(segundos: number) {
  const m = Math.floor(segundos / 60);
  const s = segundos % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ConversaSimulacao({
  simulacao,
}: {
  simulacao: SimulacaoDados;
}) {
  const [comecou, setComecou] = useState(false);
  const [noAtual, setNoAtual] = useState("inicio");
  const [bolhas, setBolhas] = useState<Bolha[]>([]);
  const [aEscrever, setAEscrever] = useState(false);
  const [prontasEm, setProntasEm] = useState<string | null>(null);
  const [caminho, setCaminho] = useState<string[]>(["inicio"]);
  const [hora, setHora] = useState<string | null>(null);
  const [saltar, setSaltar] = useState(false);
  const [segundos, setSegundos] = useState(0);

  const prontas = prontasEm === noAtual;
  const fim = useRef<HTMLDivElement>(null);
  const registado = useRef(false);
  const mostrados = useRef(new Set<string>());

  const no = simulacao.nos.find((n) => n.chave === noAtual);
  const canal = simulacao.canal;
  const emChamada = canal === "CHAMADA";
  const atendida = caminho.includes("atendeu");

  useEffect(() => {
    setHora(relogio());
    const id = setInterval(() => setHora(relogio()), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!emChamada || !atendida || no?.desfecho) return;
    const id = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [emChamada, atendida, no?.desfecho]);

  useEffect(() => {
    if (!comecou || !no) return;
    if (mostrados.current.has(noAtual)) return;
    mostrados.current.add(noAtual);

    const semMovimento =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (saltar || semMovimento) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- sincroniza a conversa com a mudanca de no
      setBolhas((a) => [
        ...a,
        ...no.mensagens.map((m) => ({
          texto: m,
          hora: relogio(),
          minha: false,
        })),
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
        setBolhas((a) => [
          ...a,
          { texto: mensagem, hora: relogio(), minha: false },
        ]);

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
  }, [bolhas, prontas, aEscrever]);

  useEffect(() => {
    if (!no?.desfecho || !prontas || registado.current) return;
    registado.current = true;
    registarTentativa(simulacao.id, no.desfecho, caminho).catch(() => {});
  }, [no, prontas, caminho, simulacao.id]);

  const escolher = useCallback(
    (texto: string, proximo: string) => {
      if (!emChamada) {
        setBolhas((a) => [...a, { texto, hora: relogio(), minha: true }]);
      }
      setCaminho((a) => [...a, proximo]);
      setNoAtual(proximo);
    },
    [emChamada],
  );

  function recomecar() {
    registado.current = false;
    mostrados.current.clear();
    setBolhas([]);
    setCaminho(["inicio"]);
    setProntasEm(null);
    setSaltar(false);
    setSegundos(0);
    setNoAtual("inicio");
  }

  if (!comecou) {
    return (
      <div className="mx-auto max-w-md">
        <Link
          href="/simulacoes"
          className="text-sm text-ink-600 hover:text-ink-900"
        >
          ← Simulações
        </Link>

        <div className="mt-6 rounded-xl border border-ink-200 bg-white p-8 text-center">
          <h1 className="text-xl font-semibold text-ink-900">
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

  const terminou = Boolean(no?.desfecho) && prontas;
  const escolhasVisiveis = !terminou && prontas ? (no?.escolhas ?? []) : [];

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
    <div className="mx-auto max-w-md">
      {(canal === "SMS" || canal === "WHATSAPP") && (
        <div className="overflow-hidden rounded-[28px] border-[6px] border-ink-900 bg-[#ECE5DD] shadow-xl">
          <div className="flex items-center justify-between bg-ink-900 px-5 py-1.5 text-[11px] font-medium text-white">
            <span className="tabular-nums">{hora ?? ""}</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-white/70" />
              <span className="h-2 w-3 rounded-sm bg-white/70" />
            </span>
          </div>

          <div className="flex items-center gap-3 bg-[#075E54] px-3 py-2.5 text-white">
            <ChevronLeft size={20} className="shrink-0" aria-hidden="true" />
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20">
              <User size={17} aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">
                {simulacao.remetente}
              </span>
              <span className="block text-xs text-white/70">
                {aEscrever ? "a escrever…" : "em linha"}
              </span>
            </span>
            <Video
              size={18}
              className="shrink-0 opacity-80"
              aria-hidden="true"
            />
            <MoreVertical
              size={18}
              className="shrink-0 opacity-80"
              aria-hidden="true"
            />
          </div>

          <div className="max-h-[52vh] min-h-[320px] space-y-2 overflow-y-auto px-3 py-4">
            {bolhas.map((b, i) =>
              ehNarracao(b.texto) ? (
                <p
                  key={i}
                  className="mx-auto w-fit max-w-[85%] animate-[fadeIn_240ms_ease-out] rounded-md bg-[#FCF4CB] px-3 py-1.5 text-center text-xs italic text-ink-700"
                >
                  {limpar(b.texto)}
                </p>
              ) : (
                <div
                  key={i}
                  className={`flex animate-[fadeIn_240ms_ease-out] ${b.minha ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-2.5 py-1.5 shadow-sm ${
                      b.minha
                        ? "rounded-tr-none bg-[#DCF8C6]"
                        : "rounded-tl-none bg-white"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-[14.5px] leading-snug text-ink-900">
                      {b.texto}
                    </p>
                    <span className="mt-0.5 flex items-center justify-end gap-1 text-[10px] text-ink-500">
                      {b.hora}
                      {b.minha && (
                        <CheckCheck
                          size={12}
                          className="text-[#4FC3F7]"
                          aria-hidden="true"
                        />
                      )}
                    </span>
                  </div>
                </div>
              ),
            )}

            {aEscrever && (
              <div className="flex justify-start">
                <div className="flex gap-1 rounded-lg rounded-tl-none bg-white px-3 py-3 shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-400"
                      style={{ animationDelay: `${i * 150}ms` }}
                    />
                  ))}
                </div>
              </div>
            )}

            <div ref={fim} />
          </div>

          {escolhasVisiveis.length > 0 && (
            <div className="space-y-1.5 border-t border-black/5 bg-[#ECE5DD] px-3 py-2.5">
              {escolhasVisiveis.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => escolher(e.texto, e.proximo)}
                  className="w-full rounded-full border border-[#075E54]/30 bg-white px-4 py-2 text-left text-[13.5px] leading-snug text-ink-800 transition-colors hover:bg-[#DCF8C6]"
                >
                  {e.texto}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2 bg-[#ECE5DD] px-3 pb-3 pt-1">
            <div className="flex flex-1 items-center gap-2 rounded-full bg-white px-3.5 py-2.5">
              <span className="flex-1 text-sm text-ink-400">Mensagem</span>
              <Paperclip
                size={16}
                className="text-ink-400"
                aria-hidden="true"
              />
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#075E54] text-white">
              <Mic size={17} aria-hidden="true" />
            </span>
          </div>
        </div>
      )}

      {canal === "EMAIL" && (
        <div className="overflow-hidden rounded-xl border border-ink-300 bg-white shadow-md">
          <div className="flex items-center justify-between border-b border-ink-200 px-4 py-2.5">
            <ChevronLeft
              size={18}
              className="text-ink-500"
              aria-hidden="true"
            />
            <div className="flex items-center gap-4 text-ink-400">
              <Trash2 size={16} aria-hidden="true" />
              <Star size={16} aria-hidden="true" />
              <MoreVertical size={16} aria-hidden="true" />
            </div>
          </div>

          <div className="border-b border-ink-200 px-5 py-4">
            <h2 className="text-[17px] font-semibold leading-snug text-ink-900">
              {simulacao.titulo}
            </h2>
            <div className="mt-3 flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1668D9]/10 text-sm font-medium text-[#1668D9]">
                {simulacao.remetente.charAt(0).toUpperCase()}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink-900">
                  {simulacao.remetente}
                </span>
                <span className="block text-xs text-ink-500">para mim</span>
              </span>
              <span className="shrink-0 text-xs tabular-nums text-ink-500">
                {hora}
              </span>
            </div>
          </div>

          <div className="max-h-[46vh] min-h-[240px] space-y-3 overflow-y-auto px-5 py-5">
            {bolhas.map((b, i) =>
              ehNarracao(b.texto) ? (
                <p
                  key={i}
                  className="animate-[fadeIn_240ms_ease-out] rounded-md bg-ink-50 px-3 py-2 text-center text-xs italic text-ink-600"
                >
                  {limpar(b.texto)}
                </p>
              ) : (
                <p
                  key={i}
                  className={`animate-[fadeIn_240ms_ease-out] text-justify text-[15px] leading-relaxed ${
                    b.minha
                      ? "border-l-2 border-[#1668D9] pl-3 text-ink-600"
                      : "text-ink-900"
                  }`}
                >
                  {b.minha ? `Acção: ${b.texto}` : b.texto}
                </p>
              ),
            )}

            {aEscrever && (
              <p className="text-sm italic text-ink-400">a carregar…</p>
            )}

            <div ref={fim} />
          </div>

          {escolhasVisiveis.length > 0 && (
            <div className="space-y-2 border-t border-ink-200 bg-ink-50 p-4">
              {escolhasVisiveis.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => escolher(e.texto, e.proximo)}
                  className="flex w-full items-start gap-2.5 rounded-lg border border-ink-300 bg-white p-3 text-left text-sm leading-snug text-ink-800 transition-colors hover:border-[#1668D9] hover:bg-[#1668D9]/5"
                >
                  <Reply
                    size={14}
                    className="mt-0.5 shrink-0 text-ink-400"
                    aria-hidden="true"
                  />
                  {e.texto}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {emChamada && (
        <div className="overflow-hidden rounded-[28px] border-[6px] border-ink-900 bg-ink-900 shadow-xl">
          <div className="flex items-center justify-between px-5 py-1.5 text-[11px] font-medium text-white/70">
            <span className="tabular-nums">{hora ?? ""}</span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-white/50" />
              <span className="h-2 w-3 rounded-sm bg-white/50" />
            </span>
          </div>

          <div className="px-6 pb-6 pt-10 text-center">
            <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-white/10">
              <User size={40} className="text-white/60" aria-hidden="true" />
            </span>

            <p className="mt-5 text-xl font-medium text-white">
              {simulacao.remetente}
            </p>
            <p className="mt-1 text-sm tabular-nums text-white/50">
              {atendida ? cronometro(segundos) : "a chamar…"}
            </p>
          </div>

          <div className="max-h-[38vh] min-h-[180px] space-y-2.5 overflow-y-auto px-5 pb-4">
            {bolhas.map((b, i) =>
              ehNarracao(b.texto) ? (
                <p
                  key={i}
                  className="animate-[fadeIn_240ms_ease-out] text-center text-xs italic text-white/40"
                >
                  {limpar(b.texto)}
                </p>
              ) : (
                <p
                  key={i}
                  className={`animate-[fadeIn_240ms_ease-out] rounded-lg px-3.5 py-2 text-[14.5px] leading-snug ${
                    b.minha
                      ? "bg-white/15 text-white"
                      : "bg-white/5 text-white/90"
                  }`}
                >
                  {b.minha ? `Tu: ${b.texto}` : b.texto}
                </p>
              ),
            )}

            {aEscrever && (
              <div className="flex w-fit gap-1 rounded-lg bg-white/5 px-3.5 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/50"
                    style={{ animationDelay: `${i * 150}ms` }}
                  />
                ))}
              </div>
            )}

            <div ref={fim} />
          </div>

          {escolhasVisiveis.length > 0 && (
            <div className="space-y-2 border-t border-white/10 px-4 py-4">
              {escolhasVisiveis.map((e) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => escolher(e.texto, e.proximo)}
                  className="w-full rounded-full border border-white/20 bg-white/5 px-4 py-2.5 text-left text-[13.5px] leading-snug text-white transition-colors hover:bg-white/15"
                >
                  {e.texto}
                </button>
              ))}
            </div>
          )}

          {atendida && !terminou && (
            <div className="flex flex-col items-center gap-2 pb-6 pt-2">
              <button
                type="button"
                onClick={() => escolher("Desligou a chamada", "desligou")}
                aria-label="Desligar a chamada"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C4302B] transition-transform hover:scale-105 active:scale-95"
              >
                <PhoneOff size={19} className="text-white" aria-hidden="true" />
              </button>
              <span className="text-xs text-white/40">Desligar</span>
            </div>
          )}
        </div>
      )}

      {!prontas && !saltar && (
        <div className="mt-3 text-center">
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

      {terminou && no && (
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
