import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true },
  profession: { 
    type: String, 
    enum: ['Business', 'Salaried', 'Self Employed'], 
    required: true // Added required
  },
  photo: { type: String }, 
  mobileNumber: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: (v) => /^\d{10}$/.test(v),
      message: "Mobile number must be exactly 10 digits."
    }
  },
  whatsappNumber: { 
    type: String,
    // Allow empty string to pass validation, otherwise must be 10 digits
    validate: {
      validator: (v) => !v || /^\d{10}$/.test(v),
      message: "WhatsApp number must be exactly 10 digits."
    }
  },
  emailId: { type: String, required: true, unique: true, lowercase: true, trim: true },
  residentialAddress: { type: String },
  aadharNumber: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: (v) => /^\d{12}$/.test(v),
      message: "[Aadhaar Redacted] must be exactly 12 digits long."
    }
  },
  utrNumber: { type: String, unique: true, required: true },
  utrReceipt: { type: String, required: true },
  jerseyName: { type: String, required: true, trim: true },
  jerseyNumber: { type: String, required: true },
  jerseySize: { type: String, required: true },
  lowerSize: { type: String, required: true },
  wicketKeeping: { type: String, enum: ['Yes', 'No'], default: 'No' }, // Added enum

  skills: {
    batting: { type: String, enum: ['Right Hand', 'Left Hand', 'None'], default: 'None' },
    bowling: { type: String, enum: ['Right Hand', 'Left Hand', 'None'], default: 'None' },
    fieldingPreference: { type: String }
  },

  cricheroesId: { type: String },
  instagramId: { type: String },

  declarationAccepted: { type: Boolean, required: true },
  signatureName: { type: String, required: true, trim: true },
  submissionDate: { type: Date, required: true },
  submissionPlace: { type: String, required: true, trim: true }
}, { timestamps: true });

const Player = mongoose.model('Player', PlayerSchema);
export default Player;