import jwt from 'jsonwebtoken';
const isAuthenticated=async (req,res,next) => {
    try {
        const token=req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Not authorized, no token provided',success: false});
        }
        const decoded=jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded) 
            {
                return res.status(401).json({ message: 'Invalid token',success: false});
            }

            req.user=decoded.userId;
            next();
    } catch (error) {
        return res.status(401).json({ message: 'Not authorized, token is invalid' });
    }
}

export default isAuthenticated;