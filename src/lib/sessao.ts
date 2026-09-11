import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export async function obterSessao() {
  return auth.api.getSession({ headers: await headers() });
}

/**
 * O layout autenticado e a página são renderizados em paralelo. Quando não
 * há sessão, o redireccionamento do layout não impede a página de correr,
 * por isso cada página tem de garantir a sessão por si.
 */
export async function exigirSessao() {
  const sessao = await obterSessao();
  if (!sessao) redirect("/entrar");
  return sessao;
}
