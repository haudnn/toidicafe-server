import _Review from './review.model';
import Review from '../interfaces/Review';
import notificationsService from '../notification/notification.service';
import { formatStar } from '../helpers';

const { likeNotification, removeLikeNotification } = notificationsService;

const that = {
  createReviewService: async ({ title, body, shop, star, images, anonymous, author }: Review) => {
    const format = formatStar(star);
    const { starFormat, avgStar } = format;
    try {
      const review = await _Review.create({
        title,
        body,
        shop,
        author,
        star: starFormat,
        avgStar,
        anonymous: anonymous === 'true' ? true : false,
        images,
      });
      return {
        code: 201,
        message: 'success',
        review,
      };
    } catch (err) {
      console.log(err);
    }
  },
  likeReviewService: async (reviewId: string, userId: string) => {
    let review;
    try {
      review = await _Review.findByIdAndUpdate(
        reviewId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
      const authorId = review?.author + '';
      if (authorId !== userId) {
        await likeNotification(userId, reviewId, authorId);
      }
      return {
        code: 200,
        message: 'success',
        review,
      };
    } catch (err) {
      console.log(err);
    }
  },
  unLikeReviewService: async (reviewId: string, userId: string) => {
    let review;
    try {
      review = await _Review.findByIdAndUpdate(
        reviewId,
        { $pull: { likes: userId } },
        { new: true }
      );
      const authorId = review?.author + '';
      if (authorId !== userId) {
        await removeLikeNotification(userId, reviewId, authorId);
      }
      return {
        code: 200,
        message: 'success',
        review,
      };
    } catch (err) {
      console.log(err);
    }
  },
  getReviewByShopIdService: async (shopId: string) => {
    try {
      let reviewsCount: number = 0;
      let avgRate: number = 0;
      const reviews = await _Review.find({ shop: shopId })
      .select("avgStar anonymous title body date")
      .populate('author','userName displayName avatar')
      reviewsCount = reviews.length;
      const sum = reviews.reduce((acc: any, review) => {
        return acc + review.avgStar;
      }, 0);
      avgRate = sum / reviewsCount;
      return {
        code: 200,
        message: 'success',
        reviews,
        reviewsCount,
        avgRate,
      };
    } catch (err) {
      console.log(err);
    }
  },
  deleteReviewService: async (reviewId: string) => {
    try {
      await _Review.findByIdAndDelete(reviewId)
      return {
        code: 201,
        message: 'Xóa review thành công!',
      };
    } catch (err) {
      console.log(err);
    }
  },
};
export default that;
