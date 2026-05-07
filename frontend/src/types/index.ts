// ─── TypeScript Interfaces ────────────────────────────────────────────────────

/** A single PC component recommended by the ML service. */
export interface Component {
  id: string;
  name: string;
  brand: string;
  category: string;
  price_inr: number;
  price_converted: number;
  tiers: string[];
  specs: Record<string, string | number | boolean>;
  ml_confidence: number;
}

/** Budget allocation detail for one component category. */
export interface AllocationDetail {
  allocated_pct: number;
  allocated_amount: number;
  spent: number;
  note?: string;
}

/** The full result from the ML optimization endpoint. */
export interface OptimizationResult {
  tier: string;
  budget: number;
  budget_inr: number;
  currency: string;
  components: Component[];
  allocation: Record<string, AllocationDetail>;
  total_cost: number;
  total_cost_inr: number;
  remaining_budget: number;
  ml_model_version: string;
}

/** A saved build (from MongoDB). */
export interface Build extends OptimizationResult {
  _id: string;
  user: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

/** Performance tier options. */
export type PerformanceTier = "gaming" | "workstation" | "content_creation" | "office";

/** Supported currency codes. */
export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

/** Currency info from the API. */
export interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  rate_from_inr: number;
  locale: string;
}

/** Auth user object. */
export interface User {
  id: string;
  name: string;
  email: string;
  preferredCurrency: CurrencyCode;
  createdAt?: string;
}

/** Auth response from login/register. */
export interface AuthResponse {
  token: string;
  user: User;
}

/** Tier display metadata. */
export interface TierMeta {
  id: PerformanceTier;
  label: string;
  description: string;
  icon: string;
  gradient: string;
}
