import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();
const {
    DB_USER,
    DB_PASSWORD,
    DB_NAME,
} = process.env;
export async function connect() {
  try {
    await mongoose.connect(`mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_NAME}.kkwk1sk.mongodb.net/?retryWrites=true&w=majority`)
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('err', err);
  }
}
