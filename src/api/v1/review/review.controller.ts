import that from './review.service';
import { RequestHandler } from 'express';
import { uploadToCloudinary } from '../helpers';
import validator from './review.validator';

interface responseService {
  code: number;
  message: string;
  review: any;
}
const { createReviewService, likeReviewService, unLikeReviewService } = that;
export const createReview: RequestHandler = async (req, res, next) => {
  try {
    const urls = [];
    let files: any = req.files;
    if (files.length > 0) {
      for (let file of files) {
        const uploadedResponse = await uploadToCloudinary(file.path);
        urls.push(uploadedResponse);
      }
    }
    let images: Array<any> = urls;
    const { title, body, shopId, anonymous, userId, star } = req.body;
    const validatorResult = validator(title, body);
    if (!validatorResult) return res.status(401).json({ message: 'Invalid' });
    const { code, message, review } = (await createReviewService({
      title,
      body,
      shop: shopId,
      anonymous,
      author: userId,
      star,
      images,
    })) as responseService;
    res.status(code).json({
      message: message,
      review,
    });
  } catch (err) {
    console.log(err);
  }
};
export const likeReview: RequestHandler = async (req, res, next) => {
  try {
    const { reviewId, userId } = req.body;
    const { code, message, review } = (await likeReviewService(
      reviewId,
      userId
    )) as responseService;
    res.status(code).json({
      message,
      review,
    });
  } catch (err) {
    console.log(err);
  }
};
export const unLikeReview: RequestHandler = async (req, res, next) => {
  try {
    const { reviewId, userId } = req.body;
    const { code, message, review } = (await unLikeReviewService(
      reviewId,
      userId
    )) as responseService;
    res.status(code).json({
      message,
      review,
    });
  } catch (err) {
    console.log(err);
  }
};
