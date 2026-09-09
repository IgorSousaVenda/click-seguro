"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const FEATURES = [
  {
    icon: "🎯",
    titulo: "Diagnóstico pessoal",
    descricao: "Descobre o teu nível real de vulnerabilidade antes de começar.",
  },
  {
    icon: "📖",
    titulo: "Lições em 3 minutos",
    descricao:
      "Conteúdos curtos sobre phishing, palavras-passe e autenticação.",
  },
  {
    icon: "💬",
    titulo: "Simulações reais",
    descricao:
      "Conversas que imitam ataques reais, em quatro canais distintos.",
  },
  {
    icon: "📊",
    titulo: "Registo do teu percurso",
    descricao: "Compara o teu desempenho antes e depois da formação.",
  },
];

const STATS = [
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

export default function Onboarding() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoErro, setVideoErro] = useState(false);
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisivel(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="cs-root">
      {/* ── Vídeo de fundo ── */}
      <div className="cs-video-wrap" aria-hidden="true">
        {!videoErro ? (
          <video
            ref={videoRef}
            className="cs-video"
            src="/Animacaosite.mp4"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoErro(true)}
          />
        ) : (
          <div className="cs-video-fallback" />
        )}
        <div className="cs-overlay" />
      </div>

      {/* ── Navegação ── */}
      <nav className="cs-nav">
        <span className="cs-logo">
          Click<span className="cs-logo-accent">Seguro</span>
        </span>
        <div className="cs-nav-links">
          <Link href="/entrar" className="cs-btn-ghost">
            Entrar
          </Link>
          <Link href="/registo" className="cs-btn-solid">
            Começar grátis
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className={`cs-hero ${visivel ? "cs-hero--visible" : ""}`}>
        <p className="cs-eyebrow">Capacitação em segurança digital</p>
        <h1 className="cs-h1">
          O atacante não força a porta.
          <br />
          <em>Pede a chave.</em>
        </h1>
        <p className="cs-sub">
          Click Seguro treina a tua capacidade de decisão em situações reais de
          engenharia social — em menos de três minutos por dia.
        </p>
        <div className="cs-hero-ctas">
          <Link href="/registo" className="cs-btn-primary">
            Começar agora
          </Link>
          <Link href="/entrar" className="cs-btn-outline">
            Já tenho conta
          </Link>
        </div>
      </section>

      {/* ── Estatísticas ── */}
      <section className="cs-stats-section">
        <div className="cs-stats-grid">
          {STATS.map((s) => (
            <div key={s.valor} className="cs-stat">
              <span className="cs-stat-valor">{s.valor}</span>
              <span className="cs-stat-etiqueta">{s.etiqueta}</span>
            </div>
          ))}
        </div>
        <p className="cs-stats-fonte">
          Inquérito conduzido no ISAF, n = 33 estudantes, 2026.
        </p>
      </section>

      {/* ── Como funciona ── */}
      <section className="cs-features-section">
        <h2 className="cs-h2">Como funciona</h2>
        <div className="cs-features-grid">
          {FEATURES.map((f) => (
            <div key={f.titulo} className="cs-card">
              <span className="cs-card-icon" aria-hidden="true">
                {f.icon}
              </span>
              <h3 className="cs-card-titulo">{f.titulo}</h3>
              <p className="cs-card-descricao">{f.descricao}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="cs-cta-section">
        <h2 className="cs-cta-titulo">
          O conhecimento técnico não protege.
          <br />O treino sim.
        </h2>
        <p className="cs-cta-sub">
          Desenvolvido a partir do diagnóstico real dos estudantes do ISAF.
          Gratuito, sem instalação, disponível no telemóvel.
        </p>
        <Link href="/registo" className="cs-btn-primary cs-btn-lg">
          Criar conta gratuita
        </Link>
      </section>

      {/* ── Rodapé ── */}
      <footer className="cs-footer">
        <span>© 2026 Click Seguro · ISAF · Igor Sousa Venda</span>
      </footer>

      <style>{`
        /* ── Tokens ── */
        .cs-root {
          --navy:   #1E293B;
          --slate:  #334155;
          --sage:   #5C6B66;
          --muted:  #8A7D7B;
          --blush:  #C8A99D;
          --cream:  #F2E6D6;
          --white:  #ffffff;

          font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
          color: var(--cream);
          background: var(--navy);
          min-height: 100svh;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Vídeo ── */
        .cs-video-wrap {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .cs-video {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center;
        }
        .cs-video-fallback {
          width: 100%; height: 100%;
          background: linear-gradient(135deg, var(--navy) 0%, var(--slate) 60%, var(--sage) 100%);
        }
        .cs-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to bottom,
            rgba(30,41,59,.72) 0%,
            rgba(30,41,59,.55) 40%,
            rgba(30,41,59,.80) 100%
          );
        }

        /* ── Nav ── */
        .cs-nav {
          position: relative;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 2rem;
          border-bottom: 1px solid rgba(242,230,214,.10);
        }
        .cs-logo {
          font-size: 1.35rem;
          font-weight: 700;
          letter-spacing: -.02em;
          color: var(--cream);
        }
        .cs-logo-accent { color: var(--blush); }
        .cs-nav-links { display: flex; gap: .75rem; align-items: center; }

        /* ── Botões ── */
        .cs-btn-ghost {
          color: var(--cream);
          opacity: .8;
          text-decoration: none;
          font-size: .9rem;
          padding: .45rem .9rem;
          border-radius: 8px;
          transition: opacity .2s;
        }
        .cs-btn-ghost:hover { opacity: 1; }

        .cs-btn-solid {
          background: var(--blush);
          color: var(--navy);
          text-decoration: none;
          font-size: .9rem;
          font-weight: 600;
          padding: .45rem 1.1rem;
          border-radius: 8px;
          transition: filter .2s;
        }
        .cs-btn-solid:hover { filter: brightness(1.08); }

        .cs-btn-primary {
          display: inline-block;
          background: var(--blush);
          color: var(--navy);
          text-decoration: none;
          font-weight: 700;
          font-size: 1rem;
          padding: .85rem 2.2rem;
          border-radius: 10px;
          transition: filter .2s, transform .15s;
        }
        .cs-btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }

        .cs-btn-outline {
          display: inline-block;
          border: 1.5px solid rgba(242,230,214,.45);
          color: var(--cream);
          text-decoration: none;
          font-weight: 500;
          font-size: 1rem;
          padding: .83rem 2.2rem;
          border-radius: 10px;
          transition: border-color .2s, background .2s;
        }
        .cs-btn-outline:hover {
          border-color: var(--cream);
          background: rgba(242,230,214,.08);
        }

        .cs-btn-lg { font-size: 1.1rem; padding: 1rem 2.8rem; }

        /* ── Hero ── */
        .cs-hero {
          position: relative;
          z-index: 5;
          min-height: 88svh;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: flex-start;
          padding: 4rem 2rem 3rem;
          max-width: 780px;
          margin: 0 auto;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity .7s ease, transform .7s ease;
        }
        .cs-hero--visible { opacity: 1; transform: none; }

        .cs-eyebrow {
          font-size: .8rem;
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
          color: var(--blush);
          margin-bottom: 1.4rem;
        }
        .cs-h1 {
          font-size: clamp(2.4rem, 6vw, 4.2rem);
          font-weight: 800;
          line-height: 1.08;
          letter-spacing: -.03em;
          color: var(--cream);
          margin: 0 0 1.4rem;
        }
        .cs-h1 em {
          font-style: normal;
          color: var(--blush);
        }
        .cs-sub {
          font-size: clamp(1rem, 2vw, 1.2rem);
          line-height: 1.65;
          color: rgba(242,230,214,.78);
          max-width: 560px;
          margin-bottom: 2.4rem;
        }
        .cs-hero-ctas { display: flex; gap: 1rem; flex-wrap: wrap; }

        /* ── Estatísticas ── */
        .cs-stats-section {
          position: relative;
          z-index: 5;
          background: rgba(51,65,85,.60);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-top: 1px solid rgba(200,169,157,.18);
          border-bottom: 1px solid rgba(200,169,157,.18);
          padding: 3.5rem 2rem;
        }
        .cs-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 2.5rem;
          max-width: 900px;
          margin: 0 auto 1rem;
          text-align: center;
        }
        .cs-stat { display: flex; flex-direction: column; gap: .5rem; }
        .cs-stat-valor {
          font-size: clamp(2.2rem, 5vw, 3.2rem);
          font-weight: 800;
          color: var(--blush);
          letter-spacing: -.04em;
          line-height: 1;
        }
        .cs-stat-etiqueta {
          font-size: .88rem;
          line-height: 1.5;
          color: rgba(242,230,214,.70);
          max-width: 200px;
          margin: 0 auto;
        }
        .cs-stats-fonte {
          text-align: center;
          font-size: .75rem;
          color: rgba(242,230,214,.35);
          margin-top: 1.5rem;
        }

        /* ── Funcionalidades ── */
        .cs-features-section {
          position: relative;
          z-index: 5;
          padding: 5rem 2rem;
          max-width: 1000px;
          margin: 0 auto;
        }
        .cs-h2 {
          font-size: clamp(1.7rem, 4vw, 2.5rem);
          font-weight: 700;
          letter-spacing: -.025em;
          color: var(--cream);
          margin-bottom: 2.5rem;
          text-align: center;
        }
        .cs-features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
          gap: 1.5rem;
        }
        .cs-card {
          background: rgba(30,41,59,.65);
          border: 1px solid rgba(200,169,157,.15);
          border-radius: 16px;
          padding: 2rem 1.5rem;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          flex-direction: column;
          gap: .75rem;
          transition: border-color .25s, transform .2s;
        }
        .cs-card:hover {
          border-color: rgba(200,169,157,.4);
          transform: translateY(-3px);
        }
        .cs-card-icon { font-size: 1.8rem; }
        .cs-card-titulo {
          font-size: 1rem;
          font-weight: 700;
          color: var(--cream);
          margin: 0;
        }
        .cs-card-descricao {
          font-size: .88rem;
          line-height: 1.6;
          color: rgba(242,230,214,.65);
          margin: 0;
        }

        /* ── CTA final ── */
        .cs-cta-section {
          position: relative;
          z-index: 5;
          text-align: center;
          padding: 6rem 2rem 5rem;
          background: linear-gradient(to bottom, transparent, rgba(30,41,59,.8));
        }
        .cs-cta-titulo {
          font-size: clamp(1.6rem, 3.5vw, 2.4rem);
          font-weight: 700;
          line-height: 1.25;
          color: var(--cream);
          margin: 0 0 1.2rem;
          letter-spacing: -.02em;
        }
        .cs-cta-sub {
          font-size: 1rem;
          color: rgba(242,230,214,.68);
          max-width: 480px;
          margin: 0 auto 2.5rem;
          line-height: 1.65;
        }

        /* ── Rodapé ── */
        .cs-footer {
          position: relative;
          z-index: 5;
          text-align: center;
          padding: 1.5rem 2rem;
          font-size: .78rem;
          color: rgba(242,230,214,.28);
          border-top: 1px solid rgba(242,230,214,.07);
        }

        /* ── Movimento reduzido ── */
        @media (prefers-reduced-motion: reduce) {
          .cs-video { display: none; }
          .cs-video-fallback { display: block !important; }
          .cs-hero { transition: none; opacity: 1; transform: none; }
          .cs-card { transition: none; }
        }

        /* ── Mobile ── */
        @media (max-width: 600px) {
          .cs-nav { padding: 1rem; }
          .cs-hero { padding: 3rem 1.25rem 2rem; align-items: center; text-align: center; }
          .cs-h1 { text-align: center; }
          .cs-sub { text-align: center; }
          .cs-hero-ctas { justify-content: center; }
          .cs-features-section { padding: 3rem 1.25rem; }
          .cs-cta-section { padding: 4rem 1.25rem 3.5rem; }
        }
      `}</style>
    </div>
  );
}
