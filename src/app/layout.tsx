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
    // O atributo abaixo existe porque alguns navegadores móveis injectam
    // atributos no elemento html antes do React arrancar. Aplica-se apenas
    // a este elemento e não afecta a verificação do conteúdo da aplicação.
    <html lang="pt-AO" className={inter.variable} suppressHydrationWarning>
      <body className="antialiased bg-ink-50 text-ink-900">{children}</body>
    </html>
  );
}
