import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true }, // Name of the counter (e.g., 'playerId')
  seq: { type: Number, default: 0 }      // The current sequence number
});

export default mongoose.model('Counter', counterSchema);