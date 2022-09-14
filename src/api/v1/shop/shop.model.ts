import mongoose, { model, Schema } from 'mongoose';
const ShopSchema = new Schema({
  menu: [{ type: String }],
  slug: {type: String, required: true},
  name: { type: String, required: true },
  date: { type: Date, default: Date.now },
  images: [{ type: String, required: true }],
  description: { type: String, required: true },
  time: {open: { type: String }, close: { type: String }},
  social: { facebook: { type: String }, instagram: { type: String } },
  address: { geo: { type: Object, required: true }, specific: { type: String, required: true } },
  price: { min: { type: Number, required: true }, max: { type: Number, required: true } },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  bookmarks: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
  // timeOpen: { type: String, required: true },
  // timeClose: { type: String, required: true },
  // area: { type: String, required: true },
  // location: { type: String, required: true },
  // priceMin: { type: String, required: true },
  // priceMax: { type: String, required: true },
  // facebook: { type: String },
  // instagram: { type: String },
});
export default model('Shop', ShopSchema);
