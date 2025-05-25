
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const authUser = async (req, res, next) => {
    const { token } = req.cookies;
    

    if (!token) {
        return res.status(401).json({ success: false, message: "Not Authorized: No token" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id)

        if (!user) {
            return res.status(401).json({ success: false, message: "Not Authorized: Invalid token" });
        }

        req.user = { id: user._id };
        console.log("Authenticated User:", req.user);  // Log AFTER setting req.user

        next();
    } catch (error) {
        return res.status(401).json({ success: false, message: `Auth Error: ${error.message}` });
    }
};

export default authUser;
