import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Gera .next/standalone: imagem Docker mínima, sem node_modules.
  output: "standalone",

  // Origens autorizadas para o servidor de desenvolvimento quando se testa
  // noutro dispositivo da mesma rede. Lista separada por vírgulas.
  allowedDevOrigins: (process.env.ORIGENS_DEV ?? "")
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean),
};

export default nextConfig;
