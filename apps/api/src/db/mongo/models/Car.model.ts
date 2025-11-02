import mongoose, { Schema } from 'mongoose';

const carSchema = new Schema({
  make: { type: String, required: true },
  model: { type: String, required: true },
  year: { type: Number, required: true },
  engine: { type: String, required: true },
  gearbox: { type: String, enum: ['MANUAL', 'AUTOMATIC'], required: true },
  carPicture: { type: String, required: false },
});

export const Car = mongoose.model('Car', carSchema);
