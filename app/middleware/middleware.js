// LIBRARY IMPROT
const jwt = require('jsonwebtoken');

// CONSTANT IMPORT
const { JWT_SECRET }    = process.env;

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.locals = {user: decoded.userID};
        
        return next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = { authenticateToken };