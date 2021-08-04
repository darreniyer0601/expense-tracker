const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Get token from header
    const token = req.header('x-auth-token');

    // Check if token exists
    if (!token) {
        return res.status(401).json({ msg: 'Not Authorized' });
    }

    try {
        const payload = jwt.verify(token, 'jwtSecret');

        req.user = payload.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token invalid' });
    }
}