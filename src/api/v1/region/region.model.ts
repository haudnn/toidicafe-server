import mongoose, { model, Schema } from 'mongoose';
const RegionSchema = new Schema({
  name: { type: String, required: true },
  slug: { type:  String, required: true },
  thumbnail: { type:  String, required: true },
  date: { type: Date, default: Date.now },
  count: { type: Number, required: true, default: 0 },
  shop : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],

});
export default model('Region', RegionSchema);
