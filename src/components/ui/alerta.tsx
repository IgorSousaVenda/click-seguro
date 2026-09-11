import { cn } from "@/lib/utils";

type Tom = "perigo" | "sucesso" | "aviso" | "info";

const TONS: Record<Tom, string> = {
  perigo: "border-perigo/35 bg-perigo/10 text-perigo",
  sucesso: "border-sucesso/35 bg-sucesso/10 text-sucesso",
  aviso: "border-aviso/35 bg-aviso/10 text-aviso",
  info: "border-info/35 bg-info/10 text-info",
};

export function Alerta({
  tom = "info",
  className,
  children,
}: {
  tom?: Tom;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role={tom === "perigo" ? "alert" : undefined}
      className={cn(
        "rounded-campo border px-4 py-3 text-sm leading-relaxed",
        TONS[tom],
        className,
      )}
    >
      {children}
    </div>
  );
}
