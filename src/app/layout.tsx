import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Click Seguro",
    template: "%s · Click Seguro",
  },
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
      <body className="antialiased">{children}</body>
    </html>
  );
}
