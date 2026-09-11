import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/sessao";
import { NavegacaoApp } from "@/components/navegacao-app";
import { Sair } from "@/components/sair";

export default async function LayoutApp({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await obterSessao();
  if (!sessao) redirect("/entrar");

  const primeiroNome = sessao.user.name.split(" ")[0];

  return (
    <div className="flex min-h-svh flex-col bg-fundo">
      <header className="sticky top-0 z-50 border-b border-contorno bg-superficie/85 backdrop-blur-lg">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-5 py-3 sm:px-6">
          <NavegacaoApp />
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-sm text-texto-suave sm:inline">
              {primeiroNome}
            </span>
            <Sair />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-6 sm:py-10">
        {children}
      </main>

      <footer className="border-t border-contorno px-5 py-5 text-center text-xs text-texto-tenue sm:px-6">
        Click Seguro · ISAF
      </footer>
    </div>
  );
}
