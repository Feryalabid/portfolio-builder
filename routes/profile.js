const express = require('express');
const router = express.Router();
const UserProfile = require('../models/userProfile');
const protectRoute = require('../middleware/authMiddleware');

// Create/Update profile
router.post('/', protectRoute, async (req, res) => {
    const { name, skills, projects, github } = req.body;

    try {
        let profile = await UserProfile.findOne({ userId: req.user._id });

        if (profile) {
            profile.name = name;
            profile.skills = skills;
            profile.projects = projects;
            profile.github = github;
            await profile.save();
            return res.json(profile);
        }

        profile = await UserProfile.create({
            userId: req.user._id,
            name,
            skills,
            projects,
            github
        });

        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Get own profile
router.get('/me', protectRoute, async (req, res) => {
    try {
        const profile = await UserProfile.findOne({ userId: req.user._id });
        res.json(profile);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Update a single project
router.put('/project/:index', protectRoute, async (req, res) => {
    const { index } = req.params;
    const { title, description, link } = req.body;

    try {
        const profile = await UserProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        if (!profile.projects[index]) return res.status(404).json({ message: 'Project not found' });

        profile.projects[index] = { title, description, link };
        await profile.save();
        res.json(profile.projects[index]);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Delete a project
router.delete('/project/:index', protectRoute, async (req, res) => {
    const { index } = req.params;

    try {
        const profile = await UserProfile.findOne({ userId: req.user._id });
        if (!profile) return res.status(404).json({ message: 'Profile not found' });

        if (!profile.projects[index]) return res.status(404).json({ message: 'Project not found' });

        profile.projects.splice(index, 1);
        await profile.save();
        res.json({ message: 'Project deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
