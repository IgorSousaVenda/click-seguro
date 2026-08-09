import { z } from "zod";

export const esquemaRegisto = z.object({
  nome: z
    .string()
    .trim()
    .min(3, "O nome deve ter pelo menos 3 caracteres")
    .max(80, "O nome é demasiado longo"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Introduz um endereço de e-mail válido"),
  password: z
    .string()
    .min(10, "A palavra-passe deve ter pelo menos 10 caracteres")
    .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
    .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
    .regex(/[0-9]/, "Deve conter pelo menos um número"),
  curso: z.string().min(1, "Selecciona o teu curso"),
  anoCurricular: z
    .string()
    .min(1, "Selecciona o ano curricular")
    .transform(Number)
    .pipe(z.number().int().min(1).max(4)),
});

export const esquemaLogin = z.object({
  email: z.string().trim().toLowerCase().email("E-mail inválido"),
  password: z.string().min(1, "Introduz a tua palavra-passe"),
});

export type DadosRegisto = z.infer<typeof esquemaRegisto>;
export type DadosLogin = z.infer<typeof esquemaLogin>;
