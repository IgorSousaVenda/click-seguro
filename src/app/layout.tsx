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
    <html lang="pt-AO" className={inter.variable}>
      <body
        className="antialiased bg-ink-50 text-ink-900"
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
