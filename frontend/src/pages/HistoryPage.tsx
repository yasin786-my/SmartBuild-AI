import { useBuilds, useDeleteBuild } from "@/hooks/useApi";
import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/currency";
import { Trash2, Calendar, Cpu, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function HistoryPage() {
  const { currency } = useStore();
  const { data: builds, isLoading } = useBuilds();
  const deleteBuild = useDeleteBuild();

  const handleDelete = async (id: string) => {
    try {
      await deleteBuild.mutateAsync(id);
      toast.success("Build deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const tierColors: Record<string, string> = {
    gaming: "text-purple-400 bg-purple-500/10",
    workstation: "text-blue-400 bg-blue-500/10",
    content_creation: "text-orange-400 bg-orange-500/10",
    office: "text-green-400 bg-green-500/10",
  };

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Build History</h1>
        <p className="text-surface-400 text-sm mt-1">
          Your previously saved PC builds
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin text-brand-400" size={32} />
        </div>
      ) : !builds?.length ? (
        <div className="glass-card p-12 text-center">
          <Cpu size={48} className="mx-auto text-surface-600 mb-4" />
          <p className="text-surface-400">No saved builds yet</p>
          <p className="text-surface-500 text-sm mt-1">
            Generate and save a build from the Dashboard
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {builds.map((build) => (
            <div
              key={build._id}
              className="glass-card p-5 flex flex-col sm:flex-row sm:items-center gap-4"
            >
              {/* Left: Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{build.name}</h3>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      tierColors[build.tier] || "text-surface-400 bg-surface-800"
                    }`}
                  >
                    {build.tier.replace("_", " ")}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-surface-400">
                  <span className="flex items-center gap-1">
                    <Calendar size={12} />
                    {new Date(build.createdAt).toLocaleDateString()}
                  </span>
                  <span>Budget: {formatCurrency(build.budget, currency)}</span>
                  <span>Total: {formatCurrency(build.total_cost, currency)}</span>
                  <span>{build.components.length} components</span>
                </div>

                {/* Component pills */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {build.components.slice(0, 4).map((c) => (
                    <span
                      key={c.id}
                      className="text-xs px-2 py-1 rounded-lg bg-surface-800/60 text-surface-300"
                    >
                      {c.name}
                    </span>
                  ))}
                  {build.components.length > 4 && (
                    <span className="text-xs px-2 py-1 rounded-lg bg-surface-800/60 text-surface-500">
                      +{build.components.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Actions */}
              <button
                onClick={() => handleDelete(build._id)}
                disabled={deleteBuild.isPending}
                className="p-2 rounded-lg hover:bg-red-500/10 text-surface-500 hover:text-red-400 transition-colors self-start"
                title="Delete build"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
