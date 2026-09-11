"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LIGACOES = [
  { href: "/inicio", rotulo: "Percurso" },
  { href: "/simulacoes", rotulo: "Simulações" },
  { href: "/progresso", rotulo: "Progresso" },
];

export function NavegacaoApp() {
  const caminho = usePathname();

  return (
    <div className="flex min-w-0 items-center gap-4 sm:gap-8">
      <Link
        href="/inicio"
        className="shrink-0 text-base font-bold tracking-tight text-texto"
      >
        Click<span className="text-acento">Seguro</span>
      </Link>

      <nav className="flex items-center gap-1" aria-label="Navegação principal">
        {LIGACOES.map(({ href, rotulo }) => {
          const ativa = caminho === href || caminho.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              aria-current={ativa ? "page" : undefined}
              className={`rounded-campo px-3 py-1.5 text-sm transition-colors ${
                ativa
                  ? "bg-acento/15 font-medium text-acento"
                  : "text-texto-suave hover:bg-texto/8 hover:text-texto"
              }`}
            >
              {rotulo}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
