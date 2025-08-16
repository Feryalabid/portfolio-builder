const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const protectRoute = require("./middleware/protectRoute"); // ← imported (as requested)
const authRoutes = require("./routes/auth");
const profileRoutes = require("./routes/profile");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*", credentials: true }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB error:", err.message));

app.get("/", (_req, res) => res.send("Portfolio Builder API is running"));

// Public + Private routes
app.use("/api/auth", authRoutes);
app.use("/api/profiles", profileRoutes);

// Example protected health route (handy for testing your token quickly)
app.get("/api/health/secure-ping", protectRoute, (req, res) => {
  res.json({ ok: true, user: req.user });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
