import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
 
  fullName: { type: String, required: true },
  profession: { type: String, enum: ['Business', 'Salaried', 'Self Employed'] },
  photo: { type: String }, 
  mobileNumber: { type: String, required: true, unique: true },
  whatsappNumber: { type: String },
  emailId: { type: String, required: true, unique: true },
  residentialAddress: { type: String },
  aadharNumber: { type: String, required: true, unique: true  },
  paymentMethod: { type: String }, 

  skills: {
    batting: { type: String, enum: ['Right Hand', 'Left Hand', 'None'], default: 'None' },
    bowling: { type: String, enum: ['Right Hand', 'Left Hand', 'None'], default: 'None' },
    fieldingPreference: { type: String }
  },

  cricheroesId: { type: String },
  instagramId: { type: String },

  declarationAccepted: { type: Boolean, required: true },
  signatureName: { type: String, required: true },
  submissionDate: { type: Date, required: true },
  submissionPlace: { type: String, required: true }
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

const Player = mongoose.model('Player', PlayerSchema);

export default Player;