"use client";

import { forwardRef, useId } from "react";
import { cn } from "@/lib/utils";

interface CampoProps extends React.InputHTMLAttributes<HTMLInputElement> {
  rotulo: string;
  erro?: string;
}

export const Campo = forwardRef<HTMLInputElement, CampoProps>(
  ({ rotulo, erro, className, ...props }, ref) => {
    const id = useId();
    const idErro = `${id}-erro`;

    return (
      <div className="w-full">
        <label
          htmlFor={id}
          className="block text-sm font-medium text-ink-700 mb-2"
        >
          {rotulo}
        </label>
        <input
          id={id}
          ref={ref}
          aria-invalid={!!erro}
          aria-describedby={erro ? idErro : undefined}
          className={cn(
            "w-full h-12 px-4 text-base rounded-btn bg-white",
            "border border-ink-100 transition-colors duration-150",
            "placeholder:text-ink-300",
            "hover:border-ink-300",
            "focus:outline-none focus:border-brand-500 focus:shadow-[0_0_0_3px_rgba(22,104,217,.18)]",
            erro && "border-danger focus:border-danger",
            className,
          )}
          {...props}
        />
        {erro && (
          <p
            id={idErro}
            className="mt-2 text-[13px] text-danger flex items-center gap-1.5"
          >
            <span aria-hidden="true">⚠</span>
            {erro}
          </p>
        )}
      </div>
    );
  },
);

Campo.displayName = "Campo";
