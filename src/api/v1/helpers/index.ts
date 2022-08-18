import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary'
dotenv.config();
const { JWT_KEY, JWT_KEY_REFRESH, CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});
export const uploadToCloudinary = async (path: string) => {
  try {
    const uploadedResponse = await cloudinary.uploader.upload(path, {
      folder:"toidicaphe"
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
export const createRefreshJWTtoken = (id: any) => {
  let jwtToken;
  try {
    jwtToken = jwt.sign({ userId: id }, JWT_KEY_REFRESH || '', { expiresIn: '7d' });
  } catch (err) {
    console.log(err);
  }
  return jwtToken;
};