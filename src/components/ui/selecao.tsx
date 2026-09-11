"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface SelecaoProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  rotulo: string;
  erro?: string;
}

export const Selecao = forwardRef<HTMLSelectElement, SelecaoProps>(
  ({ rotulo, erro, className, children, ...props }, ref) => {
    const id = useId();
    const idErro = `${id}-erro`;

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-texto/80"
        >
          {rotulo}
        </label>
        <select
          id={id}
          ref={ref}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? idErro : undefined}
          className={cn(
            "h-12 w-full appearance-none rounded-campo px-4 text-base",
            "border border-texto/20 bg-texto/8 text-texto",
            "transition-colors hover:border-texto/35",
            "focus:border-acento focus:outline-none",
            // A seta é desenhada aqui porque o select nativo não aceita
            // conteúdo; o fundo escuro esconderia a seta do sistema.
            "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23c3bdb4%22 stroke-width=%222%22><path d=%22M6 9l6 6 6-6%22/></svg>')] bg-[length:1.1rem] bg-[right_0.9rem_center] bg-no-repeat pr-11",
            erro && "border-perigo hover:border-perigo focus:border-perigo",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        {erro && (
          <p id={idErro} className="mt-2 text-[13px] text-perigo">
            <span aria-hidden="true">⚠ </span>
            {erro}
          </p>
        )}
      </div>
    );
  },
);

Selecao.displayName = "Selecao";
