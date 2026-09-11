import Link from "next/link";

export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-svh flex-col lg:flex-row">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(135deg,var(--color-fundo)_0%,var(--color-superficie)_55%,var(--color-salva)_100%)]"
        aria-hidden="true"
      />

      {/* Painel esquerdo — argumento, só em ecrãs largos */}
      <aside className="relative hidden flex-col justify-center p-12 lg:flex lg:w-[42%]">
        <Link
          href="/"
          className="absolute left-12 top-12 text-lg font-bold tracking-tight text-texto"
        >
          Click<span className="text-acento">Seguro</span>
        </Link>

        <div className="max-w-sm">
          <p className="text-2xl font-medium leading-snug text-texto">
            Em segurança digital, o elo mais frágil não é a tecnologia.
          </p>
          <p className="mt-4 text-base leading-relaxed text-texto/60">
            É por isso que aprender a reconhecer um ataque vale mais do que
            qualquer antivírus.
          </p>
        </div>

        <p className="absolute bottom-12 left-12 text-[13px] text-texto/40">
          Instituto Superior Politécnico de Administração e Finanças
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[28rem] rounded-painel border border-texto/12 bg-superficie/60 p-8 shadow-painel backdrop-blur-xl sm:p-10">
          <Link
            href="/"
            className="mb-8 inline-block text-lg font-bold tracking-tight text-texto lg:hidden"
          >
            Click<span className="text-acento">Seguro</span>
          </Link>
          {children}
        </div>
      </main>
    </div>
  );
}
