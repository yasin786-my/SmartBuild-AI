"""
budget_allocator.py — Allocates a total budget across PC component categories
based on the selected performance tier.

Each tier defines percentage allocations.  The allocator picks the best
component per category that fits within the allocated sub-budget.
"""

import numpy as np
from .components_db import COMPONENTS_DB
from .currency import convert_price


# ─── Budget Allocation Percentages per Tier ───────────────────────────────────
# These sum to 1.0 for each tier.  GPU-heavy for gaming, CPU-heavy for
# workstation, balanced for content creation, efficiency-focused for office.

TIER_ALLOCATIONS: dict[str, dict[str, float]] = {
    "gaming": {
        "cpu": 0.18,
        "gpu": 0.38,
        "ram": 0.06,
        "storage": 0.08,
        "motherboard": 0.12,
        "psu": 0.07,
        "case": 0.06,
        "cooler": 0.05,
    },
    "workstation": {
        "cpu": 0.28,
        "gpu": 0.22,
        "ram": 0.12,
        "storage": 0.10,
        "motherboard": 0.12,
        "psu": 0.07,
        "case": 0.05,
        "cooler": 0.04,
    },
    "content_creation": {
        "cpu": 0.22,
        "gpu": 0.30,
        "ram": 0.10,
        "storage": 0.10,
        "motherboard": 0.10,
        "psu": 0.07,
        "case": 0.06,
        "cooler": 0.05,
    },
    "office": {
        "cpu": 0.25,
        "gpu": 0.15,
        "ram": 0.10,
        "storage": 0.12,
        "motherboard": 0.18,
        "psu": 0.10,
        "case": 0.05,
        "cooler": 0.05,
    },
}


def _pick_best_component(category: str, budget_for_category: float, tier: str) -> dict | None:
    """
    Pick the most expensive component in `category` that:
      1. Fits within `budget_for_category` (INR).
      2. Is compatible with the requested `tier`.
    Returns the component dict or None.
    """
    candidates = [
        c for c in COMPONENTS_DB.get(category, [])
        if tier in c["tiers"] and c["price_inr"] <= budget_for_category
    ]
    if not candidates:
        # Fallback: pick cheapest in category regardless of tier
        all_in_cat = sorted(COMPONENTS_DB.get(category, []), key=lambda c: c["price_inr"])
        candidates = [c for c in all_in_cat if c["price_inr"] <= budget_for_category]

    if not candidates:
        return None

    # Return most expensive that fits (best value within budget).
    return max(candidates, key=lambda c: c["price_inr"])


def _add_mock_ml_score(component: dict, tier: str) -> dict:
    """
    Simulate an ML confidence / suitability score (XGBoost / PyTorch mock).
    Uses numpy to simulate a weighted score based on tier priority & price.
    """
    rng = np.random.default_rng(hash(component["id"] + tier) % (2**31))
    base_score = rng.uniform(0.78, 0.98)
    # Boost score if component explicitly lists this tier
    tier_bonus = 0.05 if tier in component.get("tiers", []) else -0.05
    score = float(np.clip(base_score + tier_bonus, 0.0, 1.0))
    component["ml_confidence"] = round(score, 3)
    return component


def allocate_budget(budget_inr: float, tier: str, currency: str = "INR") -> dict:
    """
    Main allocation entry point.

    Args:
        budget_inr:  Total budget in INR.
        tier:        One of gaming | workstation | content_creation | office.
        currency:    Target currency code for price display.

    Returns:
        dict with keys: tier, budget, currency, components[], allocation{},
        total_cost, remaining_budget, ml_model_version.
    """
    tier = tier.lower()
    if tier not in TIER_ALLOCATIONS:
        tier = "gaming"

    allocations = TIER_ALLOCATIONS[tier]
    selected_components: list[dict] = []
    allocation_breakdown: dict[str, dict] = {}
    total_cost_inr = 0.0

    for category, pct in allocations.items():
        sub_budget = budget_inr * pct
        component = _pick_best_component(category, sub_budget, tier)

        if component:
            comp_copy = {**component}
            comp_copy = _add_mock_ml_score(comp_copy, tier)
            comp_copy["price_converted"] = convert_price(comp_copy["price_inr"], currency)
            selected_components.append(comp_copy)
            total_cost_inr += comp_copy["price_inr"]
            allocation_breakdown[category] = {
                "allocated_pct": round(pct * 100, 1),
                "allocated_amount": convert_price(sub_budget, currency),
                "spent": convert_price(comp_copy["price_inr"], currency),
            }
        else:
            allocation_breakdown[category] = {
                "allocated_pct": round(pct * 100, 1),
                "allocated_amount": convert_price(sub_budget, currency),
                "spent": 0,
                "note": "No component found within budget",
            }

    return {
        "tier": tier,
        "budget": convert_price(budget_inr, currency),
        "budget_inr": budget_inr,
        "currency": currency.upper(),
        "components": selected_components,
        "allocation": allocation_breakdown,
        "total_cost": convert_price(total_cost_inr, currency),
        "total_cost_inr": total_cost_inr,
        "remaining_budget": convert_price(budget_inr - total_cost_inr, currency),
        "ml_model_version": "smartbuild-xgb-mock-v1.0",
    }
