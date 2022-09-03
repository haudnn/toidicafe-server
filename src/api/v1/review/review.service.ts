import _Review from './review.model';
import Review from '../interfaces/Review';
import notificationsService from '../notification/notification.service'

const { likeNotification, removeLikeNotification } = notificationsService

const that = {
  createReviewService: async ({
    title,
    body,
    shop,
    star,
    images,
    anonymous = false,
    author,
  }: Review) => {
    try {
      const review = await _Review.create({
        title,
        body,
        shop,
        author,
        star,
        anonymous,
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
    let review
    try {
      review = await _Review.findByIdAndUpdate(reviewId, { $addToSet: { likes: userId } }, { new: true });
      const authorId = review?.author + ""
      if (authorId !== userId) {
        await likeNotification(userId, reviewId, authorId);
      }
      return { 
        code:200,
        message:"success",
        review
      }
    } catch (err) {
      console.log(err);
    }
  },
  unLikeReviewService: async (reviewId: string, userId: string) => {
    let review
    try{
      review = await _Review.findByIdAndUpdate(reviewId, { $pull: { likes: userId } }, { new: true })
      const authorId = review?.author + ""
      if(authorId !== userId){
        await removeLikeNotification(userId, reviewId, authorId)
      }
      return { 
        code:200,
        message:"success",
        review
      }
    }
    catch (err) {
      console.log(err);
    }
  }
};
export default that;
