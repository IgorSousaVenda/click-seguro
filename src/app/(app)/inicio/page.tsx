import Link from "next/link";
import { ArrowRight, Check, Clock, Lock } from "lucide-react";
import { prisma } from "@/lib/db";
import { exigirSessao } from "@/lib/sessao";
import { obterAcesso } from "@/lib/acesso";

export default async function Inicio() {
  const sessao = await exigirSessao();
  const userId = sessao.user.id;
  const primeiroNome = sessao.user.name.split(" ")[0];

  const acesso = await obterAcesso(userId);

  const modulos = await prisma.modulo.findMany({
    orderBy: { ordem: "asc" },
    include: { licoes: { select: { id: true } } },
  });

  const concluidas = await prisma.progressoLicao.findMany({
    where: { userId },
    select: { licaoId: true },
  });

  const feitas = new Set(concluidas.map((c) => c.licaoId));
  const totalLicoes = modulos.reduce((s, m) => s + m.licoes.length, 0);
  const tudoConcluido = totalLicoes > 0 && feitas.size === totalLicoes;

  function mensagemDeEntrada() {
    if (acesso.maximoInicial === 3)
      return "O teu resultado mostra uma base sólida. Os dois primeiros módulos ficam disponíveis para consulta, e podes começar directamente pelo terceiro.";
    if (acesso.maximoInicial === 2)
      return "O teu resultado mostra conhecimentos parciais. O primeiro módulo fica disponível, e podes avançar já para o segundo se preferires.";
    return "Vamos começar pelo início. Cada módulo abre à medida que concluis o anterior.";
  }

  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <div>
        <h1 className="text-2xl font-semibold text-texto">
          Olá, {primeiroNome}.
        </h1>
        <p className="mt-1 text-texto-suave">
          {acesso.fezDiagnostico
            ? "Continua o teu percurso de aprendizagem."
            : "Vamos começar por perceber onde estás."}
        </p>
      </div>

      {!acesso.fezDiagnostico ? (
        <section className="rounded-cartao border border-acento/25 bg-acento/8 p-6">
          <h2 className="font-semibold text-texto">Avaliação diagnóstica</h2>
          <p className="mt-2 text-justify text-sm leading-relaxed text-texto/80">
            Dez perguntas para medir o que já sabes. O resultado define por onde
            começas: quem já domina os primeiros temas não precisa de os
            repetir.
          </p>
          <Link
            href="/diagnostico"
            className="mt-4 inline-flex items-center gap-2 rounded-campo bg-acento px-5 py-2.5 text-sm font-medium text-acento-contraste transition-colors hover:bg-acento-forte"
          >
            Começar avaliação
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      ) : (
        <section className="rounded-cartao border border-contorno bg-superficie-2 p-5">
          <p className="text-sm text-texto-suave">
            Diagnóstico:{" "}
            <span className="font-medium text-texto">
              {acesso.percentagem}%
            </span>
          </p>
          <p className="mt-2 text-justify text-sm leading-relaxed text-texto/80">
            {mensagemDeEntrada()}
          </p>
        </section>
      )}

      <section>
        <h2 className="font-semibold text-texto">Módulos</h2>

        {!acesso.fezDiagnostico ? (
          <p className="mt-4 rounded-cartao border border-dashed border-contorno-forte p-6 text-sm text-texto-tenue">
            Os módulos ficam disponíveis depois da avaliação diagnóstica.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {modulos.map((modulo) => {
              const total = modulo.licoes.length;
              const feito = modulo.licoes.filter((l) =>
                feitas.has(l.id),
              ).length;
              const completo = total > 0 && feito === total;
              const bloqueado = modulo.ordem > acesso.alcancado;

              const conteudo = (
                <>
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                      completo
                        ? "bg-sucesso/15 text-sucesso"
                        : bloqueado
                          ? "bg-superficie-3 text-texto-tenue"
                          : "bg-acento/15 text-acento"
                    }`}
                  >
                    {completo ? (
                      <Check size={16} aria-label="Concluído" />
                    ) : bloqueado ? (
                      <Lock size={14} aria-label="Bloqueado" />
                    ) : (
                      modulo.ordem
                    )}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block font-medium text-texto">
                      {modulo.titulo}
                    </span>
                    <span className="mt-0.5 block text-sm text-texto-suave">
                      {modulo.descricao}
                    </span>
                    <span className="mt-2 flex items-center gap-1.5 text-sm text-texto-tenue">
                      {bloqueado ? (
                        "Conclui o módulo anterior para desbloquear"
                      ) : (
                        <>
                          <Clock size={13} aria-hidden="true" />
                          {feito} de {total} lições
                        </>
                      )}
                    </span>
                  </span>

                  {!bloqueado && (
                    <ArrowRight
                      size={16}
                      className="shrink-0 text-texto-tenue"
                      aria-hidden="true"
                    />
                  )}
                </>
              );

              if (bloqueado) {
                return (
                  <div
                    key={modulo.id}
                    className="flex items-center gap-4 rounded-cartao border border-contorno bg-superficie-2 p-5 opacity-60"
                  >
                    {conteudo}
                  </div>
                );
              }

              return (
                <Link
                  key={modulo.id}
                  href={`/modulos/${modulo.slug}`}
                  className="flex items-center gap-4 rounded-cartao border border-contorno bg-superficie-2 p-5 transition-colors hover:border-contorno-forte"
                >
                  {conteudo}
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {tudoConcluido && (
        <section className="rounded-cartao border border-sucesso/25 bg-sucesso/10 p-6">
          <h2 className="font-semibold text-texto">Percurso concluído</h2>
          <p className="mt-2 text-justify text-sm leading-relaxed text-texto/80">
            Passaste por todas as lições. Está na hora de repetir a avaliação e
            ver o que mudou.
          </p>
          <Link
            href="/avaliacao-final"
            className="mt-4 inline-flex items-center gap-2 rounded-campo bg-sucesso px-5 py-2.5 text-sm font-medium text-acento-contraste transition-colors hover:brightness-110"
          >
            Avaliação final
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </section>
      )}
    </div>
  );
}
