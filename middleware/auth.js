const jwt = require('jsonwebtoken');
const config = require('config');

// Middleware for Authorization - checking if the user has permission to write to the documents
module.exports = (req, res, next) => {
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).send('Access denied.');

    // Verify the JWT Token and get the payload (decoded value)
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        
        req.user = decoded; // req.user._id

        next();
    }
    catch(ex) {
        return res.status(400).send('Invalid token.');
    }
}