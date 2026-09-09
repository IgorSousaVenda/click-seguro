"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { esquemaLogin, type DadosLogin } from "@/lib/validacoes";
export default function PaginaLogin() {
  const router = useRouter();
  const [erroServidor, setErroServidor] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(esquemaLogin) });
  async function aoSubmeter(dados: DadosLogin) {
    setErroServidor(null);
    const { error } = await signIn.email({ email: dados.email, password: dados.password });
    if (error) { setErroServidor("Credenciais inválidas."); return; }
    router.push("/inicio");
  }
  const ic = "w-full h-12 px-4 text-base rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8A99D]/70 transition-colors";
  const lc = "block text-sm font-medium mb-2 text-[rgba(242,230,214,0.80)]";
  return (
    <>
      <h1 style={{fontSize:"1.7rem",fontWeight:800,color:"#F2E6D6",margin:"0 0 0.35rem"}}>Entrar</h1>
      <p style={{fontSize:"0.88rem",color:"rgba(242,230,214,.62)",margin:"0 0 1.75rem"}}>Continua de onde ficaste.</p>
      <form onSubmit={(e)=>{e.preventDefault();handleSubmit(aoSubmeter)(e);}} noValidate style={{display:"flex",flexDirection:"column",gap:"1.1rem"}}>
        <div>
          <label className={lc}>E-mail</label>
          <input type="email" placeholder="nome@exemplo.com" autoComplete="email" className={ic} {...register("email")} />
          {errors.email && <p style={{marginTop:"0.3rem",fontSize:"0.78rem",color:"#FCA5A5"}}>⚠ {errors.email.message}</p>}
        </div>
        <div>
          <label className={lc}>Palavra-passe</label>
          <input type="password" autoComplete="current-password" className={ic} {...register("password")} />
          {errors.password && <p style={{marginTop:"0.3rem",fontSize:"0.78rem",color:"#FCA5A5"}}>⚠ {errors.password.message}</p>}
        </div>
        {erroServidor && <div style={{borderRadius:"10px",background:"rgba(252,165,165,.1)",border:"1px solid rgba(252,165,165,.3)",padding:"0.75rem 1rem"}}><p style={{margin:0,fontSize:"0.85rem",color:"#FCA5A5"}}>{erroServidor}</p></div>}
        <button type="submit" disabled={isSubmitting} style={{width:"100%",height:"3rem",borderRadius:"12px",background:"#C8A99D",color:"#1E293B",fontWeight:700,fontSize:"1rem",border:"none",cursor:"pointer"}}>
          {isSubmitting ? "A entrar…" : "Entrar →"}
        </button>
      </form>
      <p style={{textAlign:"center",fontSize:"0.84rem",color:"rgba(242,230,214,.50)",marginTop:"1.4rem"}}>
        Ainda não tens conta? <Link href="/registo" style={{color:"#C8A99D",fontWeight:600,textDecoration:"none"}}>Criar conta</Link>
      </p>
    </>
  );
}
