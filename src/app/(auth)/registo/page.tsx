"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp } from "@/lib/auth-client";
import { z } from "zod";
import { esquemaRegisto } from "@/lib/validacoes";
const CURSOS = ["Informática de Gestão Financeira","Contabilidade e Finanças","Gestão Bancária e Seguros"];
export default function PaginaRegisto() {
  const router = useRouter();
  const [erroServidor, setErroServidor] = useState<string | null>(null);
  const [consentiu, setConsentiu] = useState(false);
  const [erroConsentimento, setErroConsentimento] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(esquemaRegisto) });
  async function aoSubmeter(dados: z.output<typeof esquemaRegisto>) {
    setErroServidor(null);
    if (!consentiu) { setErroConsentimento(true); return; }
    const { error } = await signUp.email({ name: dados.nome, email: dados.email, password: dados.password });
    if (error) { setErroServidor(error.message?.includes("exist") ? "Já existe uma conta com este e-mail." : "Não foi possível criar a conta."); return; }
    router.push("/inicio");
  }
  const ic = "w-full h-12 px-4 text-base rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-[#C8A99D]/70 transition-colors";
  const lc = "block text-sm font-medium mb-2 text-[rgba(242,230,214,0.80)]";
  return (
    <>
      <h1 style={{fontSize:"1.7rem",fontWeight:800,color:"#F2E6D6",margin:"0 0 0.35rem"}}>Criar conta</h1>
      <p style={{fontSize:"0.88rem",color:"rgba(242,230,214,.62)",margin:"0 0 1.75rem",lineHeight:1.5}}>Leva menos de um minuto. Começas com um diagnóstico rápido.</p>
      <form onSubmit={(e)=>{e.preventDefault();handleSubmit(aoSubmeter)(e);}} noValidate style={{display:"flex",flexDirection:"column",gap:"1rem"}}>
        <div>
          <label className={lc}>Nome completo</label>
          <input type="text" placeholder="Igor Sousa Venda" autoComplete="name" className={ic} {...register("nome")} />
          {errors.nome && <p style={{marginTop:"0.3rem",fontSize:"0.78rem",color:"#FCA5A5"}}>⚠ {errors.nome.message}</p>}
        </div>
        <div>
          <label className={lc}>E-mail</label>
          <input type="email" placeholder="nome@exemplo.com" autoComplete="email" className={ic} {...register("email")} />
          {errors.email && <p style={{marginTop:"0.3rem",fontSize:"0.78rem",color:"#FCA5A5"}}>⚠ {errors.email.message}</p>}
        </div>
        <div>
          <label className={lc}>Curso</label>
          <select className={ic} defaultValue="" {...register("curso")}>
            <option value="" disabled style={{color:"#666"}}>Selecciona o teu curso</option>
            {CURSOS.map(c=><option key={c} value={c} style={{color:"#1E293B",background:"#fff"}}>{c}</option>)}
          </select>
          {errors.curso && <p style={{marginTop:"0.3rem",fontSize:"0.78rem",color:"#FCA5A5"}}>⚠ {errors.curso.message}</p>}
        </div>
        <div>
          <label className={lc}>Ano curricular</label>
          <select className={ic} defaultValue="" {...register("anoCurricular")}>
            <option value="" disabled style={{color:"#666"}}>Selecciona</option>
            {[1,2,3,4].map(a=><option key={a} value={a} style={{color:"#1E293B",background:"#fff"}}>{a}.º ano</option>)}
          </select>
        </div>
        <div>
          <label className={lc}>Palavra-passe</label>
          <input type="password" placeholder="Mínimo 10 caracteres" autoComplete="new-password" className={ic} {...register("password")} />
          {errors.password && <p style={{marginTop:"0.3rem",fontSize:"0.78rem",color:"#FCA5A5"}}>⚠ {errors.password.message}</p>}
        </div>
        {erroServidor && <div style={{borderRadius:"10px",background:"rgba(252,165,165,.1)",border:"1px solid rgba(252,165,165,.3)",padding:"0.75rem 1rem"}}><p style={{margin:0,fontSize:"0.85rem",color:"#FCA5A5"}}>{erroServidor}</p></div>}
        <div style={{borderRadius:"12px",border:`1px solid ${erroConsentimento?"rgba(252,165,165,.5)":"rgba(255,255,255,.14)"}`,background:erroConsentimento?"rgba(252,165,165,.07)":"rgba(255,255,255,.05)",padding:"0.9rem"}}>
          <label style={{display:"flex",gap:"0.7rem",cursor:"pointer",alignItems:"flex-start"}}>
            <input type="checkbox" checked={consentiu} onChange={e=>{setConsentiu(e.target.checked);if(e.target.checked)setErroConsentimento(false);}} style={{marginTop:2,width:18,height:18,flexShrink:0,accentColor:"#C8A99D"}} />
            <span style={{fontSize:"0.78rem",lineHeight:1.6,color:"rgba(242,230,214,.72)"}}>Aceito que sejam recolhidos o meu nome, e-mail, curso, ano curricular e os meus resultados nas actividades. Estes dados destinam-se exclusivamente ao estudo académico que dá origem a esta aplicação, no âmbito do Trabalho de Conclusão de Curso no ISAF. Não são partilhados com terceiros nem usados para outro fim, e os resultados apresentados no relatório final são agregados e anónimos. Posso pedir a eliminação da minha conta e de todos os dados associados a qualquer momento, escrevendo para igordesousavenda@gmail.com.</span>
          </label>
          {erroConsentimento && <p style={{margin:"0.45rem 0 0 1.6rem",fontSize:"0.78rem",color:"#FCA5A5"}}>É necessário aceitar para criar conta.</p>}
        </div>
        <button type="submit" disabled={isSubmitting} style={{width:"100%",height:"3rem",borderRadius:"12px",background:"#C8A99D",color:"#1E293B",fontWeight:700,fontSize:"1rem",border:"none",cursor:"pointer",opacity:isSubmitting?0.7:1}}>
          {isSubmitting ? "A criar conta…" : "Criar conta →"}
        </button>
      </form>
      <p style={{textAlign:"center",fontSize:"0.84rem",color:"rgba(242,230,214,.50)",marginTop:"1.4rem"}}>
        Já tens conta? <Link href="/entrar" style={{color:"#C8A99D",fontWeight:600,textDecoration:"none"}}>Entrar</Link>
      </p>
    </>
  );
}
