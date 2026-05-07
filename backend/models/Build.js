/**
 * models/Build.js — Mongoose schema for saved PC builds.
 * Each build belongs to a user and stores the full optimization result.
 */
const mongoose = require("mongoose");

const componentSchema = new mongoose.Schema(
  {
    id: String,
    name: String,
    brand: String,
    category: String,
    price_inr: Number,
    price_converted: Number,
    tiers: [String],
    specs: mongoose.Schema.Types.Mixed,
    ml_confidence: Number,
  },
  { _id: false }
);

const buildSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      default: "Untitled Build",
      trim: true,
      maxlength: 100,
    },
    tier: {
      type: String,
      enum: ["gaming", "workstation", "content_creation", "office"],
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    budget_inr: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "INR",
    },
    components: [componentSchema],
    allocation: {
      type: mongoose.Schema.Types.Mixed,
    },
    total_cost: Number,
    total_cost_inr: Number,
    remaining_budget: Number,
    ml_model_version: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Build", buildSchema);
