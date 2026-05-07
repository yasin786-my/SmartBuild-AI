"""
app.py — SmartBuild AI Flask ML Microservice
=============================================
Provides endpoints for:
  - /health           → Health check
  - /api/optimize     → Generate optimized PC build (POST)
  - /api/components   → List all components (GET)
  - /api/currencies   → Supported currencies & rates (GET)
"""

import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pydantic import BaseModel, field_validator
from dotenv import load_dotenv

from models.budget_allocator import allocate_budget
from models.components_db import get_all_components
from models.currency import get_supported_currencies, convert_price

# ─── Load environment ─────────────────────────────────────────────────────────
load_dotenv()

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from frontend & gateway


# ─── Pydantic Request Model ───────────────────────────────────────────────────
class OptimizeRequest(BaseModel):
    """Validates incoming optimize requests."""
    budget: float
    tier: str = "gaming"
    currency: str = "INR"

    @field_validator("budget")
    @classmethod
    def budget_must_be_positive(cls, v: float) -> float:
        if v < 10000:
            raise ValueError("Budget must be at least ₹10,000")
        if v > 1000000:
            raise ValueError("Budget cannot exceed ₹10,00,000")
        return v

    @field_validator("tier")
    @classmethod
    def tier_must_be_valid(cls, v: str) -> str:
        valid = {"gaming", "workstation", "content_creation", "office"}
        if v.lower() not in valid:
            raise ValueError(f"Tier must be one of: {', '.join(valid)}")
        return v.lower()

    @field_validator("currency")
    @classmethod
    def currency_must_be_supported(cls, v: str) -> str:
        supported = {"INR", "USD", "EUR", "GBP"}
        if v.upper() not in supported:
            raise ValueError(f"Currency must be one of: {', '.join(supported)}")
        return v.upper()


# ─── Routes ────────────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "healthy",
        "service": "smartbuild-ml",
        "version": "1.0.0",
    })


@app.route("/api/optimize", methods=["POST"])
def optimize():
    """
    Generate an optimized PC build.

    Expects JSON body:
      { "budget": 85000, "tier": "gaming", "currency": "INR" }

    Budget should always be provided in INR.
    """
    try:
        data = request.get_json(force=True)
        req = OptimizeRequest(**data)
    except Exception as e:
        return jsonify({"error": str(e)}), 400

    result = allocate_budget(
        budget_inr=req.budget,
        tier=req.tier,
        currency=req.currency,
    )
    return jsonify(result)


@app.route("/api/components", methods=["GET"])
def components():
    """Return the full component catalog, optionally filtered by category."""
    category = request.args.get("category")
    all_comps = get_all_components()

    if category and category in all_comps:
        return jsonify({category: all_comps[category]})

    return jsonify(all_comps)


@app.route("/api/currencies", methods=["GET"])
def currencies():
    """Return supported currencies with symbols and conversion rates."""
    return jsonify({
        "base": "INR",
        "currencies": get_supported_currencies(),
    })


# ─── Entry Point ───────────────────────────────────────────────────────────────
if __name__ == "__main__":
    port = int(os.getenv("FLASK_PORT", 5050))
    debug = os.getenv("FLASK_ENV", "development") == "development"
    print(f"🧠 SmartBuild ML Service starting on port {port}")
    app.run(host="0.0.0.0", port=port, debug=debug)
