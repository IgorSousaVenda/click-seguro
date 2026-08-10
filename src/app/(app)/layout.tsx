import Link from "next/link";
import { redirect } from "next/navigation";
import { obterSessao } from "@/lib/sessao";
import { Sair } from "@/components/sair";

export default async function LayoutApp({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessao = await obterSessao();

  if (!sessao) {
    redirect("/entrar");
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/inicio" className="flex items-center gap-2">
            <img src="/logo-icon.svg" alt="" width={28} height={28} />
            <span className="text-sm font-semibold leading-tight text-ink-900">
              Click
              <br />
              Seguro
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-600 sm:inline">
              {sessao.user.name}
            </span>
            <Sair />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
    </div>
  );
}
