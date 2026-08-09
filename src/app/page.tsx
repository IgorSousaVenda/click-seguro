export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 p-6">
      <img src="/logo-horizontal.svg" alt="Click Seguro" className="h-16" />
      <button className="h-11 px-5 rounded-btn bg-brand-500 text-white text-sm font-medium transition-transform duration-100 active:scale-[.97] hover:bg-brand-600">
        Começar diagnóstico
      </button>
    </main>
  );
}
