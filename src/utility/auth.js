const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decode = jwt.verify(token, "key123");
        if (!decode) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decode;
        next();
    } catch (e) {
        return res.status(401).json({ message: 'Token verification failed' });
    }
}
module.exports = auth;