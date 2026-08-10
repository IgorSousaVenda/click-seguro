import { Termo } from "@/components/termo";

export function TextoRico({ children }: { children: string }) {
  const partes = children.split(/(\[\[[^\]]+\]\])/g);

  return (
    <>
      {partes.map((parte, i) =>
        parte.startsWith("[[") && parte.endsWith("]]") ? (
          <Termo key={i}>{parte.slice(2, -2)}</Termo>
        ) : (
          parte
        ),
      )}
    </>
  );
}
