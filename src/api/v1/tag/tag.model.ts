import mongoose, { model, Schema } from 'mongoose';
const TagSchema = new Schema({
  name: { type: String, required: true },
  slug: { type:  String, required: true },
  date: { type: Date, default: Date.now },
  shop : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
});
export default model('Tag', TagSchema);
