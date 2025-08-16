const jwt = require('jsonwebtoken');
const User = require('../models/user');

const JWT_SECRET = process.env.JWT_SECRET ;

const protectRoute = async (req, res, next) => {
    try {
        // Check for Authorization header
        const header = req.headers.authorization;
        if (!header || !header.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized: No token provided ☺️' });
        }

        // Extract token
        const token = header.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Get user from DB without password
        const user = await User.findById(decoded._id || decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized: User not found 😔' });
        }

        // Attach user object to req
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Unauthorized: Invalid or expired token 😔', error: err.message });
    }
};

module.exports = protectRoute;
