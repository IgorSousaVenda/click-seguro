import { prisma } from "@/lib/db";

/**
 * O resultado do diagnóstico determina o ponto de entrada no percurso.
 * Abaixo de 35%: começa pelo módulo 1 e avança à medida que conclui.
 * Entre 35% e 70%: módulo 1 disponível, pode saltar para o 2.
 * A partir de 70%: módulos 1 e 2 disponíveis, pode saltar para o 3.
 *
 * Dentro de cada módulo a progressão por mestria mantém-se para todos:
 * o diagnóstico decide por onde se pode começar, não dispensa os quizzes.
 */
export function moduloMaximoDesbloqueado(percentagem: number): number {
  if (percentagem >= 70) return 3;
  if (percentagem >= 35) return 2;
  return 1;
}

export async function obterAcesso(userId: string) {
  const diagnostico = await prisma.avaliacao.findFirst({
    where: { userId, tipo: "DIAGNOSTICO", concluidaEm: { not: null } },
    orderBy: { concluidaEm: "desc" },
  });

  if (!diagnostico) {
    return {
      fezDiagnostico: false,
      percentagem: 0,
      maximoInicial: 1,
      alcancado: 1,
    };
  }

  const percentagem =
    diagnostico.total && diagnostico.total > 0
      ? Math.round(((diagnostico.pontuacao ?? 0) / diagnostico.total) * 100)
      : 0;

  const maximoInicial = moduloMaximoDesbloqueado(percentagem);

  // Um módulo também abre quando o anterior é concluído por inteiro.
  const modulos = await prisma.modulo.findMany({
    orderBy: { ordem: "asc" },
    include: { licoes: { select: { id: true } } },
  });

  const concluidas = await prisma.progressoLicao.findMany({
    where: { userId },
    select: { licaoId: true },
  });

  const feitas = new Set(concluidas.map((c) => c.licaoId));

  let alcancado = maximoInicial;
  for (const modulo of modulos) {
    const completo =
      modulo.licoes.length > 0 && modulo.licoes.every((l) => feitas.has(l.id));
    if (completo && modulo.ordem + 1 > alcancado) {
      alcancado = modulo.ordem + 1;
    }
  }

  return { fezDiagnostico: true, percentagem, maximoInicial, alcancado };
}
