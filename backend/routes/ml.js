/**
 * routes/ml.js — Proxy routes to the Flask ML microservice.
 * The Node.js gateway proxies optimization requests to Flask
 * so the frontend only talks to one backend.
 *
 * POST /api/ml/optimize — Proxy to Flask /api/optimize
 */
const express = require("express");
const axios = require("axios");
const { protect } = require("../middleware/auth");

const router = express.Router();

const ML_URL = process.env.ML_SERVICE_URL || "http://localhost:5050";

// ─── Optimize Build (proxied to Flask) ────────────────────────────────────────
router.post("/optimize", protect, async (req, res) => {
  try {
    const { budget, tier, currency } = req.body;

    const response = await axios.post(`${ML_URL}/api/optimize`, {
      budget,
      tier,
      currency,
    });

    res.json(response.data);
  } catch (err) {
    // Forward Flask error if available
    if (err.response) {
      return res.status(err.response.status).json(err.response.data);
    }
    res.status(503).json({
      error: "ML service unavailable. Make sure Flask is running on port 5050.",
    });
  }
});

// ─── Get Components (proxied to Flask) ────────────────────────────────────────
router.get("/components", async (req, res) => {
  try {
    const response = await axios.get(`${ML_URL}/api/components`, {
      params: req.query,
    });
    res.json(response.data);
  } catch (err) {
    res.status(503).json({ error: "ML service unavailable" });
  }
});

// ─── Get Currencies (proxied to Flask) ────────────────────────────────────────
router.get("/currencies", async (req, res) => {
  try {
    const response = await axios.get(`${ML_URL}/api/currencies`);
    res.json(response.data);
  } catch (err) {
    res.status(503).json({ error: "ML service unavailable" });
  }
});

module.exports = router;
