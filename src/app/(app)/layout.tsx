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
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column" }}>

      <header style={{
        borderBottom: "1px solid rgba(242,230,214,.12)",
        background: "rgba(30,41,59,0.65)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}>
        <div style={{
          maxWidth: "64rem", margin: "0 auto",
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem", padding: "1rem 1.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
            <Link href="/inicio" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo-icon.svg" alt="" width={28} height={28}
                style={{ filter: "brightness(0) invert(1)", opacity: 0.9 }} />
              <span style={{ fontSize: "0.85rem", fontWeight: 700, lineHeight: 1.2, color: "#F2E6D6" }}>
                Click<br />Seguro
              </span>
            </Link>
            <nav style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
              <Link href="/inicio" style={{ fontSize: "0.88rem", color: "rgba(242,230,214,.70)", textDecoration: "none" }}>Percurso</Link>
              <Link href="/simulacoes" style={{ fontSize: "0.88rem", color: "rgba(242,230,214,.70)", textDecoration: "none" }}>Simulações</Link>
              <Link href="/progresso" style={{ fontSize: "0.88rem", color: "rgba(242,230,214,.70)", textDecoration: "none" }}>Progresso</Link>
            </nav>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.85rem", color: "rgba(242,230,214,.60)" }}>
              {sessao.user.name}
            </span>
            <Sair />
          </div>
        </div>
      </header>

      <div style={{ flex: 1, padding: "2rem 1.5rem" }}>
        <div style={{
          maxWidth: "64rem",
          margin: "0 auto",
          background: "rgba(255,255,255,0.82)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          borderRadius: "20px",
          border: "1px solid rgba(255,255,255,.50)",
          padding: "2.5rem",
          boxShadow: "0 8px 40px rgba(0,0,0,.18)",
          minHeight: "calc(100svh - 10rem)",
        }}>
          {children}
        </div>
      </div>

    </div>
  );
}
