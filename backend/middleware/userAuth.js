import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

const userAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.json({ success: false, message: "Access denied. No token provided." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userModel.findById(decoded.id);
        
        if (!user) {
            return res.json({ success: false, message: "Invalid token. User not found." });
        }

        req.user = user;
        next();
    } catch (error) {
        console.log('User auth error:', error);
        
        if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: "Token expired. Please login again." });
        } else if (error.name === 'JsonWebTokenError') {
            return res.json({ success: false, message: "Invalid token format." });
        }
        
        res.json({ success: false, message: "Invalid token." });
    }
};

export default userAuth;

