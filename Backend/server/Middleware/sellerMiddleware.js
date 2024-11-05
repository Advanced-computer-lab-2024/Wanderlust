const jwt = require('jsonwebtoken');

const seller = (req, res, next) => {
    if (req.user && req.user.role === 'seller') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Sellers only' });
    }
};

module.exports = seller;