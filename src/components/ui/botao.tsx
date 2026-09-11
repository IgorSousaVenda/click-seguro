import { cn } from "@/lib/utils";

type Variante = "primario" | "secundario" | "fantasma" | "perigo";

interface BotaoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  carregando?: boolean;
}

const VARIANTES: Record<Variante, string> = {
  primario:
    "bg-acento text-acento-contraste hover:bg-acento-forte disabled:bg-superficie-3 disabled:text-texto-tenue",
  secundario:
    "border border-contorno-forte bg-superficie-2 text-texto hover:border-acento/50 hover:bg-superficie-3 disabled:text-texto-tenue",
  fantasma:
    "text-texto-suave hover:bg-texto/8 hover:text-texto disabled:text-texto-tenue",
  perigo:
    "bg-perigo text-acento-contraste hover:brightness-110 disabled:bg-superficie-3 disabled:text-texto-tenue",
};

export function Botao({
  variante = "primario",
  carregando = false,
  className,
  children,
  disabled,
  ...props
}: BotaoProps) {
  return (
    <button
      disabled={disabled || carregando}
      aria-busy={carregando}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-campo px-5",
        "text-sm font-semibold transition-colors duration-150",
        "active:scale-[.98] disabled:cursor-not-allowed disabled:active:scale-100",
        VARIANTES[variante],
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
