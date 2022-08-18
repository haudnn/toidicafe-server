import mongoose, { model, Schema } from 'mongoose';
const ShopSchema = new Schema({
  name: { type: String, required: true },
  images: [{ type: String, required: true }],
  date: { type: Date, default: Date.now },
  description: { type: String, required: true },
  area: { type: String, required: true },
  location: { type: String, required: true },
  priceMin: { type: String, required: true },
  priceMax: { type: String, required: true },
  types: [{ type: String, required: true }],
  tags: [{ type: String, required: true }],
  utilities: [{ type: String, required: true }],
  facebook: { type: String },
  instagram: { type: String},
  timeOpen: { type: String, required: true },
  timeClose: { type: String, required: true },
  menu: [{ type: String }],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});
export default model('Shop', ShopSchema);
