/** Modelos de e-mail. Cores escritas à mão porque os clientes de e-mail
 *  não lêem CSS externo nem variáveis: aqui o hexadecimal é obrigatório. */

const NAVY = "#1e293b";
const FUNDO = "#131c2b";
const CREME = "#f2e6d6";
const ACENTO = "#c8a99d";
const SUAVE = "#c3bdb4";
const TENUE = "#8e9099";

type Proposito = "sign-in" | "email-verification" | "forget-password" | "change-email";

const TEXTOS: Record<Proposito, { assunto: (c: string) => string; titulo: string; intro: string }> = {
  "sign-in": {
    assunto: (c) => `${c} é o teu código de entrada — Click Seguro`,
    titulo: "Entrar na tua conta",
    intro: "Usa o código abaixo para entrares no Click Seguro.",
  },
  "email-verification": {
    assunto: (c) => `${c} confirma o teu e-mail — Click Seguro`,
    titulo: "Confirma o teu e-mail",
    intro: "Usa o código abaixo para confirmares que este endereço é teu.",
  },
  "forget-password": {
    assunto: (c) => `${c} para repores a palavra-passe — Click Seguro`,
    titulo: "Repor a palavra-passe",
    intro: "Usa o código abaixo para definires uma nova palavra-passe.",
  },
  "change-email": {
    assunto: (c) => `${c} confirma o novo e-mail — Click Seguro`,
    titulo: "Confirma o novo e-mail",
    intro: "Usa o código abaixo para confirmares a mudança de endereço.",
  },
};

export function modeloCodigo(codigo: string, proposito: Proposito, validadeMin: number) {
  const t = TEXTOS[proposito];

  const html = `
<div style="font-family:'Segoe UI',Helvetica,Arial,sans-serif;max-width:520px;margin:0 auto;padding:30px;background-color:${FUNDO};border-radius:20px;color:${CREME};">
  <div style="text-align:center;margin-bottom:24px;">
    <h2 style="color:${CREME};margin:0;font-size:26px;font-weight:800;">Click<span style="color:${ACENTO};">Seguro</span></h2>
    <p style="color:${TENUE};margin-top:4px;font-size:14px;">Segurança digital que se treina</p>
  </div>

  <div style="background:${NAVY};border-radius:16px;padding:24px;border:1px solid #3a4759;text-align:center;">
    <h3 style="margin-top:0;color:${CREME};font-size:18px;">${t.titulo}</h3>
    <p style="color:${SUAVE};font-size:14px;margin-bottom:20px;">${t.intro}</p>

    <div style="background-color:#263449;border:2px dashed ${ACENTO};border-radius:12px;padding:16px;display:inline-block;letter-spacing:8px;font-size:32px;font-weight:800;color:${ACENTO};margin-bottom:16px;">${codigo}</div>

    <p style="color:${TENUE};font-size:12px;margin:0;">Válido durante ${validadeMin} minutos. Ninguém do Click Seguro te vai pedir este código.</p>
  </div>

  <div style="text-align:center;margin-top:24px;color:${TENUE};font-size:12px;">
    <p style="margin:0;">Se não foste tu a pedir, ignora esta mensagem.</p>
    <p style="margin:8px 0 0;">© ${new Date().getFullYear()} Click Seguro · ISAF</p>
  </div>
</div>`.trim();

  return {
    assunto: t.assunto(codigo),
    html,
    textoAlternativo: `${t.titulo}: o teu código é ${codigo}. Válido durante ${validadeMin} minutos.`,
  };
}
