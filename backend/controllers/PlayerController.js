import Player from '../models/Player.js';
import Counter from '../models/Counter.js';

// REGISTER PLAYER
export const registerPlayer = async (req, res) => {
 try {
    // 1. Find and increment the counter
    const counter = await Counter.findByIdAndUpdate(
      { _id: 'playerId' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );

    // 2. Format the serial number (e.g., JYCC-001)
    const formattedSerial = `JYCC-${counter.seq.toString().padStart(3, '0')}`;

    // 3. Save player with the serial number
    const newPlayer = new Player({
      ...req.body,
      serialNumber: formattedSerial
    });
    
    await newPlayer.save();
    res.status(201).json({ message: "Registration Successful", serial: formattedSerial });
  }catch (error) {
    console.error("Backend Validation Error:", error);

    // Handle Mongoose Validation Errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages[0] });
    }

    // UPDATED: Handle Duplicate Key Errors (Unique constraint)
    if (error.code === 11000) {
      // Get the name of the field that caused the conflict
      const field = Object.keys(error.keyValue)[0];
      
      // Format the field name (e.g., 'aadharNumber' -> 'Aadhaar Number')
      const formattedField = field
        .replace(/([A-Z])/g, ' $1') // Add space before capitals
        .replace(/^./, str => str.toUpperCase()); // Capitalize first letter

      return res.status(400).json({ 
        error: `${formattedField} is already registered.` 
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
    res.status(500).json({ error: 'Failed to fetch player data.' });
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