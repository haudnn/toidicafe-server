import _Notification from './notification.model';

const notificationsService = {
  getAllNotifications: async (userId: string) => {
    try {
      await _Notification.updateMany({ receiver: userId }, { read: true });
      const notifications = await _Notification
        .find({ receiver: userId })
        .sort({ date: 'desc' })
        .populate('receiver')
        .populate('sender')
        .populate('review')
        .populate('comment', 'body');
      return {
        code: 200,
        message: 'success',
        notifications: notifications.map((notification) =>
          notification.toObject({ getters: true })
        ),
      };
    } catch (err) {}
  },
  getUnreadNotifications: async (userId: string) => {
    try {
      const notifications = await _Notification
        .find({ receiver: userId, read: false })
        .populate('receiver')
        .populate('sender')
        .populate('post')
        .populate('comment', 'body');
        return {
            code: 200,
            message: 'success',
            notifications: notifications.map((notification) =>
              notification.toObject({ getters: true })
            ),
          };
    } catch (err) {
        console.error(err);
    }
  },
  likeNotification: async (sender: string, review: string, receiver: string) => {
    try {
      await _Notification.create({ sender, review, receiver, notificationType: 'like' });
      return;
    } catch (err) {
      console.log(err);
    }
  },
  removeLikeNotification: async (sender: string, review: string, receiver: string) => {
    try {
      await _Notification.findOneAndDelete({ sender, review, receiver, notificationType: 'like' });
      return;
    } catch (err) {
      console.log(err);
    }
  },
  commentNotification: async (
    sender: string,
    review: string,
    receiver: string,
    comment: string
  ) => {
    try {
      await _Notification.create({
        sender,
        review,
        receiver,
        comment,
        notificationType: 'comment',
      });
      return;
    } catch (err) {
      console.log(err);
    }
  },
  removeCommentNotification: async (
    sender: string,
    review: string,
    receiver: string,
    comment: string
  ) => {
    try {
      await _Notification.findOneAndDelete({
        sender,
        review,
        receiver,
        comment,
        notificationType: 'comment',
      });
      return;
    } catch (err) {
      console.log(err);
    }
  },
  followNotification: async (sender: string, receiver: string) => {
    try {
      await _Notification.create({ sender, receiver, notificationType: 'follow' });
      return;
    } catch (err) {
      console.log(err);
    }
  },
  removeFollowNotification: async (sender: string, receiver: string) => {
    try {
      await _Notification.findOneAndDelete({ sender, receiver, notificationType: 'follow' });
      return;
    } catch (err) {
      console.log(err);
    }
  },
};
export default notificationsService
