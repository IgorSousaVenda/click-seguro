"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { KeyRound, Mail } from "lucide-react";
import { signIn, emailOtp } from "@/lib/auth-client";
import { esquemaLogin, type DadosLogin } from "@/lib/validacoes";
import { Campo } from "@/components/ui/campo";
import { Botao } from "@/components/ui/botao";
import { Alerta } from "@/components/ui/alerta";
import { CampoCodigo } from "@/components/ui/campo-codigo";

type Via = "palavra-passe" | "codigo";

export default function PaginaLogin() {
  const [via, setVia] = useState<Via>("palavra-passe");

  return (
    <>
      <h1 className="text-2xl font-extrabold text-texto">Entrar</h1>
      <p className="mt-1.5 text-sm text-texto/60">Continua de onde ficaste.</p>

      <div
        className="mt-6 flex gap-1 rounded-campo border border-texto/12 bg-texto/5 p-1"
        role="tablist"
        aria-label="Forma de entrar"
      >
        {(
          [
            ["palavra-passe", "Palavra-passe", KeyRound],
            ["codigo", "Código por e-mail", Mail],
          ] as const
        ).map(([chave, rotulo, Icone]) => (
          <button
            key={chave}
            type="button"
            role="tab"
            aria-selected={via === chave}
            onClick={() => setVia(chave)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-[0.55rem] px-3 py-2 text-sm transition-colors ${
              via === chave
                ? "bg-acento font-semibold text-acento-contraste"
                : "text-texto-suave hover:text-texto"
            }`}
          >
            <Icone size={15} aria-hidden="true" />
            {rotulo}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {via === "palavra-passe" ? <ViaPalavraPasse /> : <ViaCodigo />}
      </div>

      <p className="mt-6 text-center text-sm text-texto/50">
        Ainda não tens conta?{" "}
        <Link href="/registo" className="font-semibold text-acento hover:underline">
          Criar conta
        </Link>
      </p>
    </>
  );
}

function ViaPalavraPasse() {
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
    // Mensagem genérica de propósito: distinguir "e-mail inexistente" de
    // "palavra-passe errada" permitiria enumerar contas.
    if (error) {
      setErroServidor("Credenciais inválidas.");
      return;
    }
    router.push("/inicio");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(aoSubmeter)} noValidate className="flex flex-col gap-4">
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

      {erroServidor && <Alerta tom="perigo">{erroServidor}</Alerta>}

      <Botao type="submit" carregando={isSubmitting} className="mt-1 h-12 w-full">
        {isSubmitting ? "A entrar…" : "Entrar"}
      </Botao>

      <Link
        href="/recuperar"
        className="text-center text-sm text-texto-suave hover:text-texto hover:underline"
      >
        Esqueci-me da palavra-passe
      </Link>
    </form>
  );
}

function ViaCodigo() {
  const router = useRouter();
  const [passo, setPasso] = useState<"email" | "codigo">("email");
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [erro, setErro] = useState<string | null>(null);
  const [ocupado, setOcupado] = useState(false);
  const [reenviado, setReenviado] = useState(false);

  async function pedirCodigo(e?: React.FormEvent) {
    e?.preventDefault();
    setErro(null);

    const limpo = email.trim().toLowerCase();
    if (!limpo.includes("@")) {
      setErro("Introduz um endereço de e-mail válido.");
      return;
    }

    setOcupado(true);
    const { error } = await emailOtp.sendVerificationOtp({
      email: limpo,
      type: "sign-in",
    });
    setOcupado(false);

    // Mesmo resultado exista ou não a conta: confirmar a existência de um
    // e-mail seria dar meio caminho andado a quem anda a sondar.
    if (error && error.status === 429) {
      setErro("Pediste códigos a mais. Espera um minuto.");
      return;
    }
    setPasso("codigo");
  }

  async function entrar(valor: string) {
    setErro(null);
    setOcupado(true);
    const { error } = await signIn.emailOtp({
      email: email.trim().toLowerCase(),
      otp: valor,
    });
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

  if (passo === "email") {
    return (
      <form onSubmit={pedirCodigo} noValidate className="flex flex-col gap-4">
        <Campo
          rotulo="E-mail"
          type="email"
          placeholder="nome@exemplo.com"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          dica="Enviamos um código de seis dígitos. Não precisas da palavra-passe."
          erro={erro ?? undefined}
        />
        <Botao type="submit" carregando={ocupado} className="h-12 w-full">
          {ocupado ? "A enviar…" : "Enviar código"}
        </Botao>
      </form>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Alerta tom="info">
        Enviámos um código para <strong>{email}</strong>. É válido durante dez
        minutos.
      </Alerta>

      <CampoCodigo
        valor={codigo}
        aoMudar={setCodigo}
        aoCompletar={entrar}
        erro={erro ?? undefined}
        desativado={ocupado}
      />

      <Botao
        type="button"
        carregando={ocupado}
        disabled={codigo.length < 6}
        onClick={() => entrar(codigo)}
        className="h-12 w-full"
      >
        {ocupado ? "A verificar…" : "Entrar"}
      </Botao>

      <div className="flex items-center justify-between text-sm">
        <button
          type="button"
          onClick={() => {
            setPasso("email");
            setCodigo("");
            setErro(null);
            setReenviado(false);
          }}
          className="text-texto-suave hover:text-texto hover:underline"
        >
          Mudar de e-mail
        </button>
        <button
          type="button"
          disabled={ocupado || reenviado}
          onClick={async () => {
            await pedirCodigo();
            setReenviado(true);
          }}
          className="text-acento hover:underline disabled:opacity-50 disabled:hover:no-underline"
        >
          {reenviado ? "Código reenviado" : "Reenviar código"}
        </button>
      </div>
    </div>
  );
}
