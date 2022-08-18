import _User from './user.model';
import bcrypt from 'bcryptjs';
import { createJWTtoken, createRefreshJWTtoken } from '../helpers/';
import dotenv from 'dotenv';
dotenv.config();
const DEFAULT_AVATAR =
  'https://res.cloudinary.com/mycloudiary/image/upload/v1660812252/toidicaphe/default-avt_phrdn2.jpg';

interface User {
  displayName: string;
  email: string;
  password: string;
}
const that = {
  regisUser: async ({ displayName, email, password }: User) => {
    try {
      const existingUser = await _User.findOne({ email });
      if (existingUser) {
        return {
          code: 400,
          message: 'Người dùng đã tồn tại, vui lòng thử lại!',
        };
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await _User.create({
        displayName,
        email,
        password: hashedPassword,
        avatar: DEFAULT_AVATAR
      });
      const token = createJWTtoken(user.id);
      const rftoken = createRefreshJWTtoken(user.id)
      return {
        code: 201,
        message: 'success',
        user: {
          displayName: user.displayName,
          userId: user.id,
          email: user.email,
          avatar: user.avatar,
          token,
          rftoken
        }
      };
    } catch (err) {
      console.error(err);
    }
  },
  loginUser: async (email: string, password: string) => {
    try{
      const existingUser = await _User.findOne({ email });
      if (!existingUser) {
        return {
          code: 403,
          message: 'Email bạn vừa nhập không chính xác, vui lòng thử lại!',
        };
      }
      const isValidPassword = await bcrypt.compare(password, existingUser.password);
      if (!isValidPassword) {
        return {
          code: 403,
          message: 'Mật khẩu bạn vừa nhập không chính xác!',
        };
      }
      const token =  createJWTtoken(existingUser.id);  
      const rftoken = createRefreshJWTtoken(existingUser.id)
      return {
        code: 201,
        message: 'success',
        user: {
          displayName: existingUser.displayName,
          userId: existingUser.id,
          email: existingUser.email,
          avatar: existingUser.avatar,
          token,
          rftoken
        }
      };
    }
    catch(err) {
      console.error(err);
    }
  },
  refreshTokenUser: async (info: string) => {
    try{
      const user = await _User.findById(info)
      if (!user) {
        return {
          code: 403,
          message: 'Không tìm thấy người dùng',
        };
      }
      const token = createJWTtoken(user._id)
      return {
        code: 200,
        message: 'success',
        user : {
          displayName: user.displayName,
          userId: user.id,
          email: user.email,
          avatar: user.avatar,
          token,
        }
      }
    }
    catch (err) {
      console.error(err);
    }
  }
};
export default that;
