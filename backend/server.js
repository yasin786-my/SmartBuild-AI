/**
 * server.js — SmartBuild AI Express Gateway
 * ==========================================
 * Entry point for the Node.js backend.
 * Connects to MongoDB, mounts API routes, and starts the server.
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const connectDB = require("./config/db");

// ─── Import Routes ────────────────────────────────────────────────────────────
const authRoutes = require("./routes/auth");
const buildRoutes = require("./routes/builds");
const mlRoutes = require("./routes/ml");

// ─── Initialize Express ───────────────────────────────────────────────────────
const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json({ limit: "10mb" }));

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: "Too many requests, please try again later." },
});
app.use("/api/", limiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: "smartbuild-gateway", version: "1.0.0" });
});

// ─── Mount Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/builds", buildRoutes);
app.use("/api/ml", mlRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 SmartBuild Gateway running on port ${PORT}`);
    console.log(`📡 ML Service expected at ${process.env.ML_SERVICE_URL || "http://localhost:5050"}`);
  });
});
