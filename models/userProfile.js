const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: String,
    description: String,
    link: String
});

const userProfileSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    name: String,
    skills: [String],
    projects: [projectSchema],
    github: String
});

module.exports = mongoose.models.UserProfile || mongoose.model('UserProfile', userProfileSchema);
