import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { emailOTP } from "better-auth/plugins/email-otp";
import { prisma } from "@/lib/db";
import { enviarEmail } from "@/lib/email";
import { modeloCodigo } from "@/lib/email-modelos";

const baseURL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";

// Origens adicionais separadas por vírgula, para a rede local durante os
// testes. A origem de produção vem do BETTER_AUTH_URL e não se repete aqui.
const extra = (process.env.ORIGENS_CONFIAVEIS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const VALIDADE_OTP_SEGUNDOS = 10 * 60;

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "sqlite" }),
  baseURL,
  secret: process.env.BETTER_AUTH_SECRET,
  trustedOrigins: [baseURL, ...extra],

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 10,
    requireEmailVerification: false,
  },

  user: {
    // Recolhidos no registo e usados na análise por curso e por ano.
    additionalFields: {
      curso: { type: "string", required: false, input: true },
      anoCurricular: { type: "number", required: false, input: true },
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  advanced: {
    cookiePrefix: "click-seguro",
  },

  // Por omissão o limitador só actua em produção, o que esconde o
  // comportamento durante os testes. Fica activo em ambos.
  // Guardado em memória: chega para uma instância, que é o que corre.
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
  },

  plugins: [
    emailOTP({
      otpLength: 6,
      expiresIn: VALIDADE_OTP_SEGUNDOS,
      allowedAttempts: 5,

      // Guardado cifrado na tabela `verification`. Quem ler a base de dados
      // não fica com códigos utilizáveis.
      storeOTP: "hashed",

      // Entrar por código só funciona para quem já tem conta: o registo faz-se
      // pelo formulário, onde se recolhe o consentimento e o curso.
      disableSignUp: true,

      rateLimit: { window: 60, max: 3 },

      async sendVerificationOTP({ email, otp, type }) {
        const { assunto, html, textoAlternativo } = modeloCodigo(
          otp,
          type,
          VALIDADE_OTP_SEGUNDOS / 60,
        );
        await enviarEmail({ para: email, assunto, html, textoAlternativo });
      },
    }),
  ],
});
