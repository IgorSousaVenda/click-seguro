import Link from "next/link";
import {
  ArrowRight,
  Lock,
  Mail,
  MessageCircle,
  Phone,
  Smartphone,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { obterSessao } from "@/lib/sessao";
import { obterAcesso } from "@/lib/acesso";

const icones = {
  SMS: Smartphone,
  EMAIL: Mail,
  CHAMADA: Phone,
  WHATSAPP: MessageCircle,
} as const;

const nomeCanal = {
  SMS: "Mensagem",
  EMAIL: "Email",
  CHAMADA: "Chamada",
  WHATSAPP: "WhatsApp",
} as const;

export default async function Simulacoes() {
  const sessao = await obterSessao();
  const userId = sessao!.user.id;

  const acesso = await obterAcesso(userId);

  const simulacoes = await prisma.simulacao.findMany({
    orderBy: { ordem: "asc" },
  });

  const tentativas = await prisma.tentativaSimulacao.findMany({
    where: { userId },
    orderBy: { realizadaEm: "desc" },
  });

  // Quantos módulos foram concluídos por inteiro.
  const modulos = await prisma.modulo.findMany({
    include: { licoes: { select: { id: true } } },
  });
  const concluidas = await prisma.progressoLicao.findMany({
    where: { userId },
    select: { licaoId: true },
  });
  const feitas = new Set(concluidas.map((c) => c.licaoId));
  const modulosCompletos = modulos.filter(
    (m) => m.licoes.length > 0 && m.licoes.every((l) => feitas.has(l.id)),
  ).length;

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">Simulações</h1>
        <p className="mt-2 text-justify leading-relaxed text-ink-600">
          Situações que acontecem em tempo real, com decisões que mudam o
          desfecho. Nem todas são fraude: faz parte do exercício distinguir.
        </p>
      </div>

      {!acesso.fezDiagnostico && (
        <p className="rounded-xl border border-dashed border-ink-300 p-6 text-sm text-ink-500">
          As simulações ficam disponíveis depois da avaliação diagnóstica.
        </p>
      )}

      {acesso.fezDiagnostico && (
        <div className="space-y-3">
          {simulacoes.map((sim) => {
            const Icone = icones[sim.canal as keyof typeof icones] ?? Mail;
            const bloqueada = modulosCompletos < sim.moduloMinimo - 1;
            const ultima = tentativas.find((t) => t.simulacaoId === sim.id);

            const corpo = (
              <>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    bloqueada
                      ? "bg-ink-100 text-ink-400"
                      : "bg-[#1668D9]/10 text-[#1668D9]"
                  }`}
                >
                  {bloqueada ? (
                    <Lock size={15} aria-label="Bloqueada" />
                  ) : (
                    <Icone size={17} aria-hidden="true" />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-ink-900">
                      {sim.titulo}
                    </span>
                    <span className="rounded border border-ink-200 px-1.5 py-0.5 text-xs text-ink-500">
                      {nomeCanal[sim.canal as keyof typeof nomeCanal] ??
                        sim.canal}
                    </span>
                  </span>

                  <span className="mt-1 block text-justify text-sm leading-relaxed text-ink-600">
                    {bloqueada
                      ? `Conclui o módulo ${sim.moduloMinimo - 1} para desbloquear.`
                      : sim.contexto}
                  </span>

                  {ultima && !bloqueada && (
                    <span
                      className={`mt-2 inline-block text-sm ${
                        ultima.desfecho === "SEGURO"
                          ? "text-[#17864F]"
                          : ultima.desfecho === "COMPROMETIDO"
                            ? "text-[#C4302B]"
                            : "text-ink-500"
                      }`}
                    >
                      {ultima.desfecho === "SEGURO"
                        ? "Último desfecho: conta protegida"
                        : ultima.desfecho === "COMPROMETIDO"
                          ? "Último desfecho: conta comprometida"
                          : "Último desfecho: escapaste por pouco"}
                    </span>
                  )}
                </span>

                {!bloqueada && (
                  <ArrowRight
                    size={16}
                    className="shrink-0 text-ink-400"
                    aria-hidden="true"
                  />
                )}
              </>
            );

            if (bloqueada) {
              return (
                <div
                  key={sim.id}
                  className="flex items-start gap-4 rounded-xl border border-ink-200 bg-white p-5 opacity-60"
                >
                  {corpo}
                </div>
              );
            }

            return (
              <Link
                key={sim.id}
                href={`/simulacoes/${sim.slug}`}
                className="flex items-start gap-4 rounded-xl border border-ink-200 bg-white p-5 transition-colors hover:border-ink-300"
              >
                {corpo}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
