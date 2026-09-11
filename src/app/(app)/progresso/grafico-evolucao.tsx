"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";

export function GraficoEvolucao({
  diagnostico,
  final,
}: {
  diagnostico: number;
  final: number | null;
}) {
  const dados = [
    { etapa: "Antes", valor: diagnostico, cor: "var(--color-texto-tenue)" },
    ...(final !== null
      ? [{ etapa: "Depois", valor: final, cor: "var(--color-sucesso)" }]
      : []),
  ];

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={dados}
          margin={{ top: 24, right: 8, left: -16, bottom: 8 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="var(--color-contorno)"
            vertical={false}
          />
          <XAxis
            dataKey="etapa"
            tick={{ fill: "var(--color-texto-suave)", fontSize: 13 }}
            axisLine={{ stroke: "var(--color-contorno-forte)" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fill: "var(--color-texto-tenue)", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            unit="%"
          />
          <Bar
            dataKey="valor"
            radius={[6, 6, 0, 0]}
            maxBarSize={90}
            isAnimationActive={false}
          >
            {dados.map((d) => (
              <Cell key={d.etapa} fill={d.cor} />
            ))}
            <LabelList
              dataKey="valor"
              position="top"
              formatter={(v: unknown) => `${v}%`}
              style={{ fill: "var(--color-texto)", fontSize: 13, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
