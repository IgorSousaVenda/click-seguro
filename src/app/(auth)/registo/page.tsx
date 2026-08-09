"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { Campo } from "@/components/ui/campo";
import { Botao } from "@/components/ui/botao";
import { z } from "zod";
import { esquemaRegisto } from "@/lib/validacoes";

const CURSOS = [
  "Informática de Gestão Financeira",
  "Contabilidade e Finanças",
  "Gestão Bancária e Seguros",
];

export default function PaginaRegisto() {
  const router = useRouter();
  const [erroServidor, setErroServidor] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(esquemaRegisto),
  });

  async function aoSubmeter(dados: z.output<typeof esquemaRegisto>) {
    setErroServidor(null);

    const { error } = await signUp.email({
      name: dados.nome,
      email: dados.email,
      password: dados.password,
    });

    if (error) {
      console.error("Erro do Better Auth:", error);
      setErroServidor(
        error.message?.includes("exist")
          ? "Já existe uma conta com este e-mail."
          : "Não foi possível criar a conta. Tenta novamente.",
      );
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
        Criar conta
      </h1>
      <p className="text-ink-500 mt-2 mb-8">
        Leva menos de um minuto. Começas com um diagnóstico rápido.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit(aoSubmeter)(e);
        }}
        className="space-y-5"
        noValidate
      >
        <Campo
          rotulo="Nome completo"
          placeholder="Igor Sousa Venda"
          autoComplete="name"
          erro={errors.nome?.message}
          {...register("nome")}
        />

        <Campo
          rotulo="E-mail"
          type="email"
          placeholder="nome@exemplo.com"
          autoComplete="email"
          erro={errors.email?.message}
          {...register("email")}
        />

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            Curso
          </label>
          <select
            className="w-full h-12 px-4 text-base rounded-btn bg-white border border-ink-100 hover:border-ink-300 focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(22,104,217,.18)] transition-colors"
            defaultValue=""
            {...register("curso")}
          >
            <option value="" disabled>
              Selecciona o teu curso
            </option>
            {CURSOS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.curso && (
            <p className="mt-2 text-[13px] text-danger">
              {errors.curso.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-ink-700 mb-2">
            Ano curricular
          </label>
          <select
            className="w-full h-12 px-4 text-base rounded-btn bg-white border border-ink-100 hover:border-ink-300 focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(22,104,217,.18)] transition-colors"
            defaultValue=""
            {...register("anoCurricular")}
          >
            <option value="" disabled>
              Selecciona
            </option>
            {[1, 2, 3, 4].map((a) => (
              <option key={a} value={a}>
                {a}.º ano
              </option>
            ))}
          </select>
        </div>

        <Campo
          rotulo="Palavra-passe"
          type="password"
          placeholder="Mínimo 10 caracteres"
          autoComplete="new-password"
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
          {isSubmitting ? "A criar conta" : "Criar conta"}
        </Botao>
      </form>

      <p className="text-center text-sm text-ink-500 mt-6">
        Já tens conta?{" "}
        <Link
          href="/entrar"
          className="text-brand-500 font-medium hover:underline"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
