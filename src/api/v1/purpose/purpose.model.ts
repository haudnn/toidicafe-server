import mongoose, { model, Schema } from 'mongoose';
const PurposeSchema = new Schema({
  name: { type: String, required: true },
  slug: { type:  String, required: true },
  thumbnail: { type:  String, required: true },
  color: {type:  String, required: true},
  shop : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
  date: { type: Date, default: Date.now },
});
export default model('Purpose', PurposeSchema);
