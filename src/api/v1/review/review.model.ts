import mongoose, { model, Schema } from 'mongoose';
const ReviewSchema = new Schema({
  body:  { type: String, required: true },
  image: [{ type: String, required: true }],
  date: { type: Date, default: Date.now },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  star: [{ name: String, point: Number }],
});
export const ReviewModel = model('Review', ReviewSchema);
