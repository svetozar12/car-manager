import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true },
  avatar: { type: String, required: false },
  // one users has many cars
});

export const User = mongoose.model('User', userSchema);
