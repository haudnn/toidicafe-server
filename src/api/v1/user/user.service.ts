import _User from './user.model';
import bcrypt from 'bcryptjs';
import { createJWTtoken, createRefreshJWTtoken, removeSpace } from '../helpers/';
import dotenv from 'dotenv';
dotenv.config();
const DEFAULT_AVATAR =
  'https://res.cloudinary.com/mycloudiary/image/upload/v1663473826/toidicaphe/avt_default_xc5y8x.jpg';

interface User {
  displayName: string;
  email: string;
  password: string;
  role: string
}
const that = {
  regisUser: async ({ displayName, email, password, role= "user" }: User) => {
    try {
      const existingUser = await _User.findOne({ email });
      if (existingUser) {
        return {
          code: 400,
          message: 'Người dùng đã tồn tại, vui lòng thử lại!',
        };
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      const userName = removeSpace(displayName)
      const user = await _User.create({
        displayName,
        userName,
        email,
        role,
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
      const existingUser = await _User.findOne({ email })
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
          avatar: existingUser.avatar,
          id: existingUser.id,
          token,
          rftoken
        }
      };
    }
    catch(err) {
      console.error(err);
    }
  },
  refreshTokenUser: async (userId: string) => {
    try{
      const user = await _User.findById(userId)
      if (!user) {
        return {
          code: 403,
          message: 'Không tìm thấy người dùng',
        };
      }
      const token = createJWTtoken(user.id)
      return {
        code: 200,
        message: 'success',
        token,
      }
    }
    catch (err) {
      console.error(err);
    }
  },
  getCurrentUser: async (id: string) => {
    try {
      const user = await _User.findById(id)
      .select("bookmarks displayName avatar")
      console.log(user)
      if(!user) {
        return {
          code: 401,
          message: "Can't find user by ID"
        };
      }
      return {
        code: 200,
        message: "success",
        user
      };
    }
    catch (err) {

    }
  }
};
export default that;
