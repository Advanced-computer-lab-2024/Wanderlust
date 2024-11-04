const jwt = require('jsonwebtoken');

const tourist = (req, res, next) => {
    if (req.user && req.user.role === 'tourist') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Tourists only' });
    }
};

module.exports = tourist;