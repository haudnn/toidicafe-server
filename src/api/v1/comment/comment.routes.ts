import express from 'express';
import verifyToken from '../middlewares/verifyToken';
import { createComment, getCommentsByReviewId, likeComment, unLikeComment } from './comment.controller';
const router = express.Router();

router.get('/:reviewId', getCommentsByReviewId);

router.use(verifyToken);

router.post('/', createComment);
router.post('/like', likeComment)
router.post('/unlike', unLikeComment)
export default router;
