const jwt = require('jsonwebtoken');
const User = require('../models/user'); 

const JWT_SECRET = process.env.JWT_SECRET;

const protectRoute = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized: No token provided ☺️' });
    }
    const token = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded._id || decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found 😔' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token 😔', error: err.message });
  }
};

module.exports = protectRoute;
