"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { esquemaLogin, type DadosLogin } from "@/lib/validacoes";
import { Campo } from "@/components/ui/campo";
import { Botao } from "@/components/ui/botao";

export default function PaginaLogin() {
  const router = useRouter();
  const [erroServidor, setErroServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DadosLogin>({ resolver: zodResolver(esquemaLogin) });

  async function aoSubmeter(dados: DadosLogin) {
    setErroServidor(null);

    const { error } = await signIn.email({
      email: dados.email,
      password: dados.password,
    });

    if (error) {
      setErroServidor("Credenciais inválidas.");
      return;
    }

    router.push("/inicio");
  }

  return (
    <div>
      <img
        src="/logo-horizontal.svg"
        alt="Click Seguro"
        className="h-11 mb-8 lg:hidden"
      />

      <h1 className="text-[26px] font-semibold text-ink-900 tracking-tight">
        Entrar
      </h1>
      <p className="text-ink-500 mt-2 mb-8">Continua de onde ficaste.</p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(aoSubmeter)(e);
        }}
        noValidate
        className="space-y-5"
      >
        <Campo
          rotulo="E-mail"
          type="email"
          placeholder="nome@exemplo.com"
          autoComplete="email"
          erro={errors.email?.message}
          {...register("email")}
        />

        <Campo
          rotulo="Palavra-passe"
          type="password"
          autoComplete="current-password"
          erro={errors.password?.message}
          {...register("password")}
        />

        {erroServidor && (
          <div className="rounded-btn bg-danger-bg border-l-4 border-danger px-4 py-3">
            <p className="text-[14px] text-danger font-medium">
              {erroServidor}
            </p>
          </div>
        )}

        <Botao type="submit" carregando={isSubmitting} className="w-full h-12">
          {isSubmitting ? "A entrar" : "Entrar"}
        </Botao>
      </form>

      <p className="text-center text-sm text-ink-500 mt-6">
        Ainda não tens conta?{" "}
        <Link
          href="/registo"
          className="text-brand-500 font-medium hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </div>
  );
}
