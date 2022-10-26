import Comment from '../interfaces/Comment';
import _Comment from './comment.model';
import _Review from '../review/review.model';
import _User from '../user/user.model';
import notificationsService from '../notification/notification.service';
const { commentNotification } = notificationsService;
const { likeNotification, removeLikeNotification } = notificationsService;
const that = {
  createCommentService: async ({ body, parentReview, parentId, author, userId }: Comment) => {
    let review;
    try {
      review = await _Review.findById(parentReview);
    } catch (err) {
      return {
        code: 500,
        message: 'Creating comment failed, please try again',
      };
    }
    if (!review) {
      return {
        code: 404,
        message: 'Could not find review for provided ID',
      };
    }

    let user;
    try {
      user = await _User.findById(author);
    } catch (err) {
      return {
        code: 500,
        message: 'Creating comment failed, please try again',
      };
    }
    if (!user) {
      return {
        code: 404,
        message: 'Could not find user for provided ID',
      };
    }
    try {
      let comment: any = await _Comment.create({ body, parentReview, parentId, author })
      await _Review.findByIdAndUpdate(
        review._id,
        { $addToSet: { comments: comment._id } },
        { new: true }
      );
      await _User.findByIdAndUpdate(
        user.id,
        { $addToSet: { comments: comment._id } },
        { new: true }
      );
      const covertAuthor = review?.author + '';
      if (covertAuthor !== userId) {
        await commentNotification(userId, review.id, comment.id, covertAuthor);
      }
      return { code: 200, message: 'success', comment : {
        body: comment.body,
        parentReview : comment.parentReview,
        parentId :comment.parentId,
        likes: comment.likes,
        id: comment._id,
        date: comment.date,
        author : {
          userName: user.userName,
          displayName: user.displayName,
          avatar: user.avatar, 
        }
      } };
    } catch (err) {
      console.log(err);
    }
  },
  getCommentsByReviewIdService: async (reviewId: string) => {
    let comments;
    try {
      comments = await _Comment.find({ parentReview: reviewId })
      .populate('author' ,'avatar displayName userName');
      if (!comments || comments.length === 0) {
        return { code: 200, message: 'No comments for the post' };
      }
      return {
        code: 200,
        message: 'success',
        comments: comments.map((comment) => comment.toObject({ getters: true })),
      };
    } catch (err) {
      console.log(err);
    }
  },
  likeCommentServive: async (commentId: string, userId: string) => {
    let comment;
    console.log(commentId)
    try {
      comment = await _Comment.findByIdAndUpdate(
        commentId,
        { $addToSet: { likes: userId }},
        { new: true }
      );
      console.log(comment);
      // const authorId = comment?.author + '';
      // if (authorId !== userId) {
      //   await likeNotification(userId, commentId, authorId);
      // }
      return {
        code: 200,
        message: 'success',
      };
    } catch (err) {
      console.log(err);
    }
  },
  unLikeReviewService: async (commentId: string, userId: string) => {
    let comment;
    try {
      comment = await _Comment.findByIdAndUpdate(
        commentId,
        { $pull: { likes: userId } },
        { new: true }
      );
      const authorId = comment?.author + '';
      if (authorId !== userId) {
        await removeLikeNotification(userId, commentId, authorId);
      }
      return {
        code: 200,
        message: 'success',
      };
    } catch (err) {
      console.log(err);
    }
  },
};

export default that;
