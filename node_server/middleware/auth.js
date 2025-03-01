const jwt = require('jsonwebtoken');
const JWT_SECRET = require('../config/secrets')

const auth = (req, res, next) => {
     const token = req.header('Authorization')?.split(' ')[1];
     if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

     try {
         const decode = jwt.verify(token, JWT_SECRET);
         req.user = decode;
         next();
     } catch (error) {
         res.status(400).json({ error: 'Invalid Token' });
     }
};

module.exports = auth;