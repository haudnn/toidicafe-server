import mongoose, { model, Schema } from 'mongoose';
const CommentSchema = new Schema(
  { 
    body: { type: String, required: true },
    date: { type: Date, default: Date.now },
    parentReview: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Review' },
    parentId: { type: mongoose.Types.ObjectId, ref: "Comment", default: null },
    author: { type: mongoose.Types.ObjectId, required: true, ref: "User" },
    likes: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  },
  {
    timestamps: true,
  }
);
export const CommentModel =  model('Comment', CommentSchema);
