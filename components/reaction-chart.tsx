"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

export type ChartDataPoint = {
  name: string;
  total: number;
};

const COLORS = [
  "oklch(0.69 0.17 22)",
  "oklch(0.76 0.12 63)",
  "oklch(0.62 0.15 351)",
  "oklch(0.72 0.11 42)",
  "oklch(0.55 0.11 16)",
  "oklch(0.7 0.08 12)",
];

export function ReactionChart({ data }: { data: ChartDataPoint[] }) {
  return (
    <div className="h-[380px] w-full rounded-[1.75rem] border border-white/60 bg-white/55 p-3">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 8, left: -12, bottom: 40 }}>
          <defs>
            <linearGradient id="chart-bg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(255 255 255 / 0.95)" />
              <stop offset="100%" stopColor="rgb(255 247 237 / 0.5)" />
            </linearGradient>
          </defs>

          <CartesianGrid
            strokeDasharray="4 8"
            stroke="oklch(0.86 0.03 45)"
            vertical={false}
          />

          <XAxis
            dataKey="name"
            tick={{ fill: "oklch(0.43 0.05 22)", fontSize: 12, fontWeight: 600 }}
            tickLine={false}
            axisLine={false}
            angle={-18}
            textAnchor="end"
            height={52}
          />

          <YAxis
            tick={{ fill: "oklch(0.43 0.05 22)", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toLocaleString()}
          />

          <Tooltip
            cursor={{ fill: "url(#chart-bg)" }}
            contentStyle={{
              backgroundColor: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(251, 191, 36, 0.35)",
              borderRadius: "20px",
              boxShadow: "0 18px 45px rgba(120,53,15,0.12)",
            }}
            labelStyle={{ color: "oklch(0.3 0.05 22)", fontWeight: 700 }}
            formatter={(value: unknown) => [
              (value as number)?.toLocaleString() ?? "0",
              "Reactions",
            ]}
          />

          <Bar dataKey="total" radius={[16, 16, 6, 6]} maxBarSize={64}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
