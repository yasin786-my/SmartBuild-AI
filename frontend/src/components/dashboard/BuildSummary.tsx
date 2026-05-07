import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/currency";
import type { Component } from "@/types";
import { Cpu, MonitorSpeaker, MemoryStick, HardDrive, CircuitBoard, Zap, Box, Fan } from "lucide-react";

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  cpu: <Cpu size={18} className="text-blue-400" />,
  gpu: <MonitorSpeaker size={18} className="text-green-400" />,
  ram: <MemoryStick size={18} className="text-purple-400" />,
  storage: <HardDrive size={18} className="text-amber-400" />,
  motherboard: <CircuitBoard size={18} className="text-pink-400" />,
  psu: <Zap size={18} className="text-yellow-400" />,
  case: <Box size={18} className="text-cyan-400" />,
  cooler: <Fan size={18} className="text-teal-400" />,
};

const CATEGORY_LABELS: Record<string, string> = {
  cpu: "Processor",
  gpu: "Graphics Card",
  ram: "Memory",
  storage: "Storage",
  motherboard: "Motherboard",
  psu: "Power Supply",
  case: "Case",
  cooler: "Cooler",
};

export default function BuildSummary() {
  const { currentBuild, currency } = useStore();

  if (!currentBuild || !currentBuild.components.length) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
          Build Summary
        </h3>
        <p className="text-surface-500 text-sm mt-4 text-center py-8">
          Click "Generate Build" to get AI-optimized component recommendations
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 space-y-4" id="build-summary">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
            Build Summary
          </h3>
          <p className="text-xs text-surface-500 mt-1">
            Dynamic breakdown by AI-generated components
          </p>
        </div>
        <span className="text-xs px-2 py-1 rounded-full bg-brand-500/15 text-brand-400 font-medium">
          {currentBuild.ml_model_version}
        </span>
      </div>

      {/* Components Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-800">
              <th className="text-left py-2 text-surface-500 font-medium">Component</th>
              <th className="text-left py-2 text-surface-500 font-medium">Name</th>
              <th className="text-right py-2 text-surface-500 font-medium">Price</th>
              <th className="text-right py-2 text-surface-500 font-medium hidden sm:table-cell">Confidence</th>
            </tr>
          </thead>
          <tbody>
            {currentBuild.components.map((comp: Component) => (
              <tr key={comp.id} className="border-b border-surface-800/50 hover:bg-surface-800/20 transition-colors">
                <td className="py-3 flex items-center gap-2">
                  {CATEGORY_ICONS[comp.category] || <Box size={18} />}
                  <span className="text-surface-400 text-xs">{CATEGORY_LABELS[comp.category] || comp.category}</span>
                </td>
                <td className="py-3 font-medium">{comp.name}</td>
                <td className="py-3 text-right text-brand-400 font-mono">
                  {formatCurrency(comp.price_converted, currency)}
                </td>
                <td className="py-3 text-right hidden sm:table-cell">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400">
                    {(comp.ml_confidence * 100).toFixed(0)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="pt-2 border-t border-surface-700 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-surface-400">Total Cost</span>
          <span className="font-bold text-white">
            {formatCurrency(currentBuild.total_cost, currency)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-surface-400">Remaining Budget</span>
          <span className="font-bold text-brand-400">
            {formatCurrency(currentBuild.remaining_budget, currency)}
          </span>
        </div>
      </div>
    </div>
  );
}
