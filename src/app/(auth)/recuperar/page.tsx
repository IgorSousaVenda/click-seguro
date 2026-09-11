"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { emailOtp } from "@/lib/auth-client";
import { Campo } from "@/components/ui/campo";
import { Botao } from "@/components/ui/botao";
import { Alerta } from "@/components/ui/alerta";
import { CampoCodigo } from "@/components/ui/campo-codigo";
import { esquemaNovaPalavraPasse } from "@/lib/validacoes";

type Passo = "email" | "codigo" | "nova" | "pronto";

export default function PaginaRecuperar() {
  const router = useRouter();
  const [passo, setPasso] = useState<Passo>("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);

  async function pedirCodigo(e?: React.FormEvent) {
    e?.preventDefault();
    setErro(null);

    const limpo = email.trim().toLowerCase();
    if (!limpo.includes("@")) {
      setErro("Introduz um endereço de e-mail válido.");
      return;
    }

    setOcupado(true);
    const { error } = await emailOtp.requestPasswordReset({ email: limpo });
    setOcupado(false);

    if (error && error.status === 429) {
      setErro("Pediste códigos a mais. Espera um minuto.");
      return;
    }
    // Avança sempre: dizer que a conta não existe seria confirmar endereços
    // a quem anda a sondar.
    setPasso("codigo");
  }

  async function definirNova(e: React.FormEvent) {
    e.preventDefault();
    setErro(null);

    const validacao = esquemaNovaPalavraPasse.safeParse({ password: senha });
    if (!validacao.success) {
      setErro(validacao.error.issues[0].message);
      return;
    }

    setOcupado(true);
    const { error } = await emailOtp.resetPassword({
      email: email.trim().toLowerCase(),
      otp: codigo,
      password: senha,
    });
    setOcupado(false);

    if (error) {
      setCodigo("");
      setPasso("codigo");
      setErro(
        error.code === "OTP_EXPIRED"
          ? "O código expirou. Pede um novo."
          : error.code === "TOO_MANY_ATTEMPTS"
            ? "Demasiadas tentativas. Pede um código novo."
            : "Código incorrecto.",
      );
      return;
    }

    setPasso("pronto");
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold text-texto">
        {passo === "pronto" ? "Palavra-passe alterada" : "Repor palavra-passe"}
      </h1>
      <p className="mt-1.5 text-sm leading-relaxed text-texto/60">
        {passo === "email" && "Enviamos um código para o teu e-mail."}
        {passo === "codigo" && "Escreve o código que recebeste."}
        {passo === "nova" && "Escolhe a nova palavra-passe."}
        {passo === "pronto" && "Já podes entrar com a palavra-passe nova."}
      </p>

      <div className="mt-6">
        {passo === "email" && (
          <form onSubmit={pedirCodigo} noValidate className="flex flex-col gap-4">
            <Campo
              rotulo="E-mail"
              type="email"
              placeholder="nome@exemplo.com"
              autoComplete="email"
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              erro={erro ?? undefined}
            />
            <Botao type="submit" carregando={ocupado} className="h-12 w-full">
              {ocupado ? "A enviar…" : "Enviar código"}
            </Botao>
          </form>
        )}

        {passo === "codigo" && (
          <div className="flex flex-col gap-4">
            <Alerta tom="info">
              Se existir uma conta com <strong>{email}</strong>, o código chega
              em segundos. É válido durante dez minutos.
            </Alerta>

            <CampoCodigo
              valor={codigo}
              aoMudar={setCodigo}
              aoCompletar={() => setPasso("nova")}
              erro={erro ?? undefined}
              desativado={ocupado}
            />

            <Botao
              type="button"
              disabled={codigo.length < 6}
              onClick={() => setPasso("nova")}
              className="h-12 w-full"
            >
              Continuar
            </Botao>

            <button
              type="button"
              onClick={() => {
                setPasso("email");
                setCodigo("");
                setErro(null);
              }}
              className="text-center text-sm text-texto-suave hover:text-texto hover:underline"
            >
              Mudar de e-mail
            </button>
          </div>
        )}

        {passo === "nova" && (
          <form onSubmit={definirNova} noValidate className="flex flex-col gap-4">
            <Campo
              rotulo="Nova palavra-passe"
              type="password"
              autoComplete="new-password"
              placeholder="Mínimo 10 caracteres"
              dica="Pelo menos 10 caracteres, com maiúscula, minúscula e número."
              value={senha}
              onChange={(ev) => setSenha(ev.target.value)}
              erro={erro ?? undefined}
            />
            <Botao type="submit" carregando={ocupado} className="h-12 w-full">
              {ocupado ? "A guardar…" : "Guardar palavra-passe"}
            </Botao>
          </form>
        )}

        {passo === "pronto" && (
          <div className="flex flex-col gap-4">
            <Alerta tom="sucesso">
              A palavra-passe foi alterada. As sessões antigas deixaram de ser
              válidas.
            </Alerta>
            <Botao
              type="button"
              onClick={() => router.push("/entrar")}
              className="h-12 w-full"
            >
              Ir para a entrada
            </Botao>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-texto/50">
        Lembraste-te?{" "}
        <Link href="/entrar" className="font-semibold text-acento hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}
