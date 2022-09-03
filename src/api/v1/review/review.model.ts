import mongoose, { model, Schema } from 'mongoose';
const ReviewSchema = new Schema({
  title:  { type: String, required: true },
  body:  { type: String, required: true },
  images: [{ type: String, required: true }],
  date: { type: Date, default: Date.now },
  shop: { type: mongoose.Schema.Types.ObjectId, ref: 'Shop' },
  author: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  star: [{ name: String, point: Number }],
  anonymous: {type: Boolean}
});
export default model('Review', ReviewSchema);
// Khi mà người dùng vote sao xong => covert ( 100 => 5 sao case khác same ) => save => shop nó sẽ chọc vào đây
// => lấy ra star tương ứng shop id => tính trung bình => trả về cùng với shop
