import express from 'express';
import verifyToken from '../middlewares/verifyToken'
import { createReview, likeReview, unLikeReview } from '../review/review.controller'

const router = express.Router();

router.use(verifyToken)
router.post("/", createReview)
router.post("/like", likeReview)
router.post("/like", unLikeReview)

export default router
