import { create } from "zustand";
import type { User, CurrencyCode, PerformanceTier, OptimizationResult } from "@/types";

// ─── Store Interface ──────────────────────────────────────────────────────────
interface AppState {
  // Auth
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;

  // Budget & Tier
  budget: number;
  setBudget: (b: number) => void;
  tier: PerformanceTier;
  setTier: (t: PerformanceTier) => void;

  // Currency
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;

  // Current build result
  currentBuild: OptimizationResult | null;
  setCurrentBuild: (b: OptimizationResult | null) => void;

  // Sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

// ─── Store Implementation ─────────────────────────────────────────────────────
export const useStore = create<AppState>((set) => ({
  // Auth — hydrate from localStorage
  user: (() => {
    try {
      const raw = localStorage.getItem("sb_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })(),
  token: localStorage.getItem("sb_token"),

  setAuth: (user, token) => {
    localStorage.setItem("sb_token", token);
    localStorage.setItem("sb_user", JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("sb_token");
    localStorage.removeItem("sb_user");
    set({ user: null, token: null, currentBuild: null });
  },

  // Budget defaults to ₹85,000
  budget: 85000,
  setBudget: (budget) => set({ budget }),

  // Default tier
  tier: "gaming",
  setTier: (tier) => set({ tier }),

  // Default currency INR
  currency: "INR",
  setCurrency: (currency) => set({ currency }),

  // Current optimization result
  currentBuild: null,
  setCurrentBuild: (currentBuild) => set({ currentBuild }),

  // Sidebar state
  sidebarOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
}));
