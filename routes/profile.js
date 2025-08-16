const express = require("express");
const UserProfile = require("../models/userProfile");
const protectRoute = require("../middleware/protectRoute");

const router = express.Router();

/**
 * PUBLIC: Get all profiles (Dashboard)
 */
router.get("/", async (_req, res) => {
  const profiles = await UserProfile.find().sort({ createdAt: -1 });
  res.json(profiles);
});

/**
 * PUBLIC: Get profile by ID (for viewing)
 */
router.get("/:id", async (req, res) => {
  try {
    const profile = await UserProfile.findById(req.params.id);
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * PRIVATE: Create/Update logged-in user's profile
 */
router.post("/", protectRoute, async (req, res) => {
  try {
    const { name, email, skills = [], projects = [], github = "" } = req.body || {};
    let profile = await UserProfile.findOne({ userId: req.user._id });
    if (profile) {
      profile.set({ name, email, skills, projects, github });
    } else {
      profile = new UserProfile({ name, email, skills, projects, github, userId: req.user._id });
    }
    await profile.save();
    res.json(profile);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PRIVATE: Get own profile
 */
router.get("/me", protectRoute, async (req, res) => {
  const profile = await UserProfile.findOne({ userId: req.user._id });
  res.json(profile);
});

/**
 * PRIVATE: Update profile by ID (owner only)
 */
router.put("/:id", protectRoute, async (req, res) => {
  try {
    const existing = await UserProfile.findById(req.params.id);
    if (!existing) return res.status(404).json({ message: "Profile not found" });
    if (String(existing.userId) !== String(req.user._id)) {
      return res.status(403).json({ message: "Forbidden: you can only edit your own profile" });
    }
    existing.set(req.body || {});
    await existing.save();
    res.json(existing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
