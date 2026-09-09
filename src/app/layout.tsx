import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Click Seguro",
  description:
    "Plataforma de microaprendizagem em cibersegurança para estudantes do ISAF",
  icons: { icon: "/logo-icon.svg" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="pt-AO"
      className={inter.variable}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="antialiased">
        {/* Vídeo de fundo global */}
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
          aria-hidden="true"
        >
          <video
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            src="/Animacaosite.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(30,41,59,.80) 0%, rgba(30,41,59,.65) 50%, rgba(30,41,59,.85) 100%)",
            }}
          />
        </div>

        {/* Conteúdo da aplicação */}
        <div style={{ position: "relative", zIndex: 1 }}>{children}</div>
      </body>
    </html>
  );
}
