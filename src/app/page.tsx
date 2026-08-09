import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 p-6">
      <img src="/logo-horizontal.svg" alt="Click Seguro" className="h-16" />

      <p className="text-ink-500 text-center max-w-sm">
        Aprende a reconhecer fraudes digitais em lições de três minutos.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
        <Link
          href="/registo"
          className="flex-1 h-12 inline-flex items-center justify-center rounded-btn bg-brand-500 text-white text-sm font-medium transition-all duration-150 hover:bg-brand-600 active:scale-[.97]"
        >
          Criar conta
        </Link>
        <Link
          href="/entrar"
          className="flex-1 h-12 inline-flex items-center justify-center rounded-btn bg-white text-brand-500 border border-brand-200 text-sm font-medium transition-all duration-150 hover:bg-brand-50 active:scale-[.97]"
        >
          Entrar
        </Link>
      </div>
    </main>
  );
}
