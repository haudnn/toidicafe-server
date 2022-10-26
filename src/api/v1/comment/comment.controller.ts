import { RequestHandler } from 'express';
import that from './comment.service';
const {
  createCommentService,
  getCommentsByReviewIdService,
  likeCommentServive,
  unLikeReviewService,
} = that;
interface responseService {
  code: number;
  message: string;
  meta: any;
  comments: any;
  comment: any;
}
export const createComment: RequestHandler = async (req, res, next) => {
  try {
    const { body, reviewId, parentId, author } = req.body;
    const userId = req.user;
    const { code, message, comment } = (await createCommentService({
      body,
      parentReview: reviewId,
      parentId,
      author,
      userId,
    })) as responseService;
    return res.status(code).json({ message, comment });
  } catch (err) {
    console.error(err);
  }
};
export const getCommentsByReviewId: RequestHandler = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { code, message, comments } = (await getCommentsByReviewIdService(
      reviewId
    )) as responseService;
    return res.status(code).json({
      message,
      comments,
    });
  } catch (err) {
    console.log(err);
  }
};
export const likeComment: RequestHandler = async (req, res, next) => {
  try {
    const { commentId } = req.body;
    const userId = req.user;
    const { code, message } = (await likeCommentServive(commentId, userId)) as responseService;
    return res.status(code).json({
      message,
    });
  } catch (err) {
    console.log(err);
  }
};
export const unLikeComment: RequestHandler = async (req, res, next) => {
  try {
    const { commentId } = req.body;
    const userId = req.user;
    const { code, message } = (await unLikeReviewService(commentId, userId)) as responseService;
    return res.status(code).json({
      message,
    });
  } catch (err) {
    console.log(err);
  }
};
