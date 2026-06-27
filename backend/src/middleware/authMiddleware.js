const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: "Access denied. Please login first." });
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded;
        console.log("User: ", req.user);
        next();
    } catch (err) {
        
        res.clearCookie('token');
        return res.status(403).json({ message: "Session expired. Please login again." });
    }
};

module.exports = verifyToken;