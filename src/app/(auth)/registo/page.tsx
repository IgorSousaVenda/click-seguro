"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, emailOtp } from "@/lib/auth-client";
import {
  esquemaRegisto,
  type EntradaRegisto,
  type SaidaRegisto,
} from "@/lib/validacoes";
import { Campo } from "@/components/ui/campo";
import { Selecao } from "@/components/ui/selecao";
import { Botao } from "@/components/ui/botao";
import { Alerta } from "@/components/ui/alerta";
import { CampoCodigo } from "@/components/ui/campo-codigo";

const CURSOS = [
  "Informática de Gestão Financeira",
  "Contabilidade e Finanças",
  "Gestão Bancária e Seguros",
];

export default function PaginaRegisto() {
  const [erroServidor, setErroServidor] = useState<string | null>(null);
  const [consentiu, setConsentiu] = useState(false);
  const [erroConsentimento, setErroConsentimento] = useState(false);
  const [porVerificar, setPorVerificar] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EntradaRegisto, unknown, SaidaRegisto>({
    resolver: zodResolver(esquemaRegisto),
  });

  async function aoSubmeter(dados: SaidaRegisto) {
    setErroServidor(null);
    if (!consentiu) {
      setErroConsentimento(true);
      return;
    }

    const { error } = await signUp.email({
      name: dados.nome,
      email: dados.email,
      password: dados.password,
      curso: dados.curso,
      anoCurricular: dados.anoCurricular,
    });

    if (error) {
      setErroServidor(
        error.message?.includes("exist")
          ? "Já existe uma conta com este e-mail."
          : "Não foi possível criar a conta.",
      );
      return;
    }

    // A conta já existe e a sessão está aberta; falta confirmar que o
    // endereço é mesmo do estudante antes de o deixar entrar no percurso.
    await emailOtp.sendVerificationOtp({
      email: dados.email,
      type: "email-verification",
    });
    setPorVerificar(dados.email);
  }

  if (porVerificar) {
    return <PassoVerificacao email={porVerificar} />;
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold text-texto">Criar conta</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-texto/60">
        Leva menos de um minuto. Começas com um diagnóstico rápido.
      </p>

      <form
        onSubmit={handleSubmit(aoSubmeter)}
        noValidate
        className="mt-7 flex flex-col gap-4"
      >
        <Campo
          rotulo="Nome completo"
          type="text"
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

        <Selecao
          rotulo="Curso"
          defaultValue=""
          erro={errors.curso?.message}
          {...register("curso")}
        >
          <option value="" disabled>
            Selecciona o teu curso
          </option>
          {CURSOS.map((c) => (
            <option key={c} value={c} className="bg-superficie text-texto">
              {c}
            </option>
          ))}
        </Selecao>

        <Selecao
          rotulo="Ano curricular"
          defaultValue=""
          erro={errors.anoCurricular?.message}
          {...register("anoCurricular")}
        >
          <option value="" disabled>
            Selecciona
          </option>
          {[1, 2, 3, 4].map((a) => (
            <option key={a} value={a} className="bg-superficie text-texto">
              {a}.º ano
            </option>
          ))}
        </Selecao>

        <Campo
          rotulo="Palavra-passe"
          type="password"
          placeholder="Mínimo 10 caracteres"
          autoComplete="new-password"
          dica="Pelo menos 10 caracteres, com maiúscula, minúscula e número."
          erro={errors.password?.message}
          {...register("password")}
        />

        {erroServidor && <Alerta tom="perigo">{erroServidor}</Alerta>}

        <div
          className={`rounded-campo border p-4 transition-colors ${
            erroConsentimento
              ? "border-perigo/50 bg-perigo/8"
              : "border-texto/14 bg-texto/5"
          }`}
        >
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={consentiu}
              onChange={(e) => {
                setConsentiu(e.target.checked);
                if (e.target.checked) setErroConsentimento(false);
              }}
              className="mt-0.5 h-[18px] w-[18px] shrink-0 accent-acento"
            />
            <span className="text-xs leading-relaxed text-texto/70">
              Aceito que sejam recolhidos o meu nome, e-mail, curso, ano
              curricular e os meus resultados nas actividades. Estes dados
              destinam-se exclusivamente ao estudo académico que dá origem a
              esta aplicação, no âmbito do Trabalho de Conclusão de Curso no
              ISAF. Não são partilhados com terceiros nem usados para outro
              fim, e os resultados apresentados no relatório final são
              agregados e anónimos. Posso pedir a eliminação da minha conta e
              de todos os dados associados a qualquer momento, escrevendo para
              igordesousavenda@gmail.com.
            </span>
          </label>
          {erroConsentimento && (
            <p className="ml-[30px] mt-2 text-[13px] text-perigo">
              É necessário aceitar para criar conta.
            </p>
          )}
        </div>

        <Botao type="submit" carregando={isSubmitting} className="h-12 w-full">
          {isSubmitting ? "A criar conta…" : "Criar conta"}
        </Botao>
      </form>

      <p className="mt-6 text-center text-sm text-texto/50">
        Já tens conta?{" "}
        <Link href="/entrar" className="font-semibold text-acento hover:underline">
          Entrar
        </Link>
      </p>
    </>
  );
}

function PassoVerificacao({ email }: { email: string }) {
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [reenviado, setReenviado] = useState(false);

  async function verificar(valor: string) {
    setErro(null);
    setOcupado(true);
    const { error } = await emailOtp.verifyEmail({ email, otp: valor });
    setOcupado(false);

    if (error) {
      setCodigo("");
      setErro(
        error.code === "OTP_EXPIRED"
          ? "O código expirou. Pede um novo."
          : error.code === "TOO_MANY_ATTEMPTS"
            ? "Demasiadas tentativas. Pede um código novo."
            : "Código incorrecto.",
      );
      return;
    }

    router.push("/inicio");
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl font-extrabold text-texto">Confirma o e-mail</h1>
      <p className="mt-1.5 text-sm leading-relaxed text-texto/60">
        A conta foi criada. Falta confirmar o endereço.
      </p>

      <div className="mt-6 flex flex-col gap-4">
        <Alerta tom="info">
          Enviámos um código de seis dígitos para <strong>{email}</strong>. É
          válido durante dez minutos.
        </Alerta>

        <CampoCodigo
          valor={codigo}
          aoMudar={setCodigo}
          aoCompletar={verificar}
          erro={erro ?? undefined}
          desativado={ocupado}
        />

        <Botao
          type="button"
          carregando={ocupado}
          disabled={codigo.length < 6}
          onClick={() => verificar(codigo)}
          className="h-12 w-full"
        >
          {ocupado ? "A verificar…" : "Confirmar e começar"}
        </Botao>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => router.push("/inicio")}
            className="text-texto-suave hover:text-texto hover:underline"
          >
            Confirmar mais tarde
          </button>
          <button
            type="button"
            disabled={ocupado || reenviado}
            onClick={async () => {
              await emailOtp.sendVerificationOtp({
                email,
                type: "email-verification",
              });
              setReenviado(true);
            }}
            className="text-acento hover:underline disabled:opacity-50 disabled:hover:no-underline"
          >
            {reenviado ? "Código reenviado" : "Reenviar código"}
          </button>
        </div>
      </div>
    </>
  );
}
