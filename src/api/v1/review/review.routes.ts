import express from 'express';
import { fileUpload } from '../middlewares/fileUpload';
import verifyToken from '../middlewares/verifyToken'
import { createReview, likeReview, unLikeReview, getReviewByShopId, deleteReview, getListReview } from '../review/review.controller'

const router = express.Router();
router.get("/" , getListReview)
router.delete("/:id", deleteReview)
router.use(verifyToken)
router.post("/", fileUpload.array('image'), createReview)
router.get("/new/:id", getReviewByShopId)
router.post("/like", likeReview)
router.post("/unlike", unLikeReview)



export default router
