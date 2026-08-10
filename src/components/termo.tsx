"use client";

import { useEffect, useRef, useState } from "react";
import { glossario } from "@/lib/glossario";

export function Termo({ children }: { children: string }) {
  const [aberto, setAberto] = useState(false);
  const contentor = useRef<HTMLSpanElement>(null);

  const definicao = glossario[children.toLowerCase()];

  useEffect(() => {
    if (!aberto) return;

    function aoClicarFora(e: MouseEvent) {
      if (!contentor.current?.contains(e.target as Node)) setAberto(false);
    }
    function aoPremirEsc(e: KeyboardEvent) {
      if (e.key === "Escape") setAberto(false);
    }

    document.addEventListener("mousedown", aoClicarFora);
    document.addEventListener("keydown", aoPremirEsc);
    return () => {
      document.removeEventListener("mousedown", aoClicarFora);
      document.removeEventListener("keydown", aoPremirEsc);
    };
  }, [aberto]);

  if (!definicao) return <>{children}</>;

  return (
    <span ref={contentor} className="relative inline-block">
      <button
        type="button"
        onClick={() => setAberto(!aberto)}
        aria-expanded={aberto}
        className="cursor-help font-medium text-[#1668D9] underline decoration-dotted underline-offset-2"
      >
        {children}
      </button>

      {aberto && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-50 mb-2 w-64 -translate-x-1/2 rounded-lg border border-ink-200 bg-white p-3 text-sm font-normal leading-snug text-ink-700 shadow-lg"
        >
          <span className="mb-1 block font-semibold text-ink-900">
            {children}
          </span>
          {definicao}
        </span>
      )}
    </span>
  );
}
