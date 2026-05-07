import { useStore } from "@/store/useStore";
import type { PerformanceTier, TierMeta } from "@/types";
import { Gamepad2, Monitor, Film, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS: TierMeta[] = [
  {
    id: "gaming",
    label: "1080p Gaming",
    description: "High FPS gaming builds",
    icon: "gaming",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "workstation",
    label: "4K Enthusiast",
    description: "Professional workstation",
    icon: "workstation",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "content_creation",
    label: "Creator Pro",
    description: "Video & 3D creation",
    icon: "content_creation",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    id: "office",
    label: "Office",
    description: "Productivity & tasks",
    icon: "office",
    gradient: "from-green-500 to-emerald-500",
  },
];

const ICONS: Record<string, React.ReactNode> = {
  gaming: <Gamepad2 size={28} />,
  workstation: <Monitor size={28} />,
  content_creation: <Film size={28} />,
  office: <Briefcase size={28} />,
};

export default function TierCards() {
  const { tier, setTier } = useStore();

  return (
    <div className="glass-card p-6 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
          Performance Tier
        </h3>
        <p className="text-xs text-surface-500 mt-1">
          Select your performance tier
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {TIERS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTier(t.id as PerformanceTier)}
            className={cn(
              "relative flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 text-center",
              tier === t.id
                ? "tier-card-active bg-brand-500/5 border-brand-500/50"
                : "border-surface-700/50 hover:border-surface-600 bg-surface-900/30"
            )}
            id={`tier-${t.id}`}
          >
            <div
              className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br",
                t.gradient,
                tier === t.id ? "opacity-100 shadow-lg" : "opacity-60"
              )}
            >
              {ICONS[t.icon]}
            </div>
            <span className="text-sm font-semibold">{t.label}</span>
            <span className="text-[10px] text-surface-500">{t.description}</span>

            {tier === t.id && (
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                <svg width="8" height="8" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-6" stroke="#0a1929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
