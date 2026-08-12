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
    { etapa: "Antes", valor: diagnostico, cor: "#94A3B8" },
    ...(final !== null
      ? [{ etapa: "Depois", valor: final, cor: "#17864F" }]
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
            stroke="#E2E8F0"
            vertical={false}
          />
          <XAxis
            dataKey="etapa"
            tick={{ fill: "#475569", fontSize: 13 }}
            axisLine={{ stroke: "#CBD5E1" }}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 25, 50, 75, 100]}
            tick={{ fill: "#94A3B8", fontSize: 12 }}
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
              style={{ fill: "#0F172A", fontSize: 13, fontWeight: 600 }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
