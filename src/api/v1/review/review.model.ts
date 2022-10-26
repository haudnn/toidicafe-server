import mongoose, { model, Schema } from 'mongoose';
const ReviewSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  images: [{ type: String, required: true }],
  date: { type: Date, default: Date.now },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  star: {
    position: { type:Number},
    space : { type:Number },
    price : { type:Number },
    drink: { type:Number },
    service: { type:Number },
  },
  avgStar : { type:Number },
  anonymous: { type: Boolean, default: false},
});
export default model('Review', ReviewSchema);

