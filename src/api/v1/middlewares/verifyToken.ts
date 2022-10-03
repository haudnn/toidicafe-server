import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Response, NextFunction, Request } from "express";
dotenv.config();
import User from '../user/user.model';
const { JWT_KEY, JWT_KEY_REFRESH } = process.env;

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
       res.status(500).json({message: "Authentication failed"})
       return
    }
    const decoded = jwt.verify(token, JWT_KEY || '') as JwtPayload;
    if (!decoded) return res.status(401).json({ message: "Authorization not valid" });
    const user = await User.findOne({ _id: decoded.userId });
    if (!user) return res.status(401).json({ message: "Unauthenticated User" });
    req.user = user._id;
    next();
  } catch (err) { 
    return res.status(403).json({message: "Authentication failed"})
  }
};