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
import { exigirSessao } from "@/lib/sessao";
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
  const sessao = await exigirSessao();
  const userId = sessao.user.id;

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
        <h1 className="text-2xl font-semibold text-texto">Simulações</h1>
        <p className="mt-2 text-justify leading-relaxed text-texto-suave">
          Situações que acontecem em tempo real, com decisões que mudam o
          desfecho. Nem todas são fraude: faz parte do exercício distinguir.
        </p>
      </div>

      {!acesso.fezDiagnostico && (
        <p className="rounded-cartao border border-dashed border-contorno-forte p-6 text-sm text-texto-tenue">
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
                      ? "bg-superficie-3 text-texto-tenue"
                      : "bg-acento/15 text-acento"
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
                    <span className="font-medium text-texto">
                      {sim.titulo}
                    </span>
                    <span className="rounded border border-contorno px-1.5 py-0.5 text-xs text-texto-tenue">
                      {nomeCanal[sim.canal as keyof typeof nomeCanal] ??
                        sim.canal}
                    </span>
                  </span>

                  <span className="mt-1 block text-justify text-sm leading-relaxed text-texto-suave">
                    {bloqueada
                      ? `Conclui o módulo ${sim.moduloMinimo - 1} para desbloquear.`
                      : sim.contexto}
                  </span>

                  {ultima && !bloqueada && (
                    <span
                      className={`mt-2 inline-block text-sm ${
                        ultima.desfecho === "SEGURO"
                          ? "text-sucesso"
                          : ultima.desfecho === "COMPROMETIDO"
                            ? "text-perigo"
                            : "text-texto-tenue"
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
                    className="shrink-0 text-texto-tenue"
                    aria-hidden="true"
                  />
                )}
              </>
            );

            if (bloqueada) {
              return (
                <div
                  key={sim.id}
                  className="flex items-start gap-4 rounded-cartao border border-contorno bg-superficie-2 p-5 opacity-60"
                >
                  {corpo}
                </div>
              );
            }

            return (
              <Link
                key={sim.id}
                href={`/simulacoes/${sim.slug}`}
                className="flex items-start gap-4 rounded-cartao border border-contorno bg-superficie-2 p-5 transition-colors hover:border-contorno-forte"
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
