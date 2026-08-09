"use client";

import { cn } from "@/lib/utils";

interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: "primario" | "secundario" | "fantasma";
  carregando?: boolean;
}

export function Botao({
  variante = "primario",
  carregando = false,
  className,
  children,
  disabled,
  ...props
}: BotaoProps) {
  const variantes = {
    primario: "bg-brand-500 text-white hover:bg-brand-600",
    secundario:
      "bg-white text-brand-500 border border-brand-200 hover:bg-brand-50",
    fantasma: "bg-transparent text-ink-700 hover:bg-ink-100",
  };

  return (
    <button
      disabled={disabled || carregando}
      aria-busy={carregando}
      className={cn(
        "inline-flex items-center justify-center gap-2",
        "h-11 px-5 rounded-btn text-sm font-medium",
        "transition-all duration-150",
        "active:scale-[.97]",
        "focus-visible:outline-none focus-visible:shadow-[0_0_0_3px_rgba(22,104,217,.28)]",
        "disabled:bg-ink-100 disabled:text-ink-300 disabled:cursor-not-allowed disabled:active:scale-100",
        variantes[variante],
        className,
      )}
      {...props}
    >
      {carregando && (
        <svg
          className="animate-spin"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            fill="none"
            stroke="currentColor"
            strokeOpacity=".3"
            strokeWidth="3"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
