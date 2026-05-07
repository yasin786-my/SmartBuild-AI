/**
 * routes/auth.js — Authentication routes.
 * POST /api/auth/register  — Create new user
 * POST /api/auth/login     — Authenticate & return JWT
 * GET  /api/auth/me        — Get current user (protected)
 */
const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

/**
 * Generate a JWT token for a given user ID.
 */
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });

// ─── Register ─────────────────────────────────────────────────────────────────
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredCurrency: user.preferredCurrency,
      },
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ─── Login ────────────────────────────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    // Find user and include password field for verification
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        preferredCurrency: user.preferredCurrency,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── Get Current User ─────────────────────────────────────────────────────────
router.get("/me", protect, async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      preferredCurrency: req.user.preferredCurrency,
      createdAt: req.user.createdAt,
    },
  });
});

module.exports = router;
