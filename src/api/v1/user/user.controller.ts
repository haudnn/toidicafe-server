import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import that from './user.service';
// import { checkedRefreshToken } from '../helpers/';
dotenv.config();
const { JWT_KEY_REFRESH } = process.env;
interface JwtPayload {
  userId: any;
}
interface reponseService {
  code: number;
  message: string;
  user: any;
  token: string;
}
const { regisUser, loginUser, refreshTokenUser, getCurrentUser } = that;
export const register: RequestHandler = async (req, res, next): Promise<void> => {
  const { displayName, email, password, role } = req.body;
  try {
    const { code, user, message } = (await regisUser({
      displayName,
      email,
      password,
      role,
    })) as reponseService;
    res.status(code).json({
      message: message,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const login: RequestHandler = async (req, res, next): Promise<void> => {
  const { email, password } = req.body;
  try {
    const { code, user, message } = (await loginUser(email, password)) as reponseService;
    res.status(code).json({
      message: message,
      user,
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken: RequestHandler = async (req, res, next) => {
  try {
    const rf_token = req.body.refresh_token;
    if (!rf_token) return res.status(401).json({ message: 'Vui lòng đăng nhập lại!' });
    // const coded = checkedRefreshToken(rf_token)
    // if(coded) return res.status(coded)
    const result:any = jwt.verify(rf_token, JWT_KEY_REFRESH || '');
    if (!result) return res.status(403);
    const { code,  message, token } = (await refreshTokenUser(result.userId)) as reponseService;
    res.status(code).json({
      message: message,
      token,
    });
  } catch (err) {
    next(err);
  }
};
export const currentUser: RequestHandler = async (req, res, next) => {
  try {
    const userId = req.user
    const { code, user, message } = (await getCurrentUser(userId)) as reponseService;
    res.status(code).json({
      message: message,
      user,
    });
  } catch (err) {
    console.log(err);
  }
};
