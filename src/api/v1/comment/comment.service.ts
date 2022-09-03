import Comment from '../interfaces/Comment';
import _Comment from './comment.model';
import _Review from '../review/review.model';
import _User from '../user/user.model';
import notificationsService from '../notification/notification.service';
const { commentNotification } = notificationsService;
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
      let createdComment: any = await _Comment.create({ body, parentReview, parentId, author });
      await _Review.findByIdAndUpdate(
        review.id,
        { comments: review.comments.push(createdComment) },
        { new: true }
      );
      await _User.findByIdAndUpdate(
        user.id,
        { comments: user.comments.push(createdComment) },
        { new: true }
      );
      const covertAuthor = review?.author + '';
      if (covertAuthor !== userId) {
        await commentNotification(userId, review.id, createdComment.id, covertAuthor);
      }
      return { code: 200, message: 'success', createdComment };
      // review.comments.push(createdComment);
      // comments.push(createdComment);
    } catch (err) {
      console.log(err);
    }
    // comment user => id comment => createdComment done => comment id => user.comment
    //  push comment id => update => [user.comment] => id comment

    // comment review => id comment => createdComment done => comment id => review.comment
    // push comment id => update => [review.comment] => id comment

    // notification comment => (userId (sender => current user) , review.id , review.author.toString() , createdComment.id)
  },
};
export default that;
