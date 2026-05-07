import { useStore } from "@/store/useStore";
import { useOptimize, useSaveBuild } from "@/hooks/useApi";
import BudgetSlider from "@/components/dashboard/BudgetSlider";
import TierCards from "@/components/dashboard/TierCards";
import BuildSummary from "@/components/dashboard/BuildSummary";
import AllocationChart from "@/components/build/AllocationChart";
import PdfExport from "@/components/build/PdfExport";
import { Sparkles, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardPage() {
  const { budget, tier, currency, currentBuild } = useStore();
  const optimize = useOptimize();
  const saveBuild = useSaveBuild();

  const handleGenerate = async () => {
    try {
      await optimize.mutateAsync({ budget, tier, currency });
      toast.success("Build optimized!");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Optimization failed");
    }
  };

  const handleSave = async () => {
    if (!currentBuild) return;
    try {
      await saveBuild.mutateAsync({
        name: `${tier.charAt(0).toUpperCase() + tier.slice(1)} Build — ${new Date().toLocaleDateString()}`,
        ...currentBuild,
      });
      toast.success("Build saved!");
    } catch (err: any) {
      toast.error("Failed to save build");
    }
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">PC Builder Dashboard</h1>
          <p className="text-surface-400 text-sm mt-1">
            Personalize and build your custom PC
          </p>
        </div>
        <div className="flex items-center gap-3">
          {currentBuild && <PdfExport />}
          {currentBuild && (
            <button
              onClick={handleSave}
              disabled={saveBuild.isPending}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-brand-500/30 text-brand-400 hover:bg-brand-500/10 transition-all text-sm font-medium"
              id="save-build-btn"
            >
              {saveBuild.isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              Save Build
            </button>
          )}
        </div>
      </div>

      {/* Top row: Budget + Tier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetSlider />
        <TierCards />
      </div>

      {/* Generate Button */}
      <div className="flex justify-center">
        <button
          onClick={handleGenerate}
          disabled={optimize.isPending}
          className="glow-btn flex items-center gap-2 px-8 py-3 text-base"
          id="generate-build-btn"
        >
          {optimize.isPending ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <Sparkles size={20} />
          )}
          {optimize.isPending ? "Optimizing with AI..." : "Generate Optimized Build"}
        </button>
      </div>

      {/* Build Results */}
      {currentBuild && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <BuildSummary />
          </div>
          <AllocationChart />
        </div>
      )}
    </div>
  );
}
