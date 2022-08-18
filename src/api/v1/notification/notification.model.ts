import mongoose, { model, Schema } from 'mongoose';
const NotificationSchema = new Schema(
  { 
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    review: { type: mongoose.Schema.Types.ObjectId, ref: "Review" },
    comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
    notificationType: {type: String,enum: ["like", "comment", "follow"],},
    read: {type: Boolean,default: false,},
    date: { type: Date, default: Date.now },
  },
);
export const NotificationModel =  model('Notification', NotificationSchema);
