import jwt, { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';
import * as express from 'express';
dotenv.config();
import User from '../user/user.model';
const { JWT_KEY } = process.env;

declare module 'express' {
  export interface Request {
    user: any;
  }
}
interface ResponseError extends Error {
    statusCode?: number;
}
export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        const err  = new Error ("Authentication failed") as ResponseError
        err.statusCode = 500
        return next(err)
    }
    const decoded = jwt.verify(token, JWT_KEY || '') as JwtPayload;
    if (!decoded) return res.status(401).json({ message: "Authorization not valid" });

    const user = await User.findOne({ _id: decoded.id });
    if (!user) return res.status(401).json({ message: "Unauthenticated User" });
    
    req.user = user._id;
    next();
  } catch (err) { 
    return next(res.status(403).json({message: "Authentication failed"}))
    // return next(new HttpError('Authentication failed!', 403));
  }
};
