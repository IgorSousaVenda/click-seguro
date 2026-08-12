import { TextoRico } from "@/components/texto-rico";

export function ConteudoLicao({ texto }: { texto: string }) {
  const blocos = texto.split("\n\n").filter((b) => b.trim().length > 0);

  return (
    <div className="space-y-5">
      {blocos.map((bloco, i) => {
        const linhas = bloco.split("\n");

        // Situação real: bloco iniciado por ">"
        if (linhas[0].startsWith(">")) {
          return (
            <blockquote
              key={i}
              className="rounded-r-lg border-l-4 border-[#1668D9] bg-[#1668D9]/5 py-4 pl-5 pr-4 text-[15px] italic leading-relaxed text-ink-800"
            >
              {linhas.map((l) => l.replace(/^>\s?/, "")).join(" ")}
            </blockquote>
          );
        }

        // Lista: todas as linhas começam por "-"
        if (linhas.every((l) => l.startsWith("-"))) {
          return (
            <ul key={i} className="space-y-2.5">
              {linhas.map((linha, j) => (
                <li
                  key={j}
                  className="flex gap-3 text-[15px] leading-relaxed text-ink-700"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1668D9]"
                    aria-hidden="true"
                  />
                  <span>
                    <TextoRico>{linha.replace(/^-\s?/, "")}</TextoRico>
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={i}
            className="text-[15px] leading-relaxed text-ink-700 text-justify"
          >
            <TextoRico>{bloco}</TextoRico>
          </p>
        );
      })}
    </div>
  );
}
