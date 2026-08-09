export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <aside className="mesh-bg hidden lg:flex lg:w-[42%] flex-col justify-between p-12">
        <img
          src="/logo-horizontal.svg"
          alt="Click Seguro"
          className="h-12 w-auto self-start [filter:brightness(0)_invert(1)]"
        />
        <div className="max-w-sm">
          <p className="text-white text-2xl font-medium leading-snug">
            Em segurança digital, o elo mais frágil não é a tecnologia.
          </p>
          <p className="text-brand-200 text-base mt-4 leading-relaxed">
            É por isso que aprender a reconhecer um ataque vale mais do que
            qualquer antivírus.
          </p>
        </div>
        <p className="text-brand-200/70 text-[13px]">
          Instituto Superior Politécnico de Administração e Finanças
        </p>
      </aside>

      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-[400px]">{children}</div>
      </main>
    </div>
  );
}
