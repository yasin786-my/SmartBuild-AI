/**
 * routes/builds.js — CRUD routes for saved PC builds.
 * All routes are protected (require JWT).
 *
 * POST   /api/builds      — Save a new build
 * GET    /api/builds      — Get all builds for current user
 * GET    /api/builds/:id  — Get a single build
 * DELETE /api/builds/:id  — Delete a build
 */
const express = require("express");
const Build = require("../models/Build");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes require authentication
router.use(protect);

// ─── Save Build ───────────────────────────────────────────────────────────────
router.post("/", async (req, res) => {
  try {
    const build = await Build.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(build);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Get All User Builds ──────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  try {
    const builds = await Build.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(builds);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get Single Build ─────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const build = await Build.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!build) {
      return res.status(404).json({ error: "Build not found" });
    }
    res.json(build);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Delete Build ─────────────────────────────────────────────────────────────
router.delete("/:id", async (req, res) => {
  try {
    const build = await Build.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!build) {
      return res.status(404).json({ error: "Build not found" });
    }
    res.json({ message: "Build deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
