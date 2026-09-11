"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";

export function Sair() {
  const router = useRouter();
  const [aSair, setASair] = useState(false);

  async function terminar() {
    setASair(true);
    await signOut();
    router.push("/entrar");
    router.refresh();
  }

  return (
    <button
      onClick={terminar}
      disabled={aSair}
      className="flex items-center gap-2 rounded-campo px-3 py-2 text-sm text-texto-suave transition-colors hover:bg-texto/8 hover:text-texto disabled:opacity-50"
    >
      <LogOut size={16} aria-hidden="true" />
      {aSair ? "A sair…" : "Sair"}
    </button>
  );
}
