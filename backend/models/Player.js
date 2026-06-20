import mongoose from 'mongoose';

const PlayerSchema = new mongoose.Schema({
  // Personal Details
  serialNumber: { type: String, unique: true },
  fullName: { type: String, required: true, trim: true },
  dob: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female'], required: true },
  profession: { 
    type: String, 
    enum: ['Business', 'Salaried', 'Self Employed'], 
    required: true 
  },
  photo: { type: String, required: true },

whatsappNumber: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => /^91\d{10}$/.test(v),
      message: "WhatsApp number must be exactly 10 digits."
    }

  },
  emailId: { type: String, required: true, lowercase: true, trim: true, unique: true, },
  residentialAddress: { type: String, required: true },
  
  district: { type: String, required: true },
  state: { type: String, required: true },
  pinCode: { type: String, required: true },
  
  // Aadhaar: Note that storage should be handled with extreme care and encryption
  aadharNumber: { 
    type: String, 
    required: true, 
    unique: true,
    validate: {
      validator: (v) => /^\d{12}$/.test(v),
      message: "Aadhar must be exactly 12 digits long."
    }
  },

  // Kit Details
  jerseyName: { type: String, trim: true },
  jerseyNumber: { type: String },
  jerseySize: { type: String, enum: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL', 'XXXXL'] },
  lowerSize: { type: String },


  wicketKeeping: { type: String, enum: ['Yes', 'No'], default: 'No' },

  // Skills & Game
 skills: {
  batting: {
    type: String,
    enum: ['','Right Hand', 'Left Hand'],
    default: ''
  },

  bowling: {
    type: String,
    enum: [
      '',
      'Right Hand Fast',
      'Left Hand Fast',
      'Right Hand Spinner',
      'Left Hand Spinner'
    ],
    default: ''
  },

  allRounder: {
    type: [String],
    default: []
  }
},
  // Social & Profiles
  cricheroesId: { type: String, sparse: true, unique: true},
  instagramId: { type: String },

  // Payment
  paymentMethod: { type: String, enum: ['UPI', 'Cash'], required: true },
 
  utrReceipt: { type: String }, 

  // Declaration
  declarationAccepted: { type: Boolean, required: true },
  signatureName: { type: String, required: true, trim: true },
  submissionDate: { type: Date, required: true },
  submissionPlace: { type: String, required: true, trim: true }
}, { timestamps: true });

const Player = mongoose.model('Player', PlayerSchema);
export default Player;