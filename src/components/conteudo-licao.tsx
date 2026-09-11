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
              className="rounded-r-lg border-l-4 border-acento bg-acento/8 py-4 pl-5 pr-4 text-[15px] italic leading-relaxed text-texto"
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
                  className="flex gap-3 text-[15px] leading-relaxed text-texto/80"
                >
                  <span
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-acento"
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
            className="text-[15px] leading-relaxed text-texto/80 text-justify"
          >
            <TextoRico>{bloco}</TextoRico>
          </p>
        );
      })}
    </div>
  );
}
