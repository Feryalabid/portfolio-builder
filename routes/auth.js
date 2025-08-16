const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};
    if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: "Email already registered" });
    const user = new User({ name, email, password });
    await user.save();
    res.json({ message: "User registered successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: "Email & password required" });

  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  // IMPORTANT: sign with _id (so protectRoute finds decoded._id)
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({
    token,
    user: { _id: user._id, name: user.name, email: user.email }
  });
});

// Simple "who am I" endpoint using protectRoute (nice for testing)
router.get("/me", protectRoute, (req, res) => {
  res.json(req.user);
});

module.exports = router;
