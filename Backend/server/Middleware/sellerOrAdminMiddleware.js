const jwt = require('jsonwebtoken');

// Combined middleware function
function adminOrSeller(req, res, next) {
    if (req.user && (req.user.role === 'admin' || req.user.role === 'seller')) {
        return next();
    }
    return res.status(403).json({ message: 'Access denied' });
}

module.exports = adminOrSeller;