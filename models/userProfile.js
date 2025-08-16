const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
  title: { type: String, trim: true, required: true },
  description: { type: String, trim: true },
  link: { type: String, trim: true }
}, { _id: false });

const userProfileSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: true },
  email: { type: String, trim: true, required: true, unique: true },
  skills: [{ type: String, trim: true, minlength: 1 }],
  projects: [projectSchema],
  github: { type: String, trim: true },
  bio: { type: String, trim: true }, 
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
}, { timestamps: true });

module.exports = mongoose.model("UserProfile", userProfileSchema);
