import Link from "next/link";
import { Target, BookOpen, MessageSquare, LineChart } from "lucide-react";

const FUNCIONALIDADES = [
  {
    Icone: Target,
    titulo: "Diagnóstico pessoal",
    descricao: "Descobre o teu nível real de vulnerabilidade antes de começar.",
  },
  {
    Icone: BookOpen,
    titulo: "Lições em 3 minutos",
    descricao:
      "Conteúdos curtos sobre phishing, palavras-passe e autenticação.",
  },
  {
    Icone: MessageSquare,
    titulo: "Simulações reais",
    descricao:
      "Conversas que imitam ataques reais, em quatro canais distintos.",
  },
  {
    Icone: LineChart,
    titulo: "Registo do teu percurso",
    descricao: "Compara o teu desempenho antes e depois da formação.",
  },
];

const NUMEROS = [
  {
    valor: "54,5%",
    etiqueta: "dos estudantes do ISAF já clicaram num link fraudulento",
  },
  {
    valor: "78,8%",
    etiqueta: "reutilizam a mesma palavra-passe em várias contas",
  },
  {
    valor: "84,8%",
    etiqueta: "consideram que manuais e palestras não mudam os seus hábitos",
  },
];

export default function Landing() {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-hidden">
      {/* Fundo: gradiente sempre presente, vídeo por cima quando carrega.
          Se o vídeo falhar ou o utilizador pedir menos movimento,
          o gradiente fica à vista sem precisar de JavaScript. */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--color-fundo)_0%,var(--color-superficie)_55%,var(--color-salva)_100%)]" />
        <video
          className="h-full w-full object-cover object-center motion-reduce:hidden"
          src="/Animacaosite.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgb(19_28_43/0.78)_0%,rgb(19_28_43/0.58)_40%,rgb(19_28_43/0.88)_100%)]" />
      </div>

      <header className="flex items-center justify-between border-b border-texto/10 px-5 py-4 sm:px-8">
        <span className="text-xl font-bold tracking-tight text-texto">
          Click<span className="text-acento">Seguro</span>
        </span>
        <nav className="flex items-center gap-2">
          <Link
            href="/entrar"
            className="rounded-campo px-4 py-2 text-sm text-texto/80 transition-colors hover:bg-texto/8 hover:text-texto"
          >
            Entrar
          </Link>
          <Link
            href="/registo"
            className="rounded-campo bg-acento px-4 py-2 text-sm font-semibold text-acento-contraste transition-colors hover:bg-acento-forte"
          >
            Começar grátis
          </Link>
        </nav>
      </header>

      <section className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-5 py-20 text-center sm:px-8 md:items-start md:text-left">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-acento">
          Capacitação em segurança digital
        </p>
        <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-texto sm:text-5xl md:text-6xl">
          O atacante não força a porta.
          <br />
          <span className="text-acento">Pede a chave.</span>
        </h1>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-texto/75 md:text-lg">
          Click Seguro treina a tua capacidade de decisão em situações reais de
          engenharia social, em menos de três minutos por dia.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3 md:justify-start">
          <Link
            href="/registo"
            className="rounded-campo bg-acento px-8 py-3.5 font-bold text-acento-contraste transition-colors hover:bg-acento-forte"
          >
            Começar agora
          </Link>
          <Link
            href="/entrar"
            className="rounded-campo border border-texto/40 px-8 py-3.5 font-medium text-texto transition-colors hover:border-texto hover:bg-texto/8"
          >
            Já tenho conta
          </Link>
        </div>
      </section>

      <section className="border-y border-acento/15 bg-superficie/55 px-5 py-14 backdrop-blur-md sm:px-8">
        <div className="mx-auto grid max-w-4xl gap-10 text-center sm:grid-cols-3">
          {NUMEROS.map((n) => (
            <div key={n.valor}>
              <p className="text-4xl font-extrabold leading-none tracking-tight text-acento sm:text-5xl">
                {n.valor}
              </p>
              <p className="mx-auto mt-3 max-w-[13rem] text-sm leading-relaxed text-texto/70">
                {n.etiqueta}
              </p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-xs text-texto/35">
          Inquérito conduzido no ISAF, n = 33 estudantes, 2026.
        </p>
      </section>

      <section className="mx-auto w-full max-w-5xl px-5 py-20 sm:px-8">
        <h2 className="text-center text-2xl font-bold tracking-tight text-texto sm:text-3xl">
          Como funciona
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FUNCIONALIDADES.map(({ Icone, titulo, descricao }) => (
            <div
              key={titulo}
              className="rounded-cartao border border-acento/15 bg-superficie/60 p-6 backdrop-blur-sm transition-colors hover:border-acento/40"
            >
              <Icone size={22} className="text-acento" aria-hidden="true" />
              <h3 className="mt-4 font-bold text-texto">{titulo}</h3>
              <p className="mt-2 text-sm leading-relaxed text-texto/65">
                {descricao}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[linear-gradient(to_bottom,transparent,rgb(19_28_43/0.85))] px-5 py-20 text-center sm:px-8">
        <h2 className="text-2xl font-bold leading-tight tracking-tight text-texto sm:text-3xl">
          O conhecimento técnico não protege.
          <br />O treino sim.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-texto/70">
          Desenvolvido a partir do diagnóstico real dos estudantes do ISAF.
          Gratuito, sem instalação, disponível no telemóvel.
        </p>
        <Link
          href="/registo"
          className="mt-9 inline-block rounded-campo bg-acento px-10 py-4 text-lg font-bold text-acento-contraste transition-colors hover:bg-acento-forte"
        >
          Criar conta gratuita
        </Link>
      </section>

      <footer className="border-t border-texto/8 px-5 py-6 text-center text-xs text-texto/30 sm:px-8">
        © 2026 Click Seguro · ISAF · Igor Sousa Venda
      </footer>
    </div>
  );
}
