import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
 
  fullName: { type: String, required: true },
  profession: { type: String, enum: ['Business', 'Salaried', 'Self Employed'] },
  photo: { type: String }, 
 mobileNumber: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        // Validates that the string is exactly 10 digits
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit mobile number!`
    }
  },
  whatsappNumber: { 
    type: String,
    validate: {
      validator: function(v) {
        // Validates that the string is exactly 10 digits
        return /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit WhatsApp number!`
    }
  },
  emailId: { type: String, required: true, unique: true },
  residentialAddress: { type: String },
 aadharNumber: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: function(v) {
        // Validates that the string is exactly 12 digits
        return /^\d{12}$/.test(v);
      },
      message: props => `[Aadhaar Redacted] must be exactly 12 digits long!`
    }
  },
  utrNumber: { type: String, unique: true, required: true },
  utrReceipt: { type: String, required: true},
  jerseyName: { type: String, required: true },
  jerseyNumber: { type: String, required: true },
  jerseySize: { type: String, required: true },
  lowerSize: { type: String, required: true },
  wicketKeeping: { type: String, default: 'No' },

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