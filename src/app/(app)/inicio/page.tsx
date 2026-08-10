import Link from "next/link";
import { obterSessao } from "@/lib/sessao";
import { prisma } from "@/lib/db";

export default async function Inicio() {
  const sessao = await obterSessao();
  const utilizador = sessao!.user;

  const diagnostico = await prisma.avaliacao.findFirst({
    where: { userId: utilizador.id, tipo: "DIAGNOSTICO" },
  });

  const primeiroNome = utilizador.name.split(" ")[0];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-ink-900">
          Olá, {primeiroNome}.
        </h1>
        <p className="mt-1 text-ink-600">
          {diagnostico
            ? "Continua o teu percurso de aprendizagem."
            : "Vamos começar por perceber o que já sabes."}
        </p>
      </div>

      {!diagnostico && (
        <section className="rounded-xl border border-ink-200 bg-white p-6">
          <h2 className="font-semibold text-ink-900">Avaliação diagnóstica</h2>
          <p className="mt-2 max-w-prose text-sm text-ink-600">
            Dez perguntas rápidas sobre palavras-passe, phishing e autenticação
            em duas etapas. Não há nota negativa — serve para medir a tua
            evolução no fim do percurso.
          </p>
          <Link
            href="/diagnostico"
            className="mt-5 inline-flex rounded-lg bg-[#1668D9] px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Começar avaliação
          </Link>
        </section>
      )}

      <section>
        <h2 className="mb-4 font-semibold text-ink-900">Módulos</h2>
        <p className="rounded-xl border border-dashed border-ink-300 p-6 text-sm text-ink-500">
          Os módulos ficam disponíveis depois da avaliação diagnóstica.
        </p>
      </section>
    </div>
  );
}
