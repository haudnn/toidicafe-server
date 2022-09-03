import mongoose, { model, Schema } from 'mongoose';
const UserSchema = new Schema(
  {
    displayName: { type: String, required: true },
    userName: { type: String },
    role: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number},
    avatar: { type: String},
    verified:{ type: Boolean, default: false},
    date: { type: Date, default: Date.now },
    facebook: { type: String },
    instagram: { type: String},
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Shop' }],
    reviews: [{ type: mongoose.Types.ObjectId, ref: 'Review' }],
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
  }
);
export default model('User', UserSchema);
