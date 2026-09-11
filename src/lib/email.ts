import nodemailer from "nodemailer";

/**
 * Envio de e-mail com degradação deliberada: sem SMTP configurado, o código
 * é escrito nos registos do servidor em vez de falhar. Isso mantém o fluxo
 * inteiro demonstrável antes de haver credenciais.
 */

const SMTP_HOST = process.env.SMTP_HOST ?? "smtp.gmail.com";
const SMTP_PORT = Number.parseInt(process.env.SMTP_PORT ?? "587", 10);
const SMTP_SEGURO = process.env.SMTP_SECURE === "true";
const SMTP_UTILIZADOR = process.env.SMTP_USER ?? "";
const SMTP_SENHA = process.env.SMTP_PASS ?? "";
const REMETENTE =
  process.env.SMTP_FROM ?? '"Click Seguro" <nao-responder@clickseguro.ao>';

export const smtpConfigurado = SMTP_UTILIZADOR !== "" && SMTP_SENHA !== "";

const transporte = smtpConfigurado
  ? nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SEGURO,
      auth: { user: SMTP_UTILIZADOR, pass: SMTP_SENHA },
    })
  : null;

export async function enviarEmail({
  para,
  assunto,
  html,
  textoAlternativo,
}: {
  para: string;
  assunto: string;
  html: string;
  textoAlternativo: string;
}) {
  if (!transporte) {
    console.log(
      [
        "",
        "┌─ E-MAIL (SMTP não configurado) ─────────────────────",
        `│ Para:    ${para}`,
        `│ Assunto: ${assunto}`,
        `│ ${textoAlternativo}`,
        "└─────────────────────────────────────────────────────",
        "",
      ].join("\n"),
    );
    return;
  }

  try {
    await transporte.sendMail({
      from: REMETENTE,
      to: para,
      subject: assunto,
      html,
      text: textoAlternativo,
    });
  } catch (erro) {
    // Um erro de SMTP não pode revelar se a conta existe nem derrubar o
    // pedido: o utilizador vê sempre a mesma mensagem neutra.
    console.error("Falha no envio de e-mail para", para, erro);
  }
}
