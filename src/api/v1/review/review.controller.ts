import that from './review.service';
import { RequestHandler } from 'express';
import { uploadToCloudinary } from '../helpers';
import validator from './review.validator';

interface responseService {
  code: number;
  message: string;
  review: any;
  reviews: any;
  reviewsCount: number;
  avgRate: number;
  meta: any
}
interface Star {
  position: string;
  space: string;
  price: string;
  drink: string;
  service: string;
}
const {
  createReviewService,
  likeReviewService,
  unLikeReviewService,
  getReviewByShopIdService,
  deleteReviewService,
  getListReviewService,
} = that;
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
    const { title, body, shopId, anonymous, star } = req.body;
    const userId = req.user;
    const { position, space, price, drink, service } = star;
    const { code, message} = (await createReviewService({
      title,
      body,
      shop: shopId,
      anonymous,
      author: userId,
      star: {
        ...star,
        position: +position,
        space: +space,
        price: +price,
        drink: +drink,
        service: +service,
      },
      images,
    })) as responseService;
    res.status(code).json({
      message: message,
    });
  } catch (err) {
    console.log(err);
  }
};
export const likeReview: RequestHandler = async (req, res, next) => {
  try {
    const { reviewId} = req.body;
    const userId = req.user;
    const { code, message } = (await likeReviewService(
      reviewId,
      userId
    )) as responseService;
    res.status(code).json({
      message,
    });
  } catch (err) {
    console.log(err);
  }
};
export const unLikeReview: RequestHandler = async (req, res, next) => {
  try {
    const { reviewId } = req.body;
    const userId = req.user;
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
export const getReviewByShopId: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { code, message, reviews, reviewsCount, avgRate } = (await getReviewByShopIdService(
      id
    )) as responseService;
    return res.status(code).json({
      message,
      reviews,
      reviewsCount,
      avgRate,
    });
  } catch (err) {
    return res.status(500).json({
      message: 'Không thể fetching shops',
    });
  }
};
export const deleteReview: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { code, message } = await deleteReviewService(
      id
    ) as responseService;
    return res.status(code).json({
      message,
    });
  } catch (err) {
    console.log(err);
  }
};
export const getListReview: RequestHandler = async (req, res, next) => { 
  try{
    const {page = 1} = req.query
    const { code, message, reviews, meta } = await getListReviewService(+page) as responseService;
    return res.status(code).json({
      message,
      reviews,
      meta,
    });
  }
  catch (err) {

  }
}
