import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
dotenv.config();
const {
  JWT_KEY,
  JWT_KEY_REFRESH,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
export const uploadToCloudinary = async (path: string) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(path, {
      folder: 'toidicaphe',
    });
    return uploadedResponse.url;
  } catch (err) {
    console.log(err);
  }
};

export const createJWTtoken = (id: any) => {
  let jwtToken;
  try {
    jwtToken = jwt.sign({ userId: id }, JWT_KEY || '', { expiresIn: '1h' });
  } catch (err) {
    console.log(err);
  }
  return jwtToken;
};
let refreshTokens: any = [];
export const createRefreshJWTtoken = (id: any) => {
  let jwtRefreshToken;
  try {
    jwtRefreshToken = jwt.sign({ userId: id }, JWT_KEY_REFRESH || '', { expiresIn: '7d' });
    refreshTokens.push(jwtRefreshToken);
  } catch (err) {
    console.log(err);
  }
  return jwtRefreshToken;
};
export const checkedRefreshToken = (refreshToken: string) => {
  if (!refreshTokens.includes(refreshToken)) return 401;
};
export const removeSpace = (str: string) => {
  return str.replace(/\s/g, '');
};
export const formatPrice = (money: any) => {
  return money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};
export const calculateTime = (openTime: string, closeTime: string) => {
  let result;
  let today = new Date();
  today.toLocaleString('en-GB');
  let cur = +`${today.getHours()}${(today.getMinutes() < 10 ? '0' : '') + today.getMinutes()}`;
  const covertOpenTime = +openTime.replace(':', '');
  const covertCloseTime = +closeTime.replace(':', '');
  if (covertOpenTime > cur || cur > covertCloseTime) result = 'closed';
  if (covertOpenTime < cur && cur < covertCloseTime) result = 'openning'; 
  if (covertOpenTime < cur && cur < covertCloseTime && covertCloseTime - cur <= 30) result = 'closeSoon';
  return result;
};
