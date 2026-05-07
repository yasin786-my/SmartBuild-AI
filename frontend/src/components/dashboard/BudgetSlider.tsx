import { useStore } from "@/store/useStore";
import { formatCurrency } from "@/lib/currency";

/**
 * BudgetSlider — Interactive range slider for setting the build budget.
 * Displays the current value formatted in the selected currency.
 */
export default function BudgetSlider() {
  const { budget, setBudget, currency } = useStore();

  // Budget range: ₹15,000 – ₹5,00,000. Step: ₹5,000
  const MIN = 15000;
  const MAX = 500000;
  const STEP = 5000;

  return (
    <div className="glass-card p-6 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider">
          Budget Slider
        </h3>
        <p className="text-xs text-surface-500 mt-1">
          Interactive and adjust your budget
        </p>
      </div>

      {/* Current budget display */}
      <div className="text-center">
        <span className="text-3xl font-bold gradient-text">
          {formatCurrency(budget, currency)}
        </span>
        <span className="text-sm text-surface-400 ml-2">({currency})</span>
      </div>

      {/* Range slider */}
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={STEP}
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
        className="w-full"
        id="budget-slider"
      />

      {/* Min / Max labels */}
      <div className="flex justify-between text-xs text-surface-500">
        <span>{formatCurrency(MIN, currency)}</span>
        <span>{formatCurrency(MAX, currency)}</span>
      </div>
    </div>
  );
}
