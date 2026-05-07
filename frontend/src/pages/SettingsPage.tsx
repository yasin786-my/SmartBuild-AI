import { useStore } from "@/store/useStore";
import { SUPPORTED_CURRENCIES } from "@/lib/currency";
import type { CurrencyCode } from "@/types";
import { Settings as SettingsIcon, User, Globe } from "lucide-react";

export default function SettingsPage() {
  const { user, currency, setCurrency } = useStore();

  return (
    <div className="p-4 lg:p-8 space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Settings</h1>
        <p className="text-surface-400 text-sm mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Profile */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <User size={20} className="text-brand-400" />
          <h2 className="text-lg font-semibold">Profile</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-surface-500 uppercase tracking-wider">Name</label>
            <p className="mt-1 text-sm font-medium">{user?.name || "—"}</p>
          </div>
          <div>
            <label className="text-xs text-surface-500 uppercase tracking-wider">Email</label>
            <p className="mt-1 text-sm font-medium">{user?.email || "—"}</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Globe size={20} className="text-brand-400" />
          <h2 className="text-lg font-semibold">Preferences</h2>
        </div>

        <div>
          <label className="text-sm text-surface-300 font-medium block mb-2">
            Default Currency
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {SUPPORTED_CURRENCIES.map((c) => (
              <button
                key={c.code}
                onClick={() => setCurrency(c.code as CurrencyCode)}
                className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all
                  ${
                    currency === c.code
                      ? "border-brand-500/50 bg-brand-500/10 text-brand-400"
                      : "border-surface-700/50 hover:border-surface-600 text-surface-400"
                  }`}
              >
                <span className="text-lg block">{c.symbol}</span>
                <span className="text-xs">{c.code}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* About */}
      <div className="glass-card p-6 space-y-3">
        <div className="flex items-center gap-3">
          <SettingsIcon size={20} className="text-brand-400" />
          <h2 className="text-lg font-semibold">About</h2>
        </div>
        <div className="text-sm text-surface-400 space-y-1">
          <p>SmartBuild AI — PC Budget Optimizer v1.0.0</p>
          <p>ML Model: smartbuild-xgb-mock-v1.0</p>
          <p>Built with React 19, Node.js, Flask & ❤️</p>
        </div>
      </div>
    </div>
  );
}
