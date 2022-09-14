import mongoose, { model, Schema } from 'mongoose';
const BenefitSchema = new Schema({
  name: { type: String, required: true },
  slug: { type:  String, required: true },
  icon: { type:  String, required: true },
  shop : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
  date: { type: Date, default: Date.now },
});
export default model('Benefit', BenefitSchema);
