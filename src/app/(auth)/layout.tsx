export default function LayoutAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Esquerda — texto sobre o vídeo */}
      <aside className="hidden lg:flex lg:w-[42%] relative flex-col items-start justify-center p-12">
        <img
          src="/logo-horizontal.svg"
          alt="Click Seguro"
          className="h-12 w-auto absolute top-12 left-12 [filter:brightness(0)_invert(1)]"
        />
        <div className="max-w-sm">
          <p className="text-white text-2xl font-medium leading-snug">
            Em segurança digital, o elo mais frágil não é a tecnologia.
          </p>
          <p className="text-white/60 text-base mt-4 leading-relaxed">
            É por isso que aprender a reconhecer um ataque vale mais do que
            qualquer antivírus.
          </p>
        </div>
        <p className="text-white/40 text-[13px] absolute bottom-12 left-12">
          Instituto Superior Politécnico de Administração e Finanças
        </p>
      </aside>

      {/* Direita — card acrílico com o formulário */}
      <main className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            background: "rgba(51,65,85,0.55)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderRadius: "20px",
            border: "1px solid rgba(242,230,214,.12)",
            padding: "2.5rem",
            boxShadow: "0 24px 64px rgba(0,0,0,.35)",
          }}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
