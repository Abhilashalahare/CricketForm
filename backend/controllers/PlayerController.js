import Player from '../models/Player.js';
import Counter from '../models/Counter.js';

// REGISTER PLAYER
export const registerPlayer = async (req, res) => {
  try {
    // 1. Validate that files were uploaded by the middleware
    if (!req.files || !req.files['photo'] || !req.files['utrReceipt']) {
      return res.status(400).json({ error: "Please upload both profile photo and payment receipt." });
    }

    // 2. Find and increment the serial number counter
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'playerId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    const formattedSerial = `JYCC-${counter.seq.toString().padStart(3, '0')}`;

    // 3. Extract file paths from Multer
    const photoPath = req.files['photo'][0].path;
    const receiptPath = req.files['utrReceipt'][0].path;

    // 4. Create new player instance
    // We spread req.body to get all text fields, then override files and serial
    const newPlayer = new Player({
      ...req.body,
      submissionDate: req.body.submissionDate || new Date(),
      photo: photoPath,
      utrReceipt: receiptPath,
      serialNumber: formattedSerial,
      // Note: Ensure your Aadhaar number is treated as a string, not a number
      aadharNumber: req.body.aadharNumber 
    });
    
    await newPlayer.save();
    
    res.status(201).json({ 
      message: "Registration Successful", 
      serial: formattedSerial 
    });

  } catch (error) {
    console.error("Backend Error:", error);

    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages[0] });
    }

    // Handle Duplicate Key Errors (Unique constraint)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      const formattedField = field
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());

      return res.status(400).json({ 
        error: `${formattedField === 'Aadhar Number' ? '[Aadhaar Redacted]' : formattedField} is already registered.` 
      });
    }

    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// GET ALL PLAYERS
export const getAllPlayers = async (req, res) => {
  try {

    const players = await Player.find().sort({ createdAt: -1 });

    res.json(players);
  } catch (error) {
    console.error("FULL ERROR:", error);
    console.error("MESSAGE:", error.message);

    res.status(500).json({
      error: "Failed to fetch player data",
      details: error.message
    });
  }
};

// GET SINGLE PLAYER
export const getPlayerById = async (req, res) => {
  try {
    
    
    const player = await Player.findById(req.params.id);
   
    
    if (!player) return res.status(404).json({ error: 'Player not found.' });
    res.json(player);
   
    
  } catch (error) {
    res.status(500).json({ error: 'Server Error.' });
  }
};

// DELETE PLAYER
export const deletePlayer = async (req, res) => {
  try {
    await Player.findByIdAndDelete(req.params.id);
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete player' });
  }
};