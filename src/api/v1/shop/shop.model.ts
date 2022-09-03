import mongoose, { model, Schema } from 'mongoose';
// mongoose.plugin(slug);
const ShopSchema = new Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  // area: { type: String, required: true },
  address: { geo: { type: Object, required: true }, specific: { type: String, required: true } },
  // location: { type: String, required: true },
  // priceMin: { type: String, required: true },
  // priceMax: { type: String, required: true },
  price: { min: { type: Number, required: true }, max: { type: Number, required: true } },
  purposes: [{ type: String, required: true }], // song ao
  tags: [{ type: String, required: true }],
  benefits: [{ type: String, required: true }], // tien ich
  social: { facebook: { type: String }, instagram: { type: String } },
  // facebook: { type: String },
  // instagram: { type: String },
  timeOpen: { type: String, required: true },
  timeClose: { type: String, required: true },
  menu: [{ type: String }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  bookmarks: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
});
ShopSchema.index({ area: 'text' });
export default model('Shop', ShopSchema);
