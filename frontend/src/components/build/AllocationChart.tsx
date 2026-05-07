import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/currency";

const COLORS = [
  "#3b82f6", // blue  — CPU
  "#10b981", // green — GPU
  "#8b5cf6", // purple — RAM
  "#f59e0b", // amber — Storage
  "#ec4899", // pink — Motherboard
  "#eab308", // yellow — PSU
  "#06b6d4", // cyan — Case
  "#14b8a6", // teal — Cooler
];

const CATEGORY_LABELS: Record<string, string> = {
  cpu: "CPU",
  gpu: "GPU",
  ram: "RAM",
  storage: "Storage",
  motherboard: "Mobo",
  psu: "PSU",
  case: "Case",
  cooler: "Cooler",
};

export default function AllocationChart() {
  const { currentBuild, currency } = useStore();

  if (!currentBuild) return null;

  const data = Object.entries(currentBuild.allocation).map(([category, detail]) => ({
    name: CATEGORY_LABELS[category] || category,
    value: detail.spent || 0,
    pct: detail.allocated_pct,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div className="glass-card px-3 py-2 text-xs">
          <p className="font-semibold text-white">{d.name}</p>
          <p className="text-brand-400">{formatCurrency(d.value, currency)}</p>
          <p className="text-surface-400">{d.pct}% allocated</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card p-6 space-y-4" id="allocation-chart">
      <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
        Budget Allocation
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value: string) => (
              <span className="text-xs text-surface-300">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
